from django.contrib import admin
from .models import DashboardMetrics, ActiveDevicesTrend, WeeklyCollection, DashboardSnapshot
# Register your models here.
admin.site.register(DashboardMetrics)
admin.site.register(ActiveDevicesTrend)
admin.site.register(WeeklyCollection)
admin.site.register(DashboardSnapshot)