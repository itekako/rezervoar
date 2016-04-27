# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0016_remove_level_slug'),
    ]

    operations = [
        migrations.CreateModel(
            name='Restorant',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('opening_time', models.TimeField()),
                ('closing_time', models.TimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
