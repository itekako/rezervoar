from django.shortcuts import render
from django.http import Http404
from datetime import datetime
from datetime import timedelta
from datetime import tzinfo
import pytz
from django.core import serializers
from django.contrib.auth.models import User

from table_management.models import Guest, Table, Level, Reservation
from table_management.serializers import GuestSerializer, TableSerializer,\
    LevelSerializer, ReservationSerializer, UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json


def index(request):
    return HttpResponse("Hello world!")


def guests(request):
    guests_list = Guest.objects.order_by('first_name')
    context_dict = {'guests': guests_list}

    return render(request, "table_management/gosti.html", context_dict)


def tables(request):
    tables_list = Table.objects.order_by('label')
    context_dict = {'tables': tables_list}

    return render(request, "table_management/stolovi.html", context_dict)


def levels(request):
    levels_list = Level.objects.order_by('label')
    context_dict = {'levels': levels_list}

    return render(request, "table_management/nivoi.html", context_dict)


def reservations(request):
    reservations_list = Reservation.objects.order_by('start_date')
    context_dict = {'reservations': reservations_list}

    return render(request, "table_management/rezervacije.html", context_dict)


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


# vraca sto sa zadatim ID
class TableById(APIView):
    def get_object(self, pk):
        try:
            return Table.objects.get(pk=pk)
        except Table.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        table = self.get_object(pk)
        table = TableSerializer(table)
        return Response(table.data)


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


# dodaje novu rezervaciju u bazu
class AddReservation(APIView):
    def post(self, request, format=None):
        data = request.data
        start_d = str(data.get('date')) + " " + str(data.get('startTime'))
        end_d = str(data.get('date')) + " " + str(data.get('endTime'))
        # iz string u datetime
        start_d = datetime.strptime(start_d, "%d.%m.%Y %H:%M")
        end_d = datetime.strptime(end_d, "%d.%m.%Y %H:%M")
        # dodajemo casovnu zonu
        start_d = start_d.replace(tzinfo=pytz.UTC)
        end_d = end_d.replace(tzinfo=pytz.UTC)
        # ukoliko je endDate nakon ponoci dodajemo mu 1 dan
        if start_d.time() > end_d.time():
            end_d = end_d + timedelta(days=1)
        # proveravamo da li vec posotji taj gost u bazi
        # ako ne postoji dodajemo ga
        firstName = data.get('firstName')
        lastName = data['lastName']
        phoneNumber = data['phoneNumber']
        guest = Guest.objects.filter(first_name=firstName).filter(last_name=lastName).filter(phone_number=phoneNumber)
        if not guest:
            # ne postoji, moramo da ga dodamo
            newGuest = {}
            newGuest['first_name'] = firstName
            newGuest['last_name'] = lastName
            newGuest['phone_number'] = phoneNumber
            newGuest = GuestSerializer(data=newGuest)
            if newGuest.is_valid() is False:
                return Response(newGuest.errors)
            else:
                print "sacuvam ga:"
                guest = newGuest.save()
        else:
            # postoji vec takav gost
            guest = guest[0]
        # proveravamo da li postoji takav user u bazi
        username = data.get('username')
        user = User.objects.filter(username=username)
        print user
        if not user:
            answer = {'error': 'User with that username not found'}
            print answer
            return Response(answer)
        else:
            user = user[0]
        # dodajemo novu rezervaciju
        newReservation = {}
        newReservation['start_date'] = start_d
        newReservation['end_date'] = end_d
        newReservation['id_guest'] = guest.id
        newReservation['tables'] = data['tables']
        newReservation['number_of_guests'] = data['numberOfGuests']
        newReservation['id_original'] = None
        newReservation['id_user'] = user.id
        newReservation['comment'] = data['comment']
        newReservation['valid'] = 1
        newReservation['canceled'] = 0
        newReservation = ReservationSerializer(data=newReservation)
        if newReservation.is_valid() is False:
            return Response(newReservation.errors)
            print newReservation.errors
        else:
            newReservation.save()
        return Response(request.data)


# menja vec postojecu rezervaciju
class UpdateReservation(APIView):
    def post(self, request, format=None):
        data = request.data
        # nalazimo originalnu rezervaciju
        idOriginal = int(data.get('idOriginal'))
        originalReservation = Reservation.objects.get(pk=idOriginal)
        newReservation = {}
        newReservation['id_original'] = idOriginal
        newReservation['id_guest'] = originalReservation.id_guest.id
        if (data.get('startDate') != ''):
            start_d = datetime.strptime(data.get('startDate'), "%d.%m.%Y %H:%M")
            start_d = start_d.replace(tzinfo=pytz.UTC)
            newReservation['start_date'] = start_d
        else:
            newReservation['start_date'] = originalReservation.start_date
        if (data.get('endDate') != ''):
            end_d = datetime.strptime(data.get('endDate'), "%d.%m.%Y %H:%M")
            end_d = end_d.replace(tzinfo=pytz.UTC)
            newReservation['end_date'] = end_d
        else:
            newReservation['end_date'] = originalReservation.end_date
        if (data.get('tables') != ''):
            newReservation['tables'] = data.get('tables')
        else:
            newReservation['tables'] = originalReservation.tables
        if (data.get('numberOfGuests') != ''):
            newReservation['number_of_guests'] = data.get('numberOfGuests')
        else:
            newReservation['number_of_guests'] = originalReservation.number_of_guests
        # proveravamo da li postoji user koij menja rezervaciju u bazi
        username = data.get('username')
        user = User.objects.filter(username=username)
        if not user:
            answer = {'error': 'User with that username not found'}
            print answer
            return Response(answer)
        else:
            user = user[0]
        newReservation['id_user'] = user.id
        if (data.get('comment') != ''):
            newReservation['comment'] = data.get('comment')
        else:
            newReservation['comment'] = originalReservation.comment
        newReservation['valid'] = 1
        newReservation['canceled'] = 0
        # dodajemo novu rezervaciju
        newReservation = ReservationSerializer(data=newReservation)
        if newReservation.is_valid() is False:
            return Response(newReservation.errors)
            print newReservation.errors
        else:
            newReservation.save()
        # staroj menjamo VALID
        updatedOriginal = originalReservation.__dict__
        updatedOriginal['valid'] = 0
        updatedOriginal['id_user'] = originalReservation.id_user.id
        updatedOriginal['id_guest'] = originalReservation.id_guest.id
        updatedOriginal = ReservationSerializer(originalReservation, data=updatedOriginal)
        if updatedOriginal.is_valid() is False:
            return Response(updatedOriginal.errors)
            print updatedOriginal.errors
        else:
            updatedOriginal.save()
        return Response(request.data)


# vraca stolove rezervisane za odredjeni datum, na odrejenom nivou
class TablesReserved(APIView):
    def post(self, request, format=None):
        data = request.data
        start_d = str(data.get('date')) + " " + str(data.get('startTime'))
        end_d = str(data.get('date')) + " " + str(data.get('endTime'))
        # iz string u datetime
        start_d = datetime.strptime(start_d, "%d.%m.%Y %H:%M")
        end_d = datetime.strptime(end_d, "%d.%m.%Y %H:%M")
        # dodajemo casovnu zonu
        start_d = start_d.replace(tzinfo=pytz.UTC)
        end_d = end_d.replace(tzinfo=pytz.UTC)
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
        lista = result['tables']
        # prolazimo kroz sve dobijene rezervacije
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
                    listElement['startDate'] = reservation.start_date.strftime("%d.%m.%Y %H:%M")
                    listElement['endDate'] = reservation.end_date.strftime("%d.%m.%Y %H:%M")
                    tmp = next((item for item in lista if str(item["label"]) == str(tableLabel)), None)
                    # da li se sto vec nalazi u listi
                    if tmp is None:
                        insertData = {}
                        insertData['takenList'] = []
                        insertData['takenList'].append(listElement)
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
                        print insertData
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
        # postoje li na tom spratu stolovi koji nisu rezervisani, njih oznacavamo kao slobodne
        id_level = Level.objects.get(label=level).id
        allTables = Table.objects.all().filter(level=id_level)
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
                result['tables'].append(insertData)
        # sortiramo listu zauzeca stola po vremenu
        for item in result['tables']:
            item['takenList'] = sorted(item['takenList'], key=lambda k: k['startDate'])
        return Response(json.loads(json.dumps(result)), content_type="application/json")


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


# vraca rezervaciju sa zadatim ID
class ReservationById(APIView):
    def get_object(self, pk):
        try:
            return Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        reservation = self.get_object(pk)
        reservation = ReservationSerializer(reservation)
        return Response(reservation.data)


# vraca sve rezervacije
class ReservationAll(APIView):
    def get_object(self, pk):
        try:
            return Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        reservation = Reservation.objects.all()
        reservation = ReservationSerializer(reservation, many=True)
        return Response(reservation.data)
