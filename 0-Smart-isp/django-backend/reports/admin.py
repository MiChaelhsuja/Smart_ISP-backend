from django.contrib import admin
from .models import MonthlyCollection, AccountStatusReport, CollectorPerformance
# Register your models here.
admin.site.register(MonthlyCollection)
admin.site.register(AccountStatusReport)
admin.site.register(CollectorPerformance)
