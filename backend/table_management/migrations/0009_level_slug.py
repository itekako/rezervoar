# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('table_management', '0008_auto_20160406_1206'),
    ]

    operations = [
        migrations.AddField(
            model_name='level',
            name='slug',
            field=models.SlugField(default=b'ime'),
            preserve_default=True,
        ),
    ]
