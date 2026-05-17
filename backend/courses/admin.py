from django.contrib import admin
from .models import Course, Registration


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'capacity', 'accepted_count', 'created_at')
    search_fields = ('title', 'instructor')


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'registered_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'course__title')
