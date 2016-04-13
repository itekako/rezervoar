# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0010_auto_20160413_1044'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='level',
            name='slug',
        ),
    ]
