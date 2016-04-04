# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0003_guest'),
    ]

    operations = [
        migrations.RenameField(
            model_name='guest',
            old_name='name',
            new_name='first_name',
        ),
        migrations.AlterField(
            model_name='guest',
            name='email',
            field=models.EmailField(max_length=75, unique=True, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='guest',
            name='phone_number',
            field=models.CharField(unique=True, max_length=15),
        ),
        migrations.AlterField(
            model_name='table',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='table',
            name='updated',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
