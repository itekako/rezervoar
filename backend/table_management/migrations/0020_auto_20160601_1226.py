# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0019_auto_20160507_1617'),
    ]

    operations = [
        migrations.RenameField(
            model_name='level',
            old_name='scheme',
            new_name='schema',
        ),
    ]
