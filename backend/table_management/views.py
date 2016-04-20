from django.shortcuts import render
from django.http import Http404
from datetime import datetime

from table_management.models import Guest, Table, Level, Reservation
from table_management.serializers import GuestSerializer, TableSerializer,\
    LevelSerializer, ReservationSerializer

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


# vraca stolove rezervisane za odredjeni datum, na odrejenom nivou
class TablesReserved(APIView):
    def get_object(self, pk):
        try:
            return Table.objects.get(pk=pk)
        except Table.DoesNotExist:
            raise Http404

    # def get(self, request, sd, ed, label, format=None):
    #     start_d = datetime.strptime(sd, "%d-%m-%Y-%H-%M")
    #     end_d = datetime.strptime(ed, "%d-%m-%Y-%H-%M")
    #     reservations = Reservation.objects.filter(start_date__lt=start_d)\
    #         .filter(end_date__gt=end_d)
    #     # za svaku rezervaciju koja ispunjava uslove prolazimo kroz stolove
    #     # listOfTables je spisak svih zauzetih stolova
    #     # reservedTables ce biti spisak svik zauzetih stolova, na tom spratu
    #     reservedTables = set()
    #     for reserve in reservations:
    #         listOfTables = reserve.tables
    #         # prolazimo kroz stolove i gledamo na kom su nivou
    #         for tableLabel in listOfTables.split(","):
    #             tableLabel = tableLabel.strip()  # uklanjamo beline
    #             tableByLabel = Table.objects.get(label=tableLabel)
    #             if str(tableByLabel.level) == str(label):
    #                 reservedTables.add(tableByLabel.id)
    #     reservedTables = Table.objects.filter(pk__in=reservedTables)
    #     reservedTables = TableSerializer(reservedTables, many=True)
    #     print reservedTables.data
    #     return Response(reservedTables.data)

    def post(self, request, format=None):
        data = request.data
        date = data.get('date')
        start_d = data.get('startTime')
        end_d = data.get('endTime')
        start_d = str(date) + " " + str(start_d)
        end_d = str(date) + " " + str(end_d)
        start_d = datetime.strptime(start_d, "%d.%m.%Y %H:%M")
        end_d = datetime.strptime(end_d, "%d.%m.%Y %H:%M")
        level = str(data.get('level'))
        reservations = Reservation.objects.filter(start_date__gte=start_d)\
            .filter(start_date__lte=end_d) | \
            Reservation.objects.filter(end_date__gte=start_d)\
            .filter(end_date__lte=end_d) | \
            Reservation.objects.filter(start_date__lte=start_d)\
            .filter(end_date__gte=end_d)
        result = {}
        result['tables'] = []
        for reserve in reservations:
            listOfTables = reserve.tables
            # prolazimo kroz stolove i gledamo na kom su nivou
            for tableLabel in listOfTables.split(","):
                tableLabel = tableLabel.strip()  # uklanjamo beline
                tableByLabel = Table.objects.get(label=tableLabel)
                if str(tableByLabel.level) == str(level):
                    insertData = {}
                    insertData['label'] = tableByLabel.label
                    insertData['startDate'] = reserve.start_date.strftime("%d.%m.%Y %H:%M")
                    insertData['endDate'] = reserve.end_date.strftime("%d.%m.%Y %H:%M")
                    insertData['comment'] = reserve.comment
                    insertData['capacity'] = tableByLabel.seats
                    insertData['taken'] = True
                    result['tables'].append(insertData)
        id_level = Level.objects.get(label=level).id
        allTables = Table.objects.all().filter(level=id_level)
        lista = result['tables']
        for table in allTables:
            tmp = any(item for item in lista if str(item["label"]) == str(table.label))
            if tmp is False:
                insertData = {}
                insertData['label'] = table.label
                insertData['startDate'] = None
                insertData['endDate'] = None
                insertData['comment'] = None
                insertData['capacity'] = table.seats
                insertData['taken'] = False
                result['tables'].append(insertData)
        print type(json.loads(json.dumps(result)))
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
