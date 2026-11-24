from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.contrib.postgres.constraints import ExclusionConstraint
from django.contrib.postgres.fields import DateTimeRangeField, RangeOperators
from psycopg2.extras import DateTimeTZRange
import datetime

from resources.models import Resource

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    time_range = DateTimeRangeField(
        help_text="Automatically computed range for DB-level conflict exclusion"
    )
    purpose = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-booking_date', '-start_time']
        constraints = [
            ExclusionConstraint(
                name='exclude_overlapping_active_bookings',
                expressions=[
                    ('resource', RangeOperators.EQUAL),
                    ('time_range', RangeOperators.OVERLAPS),
                ],
                condition=models.Q(status__in=['pending', 'approved']),
            )
        ]

    def compute_time_range(self):
        tz = timezone.get_current_timezone()
        start_dt = timezone.make_aware(
            datetime.datetime.combine(self.booking_date, self.start_time),
            tz
        )
        end_dt = timezone.make_aware(
            datetime.datetime.combine(self.booking_date, self.end_time),
            tz
        )
        return DateTimeTZRange(start_dt, end_dt, bounds='[)')

    def clean(self):
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError({'end_time': 'End time must be after start time.'})
        if self.booking_date and self.booking_date < timezone.now().date():
            raise ValidationError({'booking_date': 'Booking date cannot be in the past.'})

    def save(self, *args, **kwargs):
        self.time_range = self.compute_time_range()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.resource.name} booked by {self.user.username} on {self.booking_date} ({self.start_time} - {self.end_time}) [{self.status}]"


class Approval(models.Model):
    DECISION_CHOICES = (
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='approval'
    )
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_approvals'
    )
    decision = models.CharField(max_length=20, choices=DECISION_CHOICES)
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Decision: {self.decision} for Booking #{self.booking.id} by {self.approved_by}"
