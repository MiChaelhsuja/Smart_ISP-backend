from django.db import models
from djongo import models as djongo_models


class Client(djongo_models.Model):
    class Plan(models.TextChoices):
        FIBER_30 = "fiber_30", "Fiber 30Mbps"
        FIBER_50 = "fiber_50", "Fiber 50Mbps"
        FIBER_100 = "fiber_100", "Fiber 100Mbps"

    class PaymentStatus(models.TextChoices):
        PAID = "paid", "Paid"
        PENDING = "pending", "Pending"

    class RouterStatus(models.TextChoices):
        ONLINE = "online", "Online"
        OFFLINE = "offline", "Offline"

    
    name = djongo_models.CharField(max_length=255)
    town = djongo_models.CharField(max_length=120)
    plan = djongo_models.CharField(max_length=20, choices=Plan.choices)
    payment_status = djongo_models.CharField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    router_status = djongo_models.CharField(
        max_length=10, choices=RouterStatus.choices, default=RouterStatus.OFFLINE
    )
    last_payment = djongo_models.DateField(null=True, blank=True)

    created_at = djongo_models.DateTimeField(auto_now_add=True)
    updated_at = djongo_models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'clients'
        ordering = ["name"]
        verbose_name = "Client"
        verbose_name_plural = "Clients"
        indexes = [
            djongo_models.Index(fields=["name"]),
            djongo_models.Index(fields=["town"]),
            djongo_models.Index(fields=["plan"]),
        ]

    def __str__(self) -> str:
        return self.name
