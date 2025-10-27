from django.db import models
from django.core.validators import MinValueValidator
from djongo import models as djongo_models


class PaymentRecord(djongo_models.Model):
    class PaymentMode(models.TextChoices):
        CASH = "cash", "Cash"
        GCASH = "gcash", "GCash"
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"
        CHECK = "check", "Check"
        CREDIT_CARD = "credit_card", "Credit Card"

    class PaymentStatus(models.TextChoices):
        PAID = "paid", "Paid"
        PENDING = "pending", "Pending"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    
    client = djongo_models.ForeignKey(
        'clients.Client',
        on_delete=djongo_models.CASCADE,
        related_name='payment_records',
        help_text="Client who made the payment"
    )
    amount = djongo_models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Payment amount in currency"
    )
    mode = djongo_models.CharField(
        max_length=20,
        choices=PaymentMode.choices,
        help_text="Payment method used"
    )
    date = djongo_models.DateField(
        help_text="Date when payment was made"
    )
    collector = djongo_models.ForeignKey(
        'collectors.Collector',
        on_delete=djongo_models.SET_NULL,
        null=True,
        blank=True,
        related_name='collected_payments',
        help_text="Collector who processed the payment"
    )
    status = djongo_models.CharField(
        max_length=10,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PAID,
        help_text="Current status of the payment"
    )

    # Additional fields for logging and tracking
    reference_number = djongo_models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        help_text="Payment reference or transaction ID"
    )
    notes = djongo_models.TextField(
        blank=True,
        help_text="Additional notes about the payment"
    )

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payment_records'
        ordering = ["-date", "-created_at"]
        verbose_name = "Payment Record"
        verbose_name_plural = "Payment Records"
        indexes = [
            djongo_models.Index(fields=["client"]),
            djongo_models.Index(fields=["date"]),
            djongo_models.Index(fields=["status"]),
            djongo_models.Index(fields=["collector"]),
            djongo_models.Index(fields=["mode"]),
        ]

    def __str__(self) -> str:
        return f"{self.client.name} - ${self.amount} ({self.date})"

    @property
    def amount_display(self):
        """Return formatted amount for display"""
        return f"${self.amount:,.2f}"
