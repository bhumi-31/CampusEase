from django.db import models

class Resource(models.Model):
    CATEGORY_CHOICES = (
        ('computer_lab', 'Computer Laboratory'),
        ('classroom', 'Classroom'),
        ('seminar_hall', 'Seminar Hall'),
        ('sports_facility', 'Sports Facility'),
        ('meeting_room', 'Meeting Room'),
    )

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    location = models.CharField(max_length=255)
    capacity = models.PositiveIntegerField(default=30)
    facilities = models.TextField(help_text="Comma-separated or list of facilities, e.g. Wi-Fi, Projector, AC", blank=True, default="")
    image = models.ImageField(upload_to='resources/', blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True, default='', help_text="Direct URL fallback or preset photograph")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
