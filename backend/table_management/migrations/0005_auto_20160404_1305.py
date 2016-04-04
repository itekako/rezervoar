# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0004_auto_20160404_0836'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guest',
            name='email',
            field=models.EmailField(unique=True, max_length=75, blank=True),
        ),
    ]
