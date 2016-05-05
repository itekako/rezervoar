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
    url(r'^api/table/(?P<pk>[0-9]+)/$', views.TableById.as_view()),
    url(r'^api/tables-per-level/(?P<level>[a-zA-z0-9\s_-]+)/$', views.TablesPerLevel.as_view()),
    url(r'^api/reserved-tables/$', views.TablesReserved.as_view()),
    url(r'^api/update-tables/$', views.UpdateTables.as_view()),
    # NIVOI
    url(r'^api/level/(?P<label>[a-zA-z0-9\s_-]+)/$', views.LevelByLabel.as_view()),
    # REZERVACIJE
    url(r'^api/reservations/$', views.ReservationAll.as_view()),
    url(r'^api/add-reservation/$', views.AddReservation.as_view()),
    url(r'^api/update-reservation/$', views.UpdateReservation.as_view()),
    url(r'^api/reservation/(?P<pk>[0-9]+)/$', views.ReservationById.as_view()),
    )
