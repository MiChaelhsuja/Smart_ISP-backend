from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from djongo import models as djongo_models


class MonthlyCollection(djongo_models.Model):
    """Model to store monthly collection summaries"""
    
    month = djongo_models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(12)],
        help_text="Month of the collection (1-12)"
    )
    year = djongo_models.PositiveSmallIntegerField(
        help_text="Year of the collection"
    )
    total_amount = djongo_models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Total amount collected for the month"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'monthly_collections'
        ordering = ['year', 'month']
        verbose_name = "Monthly Collection"
        verbose_name_plural = "Monthly Collections"
        indexes = [
            djongo_models.Index(fields=["year", "month"]),
        ]

    def __str__(self):
        return f"Collection for {self.month}/{self.year}: ${self.total_amount}"

    @property
    def month_name(self):
        """Return abbreviated month name"""
        month_names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return month_names[self.month]


class AccountStatusReport(djongo_models.Model):
    """Model to store account status breakdown reports"""
    _id = djongo_models.ObjectIdField()
    report_date = djongo_models.DateField(
        help_text="Date when the report was generated"
    )
    total_accounts = djongo_models.PositiveIntegerField(
        help_text="Total number of accounts"
    )
    active_accounts = djongo_models.PositiveIntegerField(
        help_text="Number of active accounts"
    )
    overdue_accounts = djongo_models.PositiveIntegerField(
        help_text="Number of overdue accounts"
    )
    disconnected_accounts = djongo_models.PositiveIntegerField(
        help_text="Number of disconnected accounts"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'account_status_reports'
        ordering = ['-report_date']
        verbose_name = "Account Status Report"
        verbose_name_plural = "Account Status Reports"
        indexes = [
            djongo_models.Index(fields=["report_date"]),
        ]

    def __str__(self):
        return f"Account Status Report - {self.report_date}"

    @property
    def active_percentage(self):
        """Calculate active accounts percentage"""
        if self.total_accounts == 0:
            return 0
        return round((self.active_accounts / self.total_accounts) * 100, 1)

    @property
    def overdue_percentage(self):
        """Calculate overdue accounts percentage"""
        if self.total_accounts == 0:
            return 0
        return round((self.overdue_accounts / self.total_accounts) * 100, 1)

    @property
    def disconnected_percentage(self):
        """Calculate disconnected accounts percentage"""
        if self.total_accounts == 0:
            return 0
        return round((self.disconnected_accounts / self.total_accounts) * 100, 1)

    def clean(self):
        """Validate that sum of accounts equals total"""
        from django.core.exceptions import ValidationError
        if self.total_accounts != (self.active_accounts + self.overdue_accounts + self.disconnected_accounts):
            raise ValidationError("Sum of account types must equal total accounts")


class CollectorPerformance(djongo_models.Model):
    """Model to store collector performance metrics"""
    _id = djongo_models.ObjectIdField()
    collector = djongo_models.ForeignKey(
        'collectors.Collector',
        on_delete=djongo_models.CASCADE,
        related_name='performance_records',
        help_text="Collector whose performance is being tracked"
    )
    period_start = djongo_models.DateField(
        help_text="Start date of the performance period"
    )
    period_end = djongo_models.DateField(
        help_text="End date of the performance period"
    )
    collected_amount = djongo_models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
        help_text="Total amount collected during the period"
    )
    clients_served = djongo_models.PositiveIntegerField(
        default=0,
        help_text="Number of clients served during the period"
    )
    average_rating = djongo_models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0.0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Average performance rating (0-5)"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'collector_performance'
        ordering = ['-period_end', '-collected_amount']
        verbose_name = "Collector Performance"
        verbose_name_plural = "Collector Performance Records"
        indexes = [
            djongo_models.Index(fields=["collector"]),
            djongo_models.Index(fields=["period_start", "period_end"]),
            djongo_models.Index(fields=["collected_amount"]),
        ]

    def __str__(self):
        return f"{self.collector.name} - {self.period_start} to {self.period_end}"

    @property
    def collected_amount_display(self):
        """Return formatted collected amount for display"""
        return f"${self.collected_amount:,.2f}"

    @property
    def period_display(self):
        """Return formatted period for display"""
        return f"{self.period_start} to {self.period_end}"
