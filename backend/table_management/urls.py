from django.conf.urls import patterns, url
from table_management import views

urlpatterns = patterns(
    '',
    # USER
    url(r'^api/user-by-username/(?P<username>[a-zA-z0-9\s_-]+)$', views.UserByUsername.as_view()),
    # GOSTI
    url(r'^api/guests/$', views.Guests.as_view()),
    url(r'^api/guest/(?P<pk>[0-9]+)/$', views.GuestById.as_view()),
    # STOLOVI
    url(r'^api/tables-per-level/(?P<level>[a-zA-z0-9\s_-]+)/$', views.TablesPerLevel.as_view()),
    url(r'^api/tables/$', views.Tables.as_view()),
    # NIVOI
    url(r'^api/level/(?P<label>[a-zA-z0-9\s_-]+)/$', views.LevelByLabel.as_view()),
    url(r'^api/levels/$', views.Levels.as_view()),
    # REZERVACIJE
    url(r'^api/reservations/$', views.Reservations.as_view()),
    url(r'^api/reservations/(?P<date>\d\d-\d\d-\d\d\d\d)$', views.Reservations.as_view()),
    url(r'^api/reservation/(?P<pk>[0-9]+)/$', views.ReservationById.as_view()),
    url(r'^api/cancel-reservation/$', views.CancelReservation.as_view()),
    # LOGIN
    url(r'^api/authentication/$', views.Authentication.as_view()),
    )
