from django.conf.urls import patterns, url
from table_management import views

urlpatterns = patterns('',
                       url(r'^$', views.index, name='index'),
                       url(r'^guests/$', views.guests, name='guests'),)
