# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0012_level_slug'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='level',
            name='slug',
        ),
    ]
