from django.contrib import admin
from table_management.models import Table, Level, Guest, Reservation, Restorant


class GuestAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone_number', 'email')


class TableAdmin(admin.ModelAdmin):
    list_display = ('label', 'level', 'seats')


class LevelAdmin(admin.ModelAdmin):
    list_display = ('label', 'scheme')


class ReservationAdmin(admin.ModelAdmin):
    list_display = ('tables', 'id_guest', 'start_date', 'end_date', 'number_of_guests', 'comment', 'id_user')

# class LevelAdmin(admin.ModelAdmin):
#     prepopulated_fields = {'slug': ('label',)}

admin.site.register(Restorant)
admin.site.register(Table, TableAdmin)
admin.site.register(Level, LevelAdmin)
admin.site.register(Guest, GuestAdmin)
admin.site.register(Reservation, ReservationAdmin)
