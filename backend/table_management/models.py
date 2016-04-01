from django.db import models
from wheel.metadata import unique
from datetime import datetime

class Level(models.Model):
    label = models.CharField(max_length=128, unique=True)
    scheme = models.CharField(max_length=128, unique=True)

    def __unicode__(self):
        return self.label

class Table(models.Model):
    label = models.CharField(max_length=128, unique=True)
    level = models.ForeignKey(Level)
    seats = models.IntegerField(default=0)
    created = models.DateTimeField(default=datetime.now)
    updated = models.DateTimeField(null=True, blank=True)

    def __unicode__(self):
        return self.label
