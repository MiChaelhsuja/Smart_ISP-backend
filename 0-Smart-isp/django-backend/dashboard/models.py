from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from djongo import models as djongo_models


class DashboardMetrics(djongo_models.Model):
    """Model to store dashboard KPI metrics"""
    
    date = djongo_models.DateField(
        default=timezone.now,
        help_text="Date for which metrics are recorded"
    )
    
    # KPI Metrics
    active_users = djongo_models.PositiveIntegerField(
        default=0,
        help_text="Number of active users"
    )
    overdue_accounts = djongo_models.PositiveIntegerField(
        default=0,
        help_text="Number of overdue accounts"
    )
    disconnected_accounts = djongo_models.PositiveIntegerField(
        default=0,
        help_text="Number of disconnected accounts"
    )
    collector_performance = djongo_models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Collector performance percentage (0-100)"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'dashboard_metrics'
        ordering = ['-date']
        verbose_name = "Dashboard Metrics"
        verbose_name_plural = "Dashboard Metrics"
        indexes = [
            djongo_models.Index(fields=["date"]),
        ]

    def __str__(self):
        return f"Dashboard Metrics - {self.date}"

    @property
    def collector_performance_display(self):
        """Return formatted collector performance percentage"""
        return f"{self.collector_performance}%"


class ActiveDevicesTrend(djongo_models.Model):
    """Model to store daily active devices trend data"""
    class DayOfWeek(models.TextChoices):
        MONDAY = "monday", "Monday"
        TUESDAY = "tuesday", "Tuesday"
        WEDNESDAY = "wednesday", "Wednesday"
        THURSDAY = "thursday", "Thursday"
        FRIDAY = "friday", "Friday"
        SATURDAY = "saturday", "Saturday"
        SUNDAY = "sunday", "Sunday"

    _id = djongo_models.ObjectIdField()
    week_start_date = djongo_models.DateField(
        help_text="Start date of the week (Monday)"
    )
    day_of_week = djongo_models.CharField(
        max_length=10,
        choices=DayOfWeek.choices,
        help_text="Day of the week"
    )
    active_devices_count = djongo_models.PositiveIntegerField(
        default=0,
        help_text="Number of active devices for this day"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'active_devices_trend'
        ordering = ['week_start_date', 'day_of_week']
        verbose_name = "Active Devices Trend"
        verbose_name_plural = "Active Devices Trends"
        indexes = [
            djongo_models.Index(fields=["week_start_date"]),
            djongo_models.Index(fields=["day_of_week"]),
        ]

    def __str__(self):
        return f"{self.day_of_week} ({self.week_start_date}): {self.active_devices_count} devices"

    @property
    def day_abbreviation(self):
        """Return abbreviated day name"""
        day_abbrevs = {
            'monday': 'Mon',
            'tuesday': 'Tue',
            'wednesday': 'Wed',
            'thursday': 'Thu',
            'friday': 'Fri',
            'saturday': 'Sat',
            'sunday': 'Sun'
        }
        return day_abbrevs.get(self.day_of_week, self.day_of_week.title())


class WeeklyCollection(djongo_models.Model):
    """Model to store weekly collection data"""
    _id = djongo_models.ObjectIdField()
    week_number = djongo_models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(53)],
        help_text="Week number of the year (1-53)"
    )
    year = djongo_models.PositiveSmallIntegerField(
        help_text="Year of the collection"
    )
    week_start_date = djongo_models.DateField(
        help_text="Start date of the week (Monday)"
    )
    total_collection = djongo_models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Total collection amount for the week"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'weekly_collections'
        ordering = ['year', 'week_number']
        verbose_name = "Weekly Collection"
        verbose_name_plural = "Weekly Collections"
        indexes = [
            djongo_models.Index(fields=["year", "week_number"]),
            djongo_models.Index(fields=["week_start_date"]),
        ]

    def __str__(self):
        return f"Week {self.week_number} ({self.year}): ${self.total_collection}"

    @property
    def week_display(self):
        """Return formatted week display"""
        return f"Week {self.week_number}"

    @property
    def total_collection_display(self):
        """Return formatted collection amount"""
        return f"${self.total_collection:,.2f}"


class DashboardSnapshot(djongo_models.Model):
    """Model to store complete dashboard snapshots for historical tracking"""
    _id = djongo_models.ObjectIdField()
    snapshot_date = djongo_models.DateTimeField(
        default=timezone.now,
        help_text="Date and time when snapshot was taken"
    )
    
    # KPI Data
    active_users = djongo_models.PositiveIntegerField(default=0)
    overdue_accounts = djongo_models.PositiveIntegerField(default=0)
    disconnected_accounts = djongo_models.PositiveIntegerField(default=0)
    collector_performance = djongo_models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Chart Data (JSON fields for flexibility)
    active_devices_trend = djongo_models.JSONField(
        default=dict,
        help_text="Weekly active devices trend data"
    )
    weekly_collections = djongo_models.JSONField(
        default=dict,
        help_text="Weekly collections data"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'dashboard_snapshots'
        ordering = ['-snapshot_date']
        verbose_name = "Dashboard Snapshot"
        verbose_name_plural = "Dashboard Snapshots"
        indexes = [
            djongo_models.Index(fields=["snapshot_date"]),
        ]

    def __str__(self):
        return f"Dashboard Snapshot - {self.snapshot_date.strftime('%Y-%m-%d %H:%M')}"
