from rest_framework import serializers
from table_management.models import Guest, Table, Level, Reservation


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ('id', 'first_name', 'last_name', 'phone_number', 'email')


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ('id', 'label', 'level', 'seats', 'created', 'updated')


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ('id', 'label', 'scheme')


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('id', 'start_date', 'end_date', 'id_guest', 'tables', 'number_of_guests', 'created', 'id_original', 'id_user', 'comment', 'valid', 'canceled')
