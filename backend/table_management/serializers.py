from rest_framework import serializers
from table_management.models import Guest


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ('id', 'first_name', 'last_name', 'phone_number', 'email')
