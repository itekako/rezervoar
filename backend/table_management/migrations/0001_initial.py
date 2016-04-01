# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('label', models.CharField(unique=True, max_length=128)),
                ('scheme', models.CharField(unique=True, max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('label', models.CharField(unique=True, max_length=128)),
                ('seats', models.IntegerField(default=0)),
                ('created', models.DateTimeField(default=datetime.datetime.now)),
                ('updated', models.DateTimeField(default=None)),
                ('level', models.ForeignKey(to='table_management.Level')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
