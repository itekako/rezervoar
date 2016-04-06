from django.shortcuts import render
from django.http import Http404

from table_management.models import Guest
from table_management.serializers import GuestSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


def index(request):
    return HttpResponse("Hello world!")


def guests(request):
    guests_list = Guest.objects.order_by('first_name')
    context_dict = {'guests': guests_list}

    return render(request, "table_management/gosti.html", context_dict)


class GuestDetail(APIView):
    def get_object(self, pk):
        try:
            return Guest.objects.get(pk=pk)
        except Guest.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        guest = self.get_object(pk)
        guest = GuestSerializer(guest)
        return Response(guest.data)
