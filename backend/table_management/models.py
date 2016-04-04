from django.db import models
from wheel.metadata import unique
from datetime import datetime


class Guest(models.Model):
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.first_name + self.last_name


class Level(models.Model):
    label = models.CharField(max_length=128, unique=True)
    scheme = models.CharField(max_length=128, unique=True)

    def __unicode__(self):
        return self.label


class Table(models.Model):
    label = models.CharField(max_length=128, unique=True)
    level = models.ForeignKey(Level)
    seats = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.label
