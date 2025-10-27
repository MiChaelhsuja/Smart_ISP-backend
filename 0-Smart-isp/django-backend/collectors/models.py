from django.db import models
from djongo import models as djongo_models


class Collector(djongo_models.Model):
   
    name = djongo_models.CharField(max_length=255)
    assigned_town = djongo_models.CharField(max_length=120)

    # List view metrics
    active_clients = djongo_models.PositiveIntegerField(default=0)
    last_collection_date = djongo_models.DateField(null=True, blank=True)
    performance_score = djongo_models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="0-100 score used to render the progress bar"
    )

    # Map view (OpenStreetMap) coordinates
    latitude = djongo_models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = djongo_models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'collectors'
        ordering = ["name"]
        verbose_name = "Collector"
        verbose_name_plural = "Collectors"
        indexes = [
            djongo_models.Index(fields=["name"]),
            djongo_models.Index(fields=["assigned_town"]),
        ]

    def __str__(self) -> str:
        return self.name

    @property
    def has_coordinates(self) -> bool:
        return self.latitude is not None and self.longitude is not None
