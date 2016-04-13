# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0014_level_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='level',
            name='slug',
            field=models.SlugField(unique=True),
        ),
    ]
