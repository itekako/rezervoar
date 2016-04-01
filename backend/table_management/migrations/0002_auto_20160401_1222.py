# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='table',
            name='updated',
            field=models.DateTimeField(null=True, blank=True),
        ),
    ]
