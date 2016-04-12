from django.conf.urls import patterns, url
from table_management import views

urlpatterns = patterns(
    '',
    url(r'^$', views.index, name='index'),
    url(r'^guests/$', views.guests, name='guests'),
    url(r'^tables/$', views.tables, name='tables'),
    url(r'^levels/$', views.levels, name='levels'),
    url(r'^reservations/$', views.reservations, name='reservations'),
    url(r'^api/guest/(?P<pk>[0-9]+)/$', views.GuestDetail.as_view()),
    url(r'^api/table/(?P<pk>[0-9]+)/$', views.TableDetail.as_view()),
    url(r'^api/level/(?P<pk>[0-9]+)/$', views.LevelDetail.as_view()),
    url(r'^api/reservation/(?P<pk>[0-9]+)/$', views.ReservationDetail.as_view()),
    )
