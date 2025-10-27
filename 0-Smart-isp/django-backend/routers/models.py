from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from djongo import models as djongo_models


class Router(djongo_models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        OFFLINE = "offline", "Offline"
        MAINTENANCE = "maintenance", "Maintenance"

    class Location(models.TextChoices):
        NORTH = "north", "North"
        SOUTH = "south", "South"
        EAST = "east", "East"
        WEST = "west", "West"
        CENTRAL = "central", "Central"

    
    router_id = djongo_models.CharField(
        max_length=10, 
        unique=True, 
        help_text="Unique router identifier (e.g., R001, R002, R003)"
    )
    client = djongo_models.ForeignKey(
        'clients.Client', 
        on_delete=djongo_models.CASCADE, 
        related_name='routers',
        help_text="Client associated with this router"
    )
    status = djongo_models.CharField(
        max_length=12, 
        choices=Status.choices, 
        default=Status.OFFLINE,
        help_text="Current operational status of the router"
    )
    uptime = djongo_models.DurationField(
        null=True, 
        blank=True,
        help_text="Duration the router has been continuously operational"
    )
    signal_strength = djongo_models.FloatField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(-120), MaxValueValidator(-30)],
        help_text="Signal strength in dBm (typically -120 to -30)"
    )
    location = djongo_models.CharField(
        max_length=10, 
        choices=Location.choices,
        help_text="Physical or logical location of the router"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)
    last_seen = djongo_models.DateTimeField(
        null=True, 
        blank=True,
        help_text="Last time the router was seen online"
    )

    class Meta:
        db_table = 'routers'
        ordering = ["router_id"]
        verbose_name = "Router"
        verbose_name_plural = "Routers"
        indexes = [
            djongo_models.Index(fields=["router_id"]),
            djongo_models.Index(fields=["status"]),
            djongo_models.Index(fields=["location"]),
            djongo_models.Index(fields=["client"]),
        ]

    def __str__(self) -> str:
        return f"{self.router_id} - {self.client.name}"

    @property
    def signal_strength_display(self):
        """Return signal strength formatted for display"""
        if self.signal_strength is None:
            return "N/A"
        return f"{self.signal_strength:.0f} dBm"

    @property
    def uptime_display(self):
        """Return uptime formatted for display"""
        if self.uptime is None:
            return "0h"
        
        total_seconds = int(self.uptime.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        
        if hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m"

    @property
    def status_badge_color(self):
        """Return CSS class for status badge color"""
        status_colors = {
            'active': 'badge-primary',      # Blue
            'offline': 'badge-danger',      # Red
            'maintenance': 'badge-warning'  # Yellow
        }
        return status_colors.get(self.status, 'badge-secondary')
