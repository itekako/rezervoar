# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0011_remove_level_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='level',
            name='slug',
            field=models.SlugField(default=''),
            preserve_default=False,
        ),
    ]
