from django.db import models
from django.contrib.auth.models import User
from wheel.metadata import unique
from datetime import datetime
from django.template.defaultfilters import slugify


class Restorant(models.Model):
    title = models.CharField(max_length=128, blank=False)
    opening_time = models.TimeField(blank=False)
    closing_time = models.TimeField(blank=False)

    def __unicode__(self):
        return self.title


class Guest(models.Model):
    first_name = models.CharField(max_length=128)
    last_name = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.first_name + " " + self.last_name


class Reservation(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    id_guest = models.ForeignKey(Guest)
    tables = models.CharField(max_length=128)
    number_of_guests = models.IntegerField(null=False, blank=False)
    created = models.DateTimeField(auto_now_add=True)
    id_original = models.ForeignKey('self', default=None, null=True, blank=True)
    id_user = models.ForeignKey(User)
    comment = models.CharField(max_length=256)
    valid = models.IntegerField(default=1)
    canceled = models.IntegerField(default=0)

    def __unicode__(self):
        return self.tables


class Level(models.Model):
    label = models.CharField(max_length=128, unique=True)
    scheme = models.CharField(max_length=128, unique=True)
    # slug = models.SlugField(unique=True)
    #
    # def save(self):
    #     self.slug = slugify(self.label)
    #     super(Level, self).save()

    def __unicode__(self):
        return self.label


class Table(models.Model):
    label = models.CharField(max_length=128, unique=True)
    level = models.ForeignKey(Level)
    seats = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    # slug = models.SlugField()
    #
    # def save(self, *args, **kwargs):
    #     self.slug = slugify(self.label)
    #     super(Table, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.label
