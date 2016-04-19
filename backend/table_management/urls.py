from django.conf.urls import patterns, url
from table_management import views

urlpatterns = patterns(
    '',
    url(r'^$', views.index, name='index'),
    # GOSTI
    url(r'^api/guests/$', views.Guests.as_view()),
    url(r'^api/guest/(?P<pk>[0-9]+)/$', views.GuestById.as_view()),
    # STOLOVI
    url(r'^api/tables/$', views.tables, name='tables'),
    url(r'^api/table/(?P<pk>[0-9]+)/$', views.TableById.as_view()),
    url(r'^api/tables-per-level/(?P<level>[a-zA-z0-9\s_-]+)/$', views.TablesPerLevel.as_view()),
    url(r'^api/reserved-tables/$', views.TablesReserved.as_view()),
    # url(r'^api/reserved-tables/(?P<sd>\d{2}-\d{2}-\d{4}-\d{2}-\d{2})/(?P<ed>\d{2}-\d{2}-\d{4}-\d{2}-\d{2})/(?P<label>[a-zA-z0-9\s_-]+)/$',views.TablesReserved.as_view()),
    # NIVOI
    url(r'^api/levels/$', views.levels, name='levels'),
    url(r'^api/level/(?P<label>[a-zA-z0-9\s_-]+)/$', views.LevelByLabel.as_view()),
    # REZERVACIJE
    url(r'^api/reservations/$', views.ReservationAll.as_view()),
    url(r'^api/reservation/(?P<pk>[0-9]+)/$', views.ReservationById.as_view()),
    )
