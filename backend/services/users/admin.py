from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "bangla_display_name"]
    search_fields = ["user__username", "bangla_display_name"]
