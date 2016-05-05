# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0017_restorant'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='height',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='table',
            name='position_left',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='table',
            name='position_top',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='table',
            name='width',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
