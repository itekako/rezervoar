from django.shortcuts import render
from table_management.models import Guest


def index(request):
    return HttpResponse("Hello world!")


def guests(request):
    guests_list = Guest.objects.order_by('first_name')
    context_dict = {'guests': guests_list}

    return render(request, "table_management/gosti.html", context_dict)
