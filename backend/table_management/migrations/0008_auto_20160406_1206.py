# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0007_reservation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='id_original',
            field=models.ForeignKey(default=None, blank=True, to='table_management.Reservation', null=True),
        ),
    ]
