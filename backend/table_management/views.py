from django.shortcuts import render
from django.http import Http404
from datetime import datetime
from datetime import timedelta
from datetime import tzinfo
from pytz import timezone
import pytz

from django.core import serializers
from django.contrib.auth.models import User

from table_management.models import Guest, Table, Level, Reservation, Restaurant
from table_management.serializers import GuestSerializer, TableSerializer,\
    LevelSerializer, ReservationSerializer, UserSerializer, RestaurantSerializer

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json


class Authentication(APIView):
    def post(self, request):
        data = request.data
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if user is not None:
            # the password verified for the user
            if user.is_active:
                print("User is valid, active and authenticated")
                user = UserSerializer(user)
                return Response(user.data)
            else:
                answer = {'error': 'The password is valid, but the account has been disabled!'}
                print("The password is valid, but the account has been disabled!")
                return Response(answer)
        else:
            # the authentication system was unable to verify the username and password
            answer = {'error': 'The username or password are incorrect.'}
            print("The username or password are incorrect.")
            return Response(answer)



# vraca gosta sa zadatim ID
class GuestById(APIView):
    def get_object(self, pk):
        try:
            return Guest.objects.get(pk=pk)
        except Guest.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        guest = self.get_object(pk)
        guest = GuestSerializer(guest)
        return Response(guest.data)


# vraca sve goste
class Guests(APIView):
    def get_object(self, pk):
        try:
            return Guest.objects.get(pk=pk)
        except Guest.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        guests = Guest.objects.all()
        guests = GuestSerializer(guests, many=True)
        return Response(guests.data)


# vraca sve stolove na nivou sa zadatim Label
class TablesPerLevel(APIView):
    def get_object(self, pk):
        try:
            return Table.objects.get(pk=pk)
        except Table.DoesNotExist:
            raise Http404

    def get(self, request, level, format=None):
        id_level = Level.objects.get(label=level).id
        tables = Table.objects.filter(level=id_level)
        tables = TableSerializer(tables, many=True)
        return Response(tables.data)


# vraca user-a (konobara) koji ima trazeni username
class UserByUsername(APIView):
    def get(self, request, username, format=None):
        user = User.objects.filter(username=username)
        user = user[0]
        user = UserSerializer(user)
        return Response(user.data)


def parseDate(date, time):
    resultDate = str(date) + " " + str(time)
    resultDate = datetime.strptime(resultDate, "%d.%m.%Y %H:%M")
    localtz = timezone('Europe/Belgrade')
    resultDate = localtz.localize(resultDate)
    return resultDate


def makeReservation(start_d, end_d, guest, tables, numberOfGuests, user, comment):
    newReservation = {}
    newReservation['start_date'] = start_d
    newReservation['end_date'] = end_d
    newReservation['id_guest'] = guest.id
    newReservation['tables'] = ','.join(tables)
    newReservation['number_of_guests'] = numberOfGuests
    newReservation['id_original'] = None
    newReservation['id_user'] = user.id
    newReservation['comment'] = comment
    newReservation['valid'] = 1
    newReservation['canceled'] = 0
    return newReservation


def makeUpdatedReservation(data, originalReservation):
    newReservation = {}
    newReservation['id_original'] = originalReservation.id
    newReservation['id_guest'] = originalReservation.id_guest.id
    if (data.get('startDate') != ''):
        start_d = datetime.strptime(data.get('startDate'), "%d.%m.%Y %H:%M")
        localtz = timezone('Europe/Belgrade')
        start_d = localtz.localize(start_d)
        newReservation['start_date'] = start_d
    else:
        newReservation['start_date'] = originalReservation.start_date

    if (data.get('endDate') != ''):
        end_d = datetime.strptime(data.get('endDate'), "%d.%m.%Y %H:%M")
        localtz = timezone('Europe/Belgrade')
        end_d = localtz.localize(end_d)
        newReservation['end_date'] = end_d
    else:
        newReservation['end_date'] = originalReservation.end_date
    tables = ','.join(data.get('tables'))
    if (tables != ''):
        newReservation['tables'] = tables
    else:
        newReservation['tables'] = originalReservation.tables
    if (data.get('numberOfGuests') != ''):
        newReservation['number_of_guests'] = data.get('number_of_guests')
    else:
        newReservation['number_of_guests'] = originalReservation.number_of_guests
    # proveravamo da li postoji user koij menja rezervaciju u bazi
    user = User.objects.get(id=data.get('id_user'))
    if not user:
        answer = {'error': 'User not found'}
        return Response(answer)

    newReservation['id_user'] = user.id

    if (data.get('comment') != ''):
        newReservation['comment'] = data.get('comment')
    else:
        newReservation['comment'] = originalReservation.comment

    newReservation['valid'] = 1
    newReservation['canceled'] = 0

    return newReservation


def updateOriginal(originalReservation):
    updatedOriginal = originalReservation.__dict__
    updatedOriginal['valid'] = 0
    updatedOriginal['id_user'] = originalReservation.id_user.id
    updatedOriginal['id_guest'] = originalReservation.id_guest.id

    return updatedOriginal


def makeGuest(firstName, lastName, phoneNumber, email):
    newGuest = {}
    newGuest['first_name'] = firstName
    newGuest['last_name'] = lastName
    newGuest['phone_number'] = phoneNumber
    newGuest['email'] = email
    return newGuest


def addFreeTables(allTables, lista, result):
    for table in allTables:
        # da li je vec rezervisan taj sto
        tmp = any(item for item in lista if str(item["label"]) == str(table.label))
        if tmp is False:
            insertData = {}
            insertData['label'] = table.label
            insertData['takenList'] = []
            insertData['comment'] = None
            insertData['seats'] = table.seats
            insertData['taken'] = False
            position = {}
            position['left'] = table.position_left
            position['top'] = table.position_top
            insertData['position'] = position
            dimensions = {}
            dimensions['width'] = table.width
            dimensions['height'] = table.height
            insertData['dimensions'] = dimensions
            result['tables'].append(insertData)
    return result


def addTakenTables(reservations, level, lista, startOriginal, endOriginal, result):
    local_timezone = pytz.timezone('Europe/Belgrade')
    for reservation in reservations:
        # ako rezervacija nije validna, ili je otkazana preskacemo je
        if (reservation.valid == 0 or reservation.canceled == 1):
            continue
        listOfTables = reservation.tables
        # prolazimo kroz listu stolova rezervacije
        for tableLabel in listOfTables.split(","):
            tableLabel = tableLabel.strip()  # uklanjamo beline
            tableByLabel = Table.objects.get(label=tableLabel)
            # da li se sto nalazi na trazenom spratu
            if str(tableByLabel.level) == str(level):
                listElement = {}
                listElement['startDate'] = reservation.start_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")
                listElement['endDate'] = reservation.end_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")
                tmp = next((item for item in lista if str(item["label"]) == str(tableLabel)), None)
                # da li se sto vec nalazi u listi
                if tmp is None:
                    insertData = {}
                    insertData['takenList'] = []
                    insertData['takenList'].append(listElement)
                    position = {}
                    position['left'] = tableByLabel.position_left
                    position['top'] = tableByLabel.position_top
                    insertData['position'] = position
                    dimensions = {}
                    dimensions['width'] = tableByLabel.width
                    dimensions['height'] = tableByLabel.height
                    insertData['dimensions'] = dimensions
                    insertData['label'] = tableByLabel.label
                    insertData['comment'] = reservation.comment
                    insertData['seats'] = tableByLabel.seats
                    # pupunjavamo 'taken' polje u odnosu na to da li je sto zauzet tokom trazenog vremena
                    # ili samo pola sata ranije ili kasnije
                    if reservation.start_date >= startOriginal and reservation.start_date < endOriginal:
                        insertData['taken'] = True
                    elif reservation.end_date > startOriginal and reservation.end_date <= endOriginal:
                        insertData['taken'] = True
                    else:
                        insertData['taken'] = False
                    result['tables'].append(insertData)
                # ukoliko se vec nalazi, samo dodajemo u takenList
                else:
                    if tmp['taken'] is True:
                        tmp['takenList'].append(listElement)
                        continue
                    elif reservation.start_date >= startOriginal and reservation.start_date < endOriginal:
                        tmp['taken'] = True
                    if reservation.end_date > startOriginal and reservation.end_date <= endOriginal:
                        tmp['taken'] = True
                    tmp['takenList'].append(listElement)
    return result


def updateTable(table):
    label = str(table['label'])
    position = table['position']
    dimensions = table['dimensions']
    originalTable = Table.objects.get(label=label)
    updatedTable = originalTable.__dict__
    updatedTable['position_top'] = int(position['top'])
    updatedTable['position_left'] = int(position['left'])
    updatedTable['width'] = int(dimensions['width'])
    updatedTable['height'] = int(dimensions['height'])
    updatedTable['level'] = originalTable.level.id
    updatedTable = TableSerializer(originalTable, data=updatedTable)
    if updatedTable.is_valid() is False:
        return Response(updatedTable.errors)
    else:
        updatedTable.save()
    return


class Reservations(APIView):
    def get(self, request, date, format=None):
        print "REZERVACIJE PO DATUMU"
        date = datetime.strptime(str(date), "%d-%m-%Y").date()
        local_timezone = pytz.timezone('Europe/Belgrade')
        reservations = Reservation.objects.all()
        result = {}
        result['reservations'] = []
        for reservation in reservations:
            if (reservation.start_date.date() == date and reservation.valid != 0):
                insertData = {}
                insertData['id'] = reservation.id
                insertData['startDate'] = reservation.start_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")
                insertData['endDate'] = reservation.end_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")

                insertData['tables'] = []
                for table in reservation.tables.split(','):
                    table = table.strip()
                    element = {}
                    element['label'] = table
                    insertData['tables'].append(element)
                insertData['numberOfGuests'] = reservation.number_of_guests
                insertData['firstName'] = reservation.id_guest.first_name
                insertData['lastName'] = reservation.id_guest.last_name
                insertData['phoneNumber'] = reservation.id_guest.phone_number
                insertData['email'] = reservation.id_guest.email
                result['reservations'].append(insertData)
        return Response(json.loads(json.dumps(result)), content_type="application/json")

# dodaje novu rezervaciju
    def post(self, request, format=None):
        data = request.data
        start_d = parseDate(data.get('date'), data.get('startTime'))
        end_d = parseDate(data.get('date'), data.get('endTime'))
        if start_d.time() > end_d.time():
            end_d = end_d + timedelta(days=1)
        # proveravamo da li vec posotji taj gost u bazi, ako ne postoji dodajemo ga
        firstName = data.get('firstName')
        lastName = data['lastName']
        phoneNumber = data['phoneNumber']
        email = data['email']

        guest = findGuestByName(firstName, lastName, phoneNumber, email)
        user = findUserByUsername(data.get('username'))

        newReservation = makeReservation(start_d, end_d, guest, data['tables'], data['numberOfGuests'], user, data['comment'])
        newReservation = ReservationSerializer(data=newReservation)
        if newReservation.is_valid() is False:
            return Response(newReservation.errors)
        else:
            newReservation.save()

        return Response(newReservation.data)


# menja vec postojecu rezervaciju
    def put(self, request, format=None):
        data = request.data
        # nalazimo originalnu rezervaciju
        if data.get('idOriginal') is None:
            idOriginal = int(data.get('id'))
        else:
            idOriginal = int(data.get('idOriginal'))
        originalReservation = Reservation.objects.get(pk=idOriginal)
        # dodajemo novu rezervaciju
        newReservation = makeUpdatedReservation(data, originalReservation)
        newReservation = ReservationSerializer(data=newReservation)
        if newReservation.is_valid() is False:
            return Response(newReservation.errors)
        else:
            newReservation.save()
        # staroj menjamo VALID
        updatedOriginal = updateOriginal(originalReservation)
        updatedOriginal = ReservationSerializer(originalReservation, data=updatedOriginal)
        if updatedOriginal.is_valid() is False:
            return Response(updatedOriginal.errors)
        else:
            updatedOriginal.save()

        return Response(request.data)


class CancelReservation(APIView):
    def put(self, request, format=None):
        data = request.data
        idOriginal = int(data.get('idOriginal'))
        originalReservation = Reservation.objects.get(pk=idOriginal)
        updatedOriginal = originalReservation.__dict__
        updatedOriginal['canceled'] = 1
        updatedOriginal['id_user'] = originalReservation.id_user.id
        updatedOriginal['id_guest'] = originalReservation.id_guest.id
        updatedOriginal = ReservationSerializer(originalReservation, data=updatedOriginal)
        if updatedOriginal.is_valid() is False:
            return Response(updatedOriginal.errors)
        else:
            updatedOriginal.save()
        return Response(request.data)


class Tables(APIView):
    # vraca stolove rezervisane za odredjeni datum, na odrejenom nivou
    def post(self, request, format=None):
        data = request.data
        # iz string u datetime
        start_d = parseDate(data.get('date'), data.get('startTime'))
        end_d = parseDate(data.get('date'), data.get('endTime'))
        # ukoliko je endDate nakon ponoci dodajemo mu 1 dan
        if start_d.time() > end_d.time():
            end_d = end_d + timedelta(days=1)
        # pamtimo vremena pre dodavanja pola sata
        startOriginal = start_d
        endOriginal = end_d
        # gledamo pola sata ranije, i pola sata kasnije
        start_d -= timedelta(minutes=30)
        end_d += timedelta(minutes=30)
        # sprat na kom hocemo rezervacije
        level = str(data.get('level'))
        # sve rezervacije koje odgovaraju datom vremenu
        reservations = Reservation.objects.filter(start_date__gte=start_d).filter(start_date__lte=end_d) | \
            Reservation.objects.filter(end_date__gte=start_d).filter(end_date__lte=end_d) | \
            Reservation.objects.filter(start_date__lte=start_d).filter(end_date__gte=end_d)
        result = {}
        result['tables'] = []
        # dodaje sve zauzete stolove koji ispunjavaju uslov
        result = addTakenTables(reservations, level, result['tables'], startOriginal, endOriginal, result)
        # dodaje sve ostale stolove kao slobodne
        id_level = Level.objects.get(label=level).id
        allTables = Table.objects.all().filter(level=id_level)
        result = addFreeTables(allTables, result['tables'], result)
        # sortiramo listu zauzeca stola po vremenu
        for item in result['tables']:
            item['takenList'] = sorted(item['takenList'], key=lambda k: k['startDate'])
        return Response(json.loads(json.dumps(result)), content_type="application/json")


# menja stolovima position i dimensions
    def put(self, request, format=None):
        data = request.data
        tables = data.get('tables')
        for table in tables:
            updateTable(table)
        return Response(request.data)


# vraca level sa zadatim label
class LevelByLabel(APIView):
    def get_object(self, pk):
        try:
            return Level.objects.get(pk=pk)
        except Level.DoesNotExist:
            raise Http404

    def get(self, request, label, format=None):
        level = Level.objects.get(label=label)
        level = LevelSerializer(level)
        return Response(level.data)

# vraca postojece nivoe
class Levels(APIView):
    def get(self, request, format=None):
        levels = Level.objects.all()
        levels = LevelSerializer(levels, many=True)

        return Response(levels.data)

# vraca rezervaciju sa zadatim ID
class ReservationById(APIView):
    def get_object(self, pk):
        try:
            return Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        reservation = self.get_object(pk)
        serialized_res = serializers.serialize('json', [reservation,])
        struct = json.loads(serialized_res)
        res = struct[0]['fields']

        guest = Guest.objects.get(pk=res['id_guest'])

        res['firstName'] = guest.first_name
        res['lastName'] = guest.last_name
        res['phoneNumber'] = guest.phone_number
        res['email'] = guest.email

        local_timezone = pytz.timezone('Europe/Belgrade')
        res['startDate'] = reservation.start_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")
        res['endDate'] = reservation.end_date.replace(tzinfo=pytz.utc).astimezone(local_timezone).strftime("%d.%m.%Y %H:%M")
        res['id'] = reservation.id

        return Response(res)

class Restaurants(APIView):
    def get(self, request, format=None):
        restaurant = Restaurant.objects.get(title='Rezervoar')
        restaurant = RestaurantSerializer(restaurant)
        return Response(restaurant.data)

def findGuestByName(firstName, lastName, phoneNumber, email):
    guest = Guest.objects.filter(first_name=firstName).filter(last_name=lastName).filter(phone_number=phoneNumber)
    if not guest:
        newGuest = makeGuest(firstName, lastName, phoneNumber, email)
        newGuest = GuestSerializer(data=newGuest)
        if newGuest.is_valid() is False:
            return Response(newGuest.errors)
        else:
            guest = newGuest.save()
            return guest
    else:
        return guest[0]

def findUserByUsername(username):
    user = User.objects.filter(username=username)
    if not user:
        answer = {'error': 'User with that username not found'}
        return Response(answer)
    else:
        return user[0]
