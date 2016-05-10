# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0018_auto_20160429_1806'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='canceled',
            field=models.IntegerField(default=0, editable=False),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='valid',
            field=models.IntegerField(default=1, editable=False),
        ),
        migrations.AlterField(
            model_name='table',
            name='height',
            field=models.IntegerField(default=30),
        ),
        migrations.AlterField(
            model_name='table',
            name='width',
            field=models.IntegerField(default=30),
        ),
    ]
