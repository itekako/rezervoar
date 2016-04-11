# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('table_management', '0006_auto_20160404_1324'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('tables', models.CharField(max_length=128)),
                ('number_of_guests', models.IntegerField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('comment', models.CharField(max_length=256)),
                ('valid', models.IntegerField(default=1)),
                ('canceled', models.IntegerField(default=0)),
                ('id_guest', models.ForeignKey(to='table_management.Guest')),
                ('id_original', models.ForeignKey(default=None, blank=True, to='table_management.Reservation', null=True)),
                ('id_user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
