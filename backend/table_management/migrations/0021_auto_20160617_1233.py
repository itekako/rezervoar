# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0020_auto_20160601_1226'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Restorant',
            new_name='Restaurant',
        ),
    ]
