# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0005_auto_20160404_1305'),
    ]

    operations = [
        migrations.AlterField(
            model_name='guest',
            name='email',
            field=models.EmailField(max_length=75, null=True, blank=True),
        ),
    ]
