from django.contrib import admin
from table_management.models import Table, Level, Guest, Reservation


# class LevelAdmin(admin.ModelAdmin):
#     prepopulated_fields = {'slug': ('label',)}

admin.site.register(Table)
admin.site.register(Level)
admin.site.register(Guest)
admin.site.register(Reservation)
