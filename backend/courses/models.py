from django.db import models
from django.contrib.auth.models import User #Django provides with  built-in user model

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.CharField(max_length=100)
    capacity = models.PositiveBigIntegerField(default = 30)
    schedule = models.CharField(max_length=100, help_text="e.g., Mon/Thu 9 - 12 PM")
    created_at = models.DateTimeField(auto_now_add=True) #autmoatically set when a new row is created
    created_by = models.ForeignKey(
        User, #etablishing realtion between course and user table
        on_delete = models.CASCADE,  #if the User(reference is deleted, the Course should be deleted too)
        related_name = 'courses_created' #reverse realtionship name
    )
    
    def __str__(self):
        return self.title
    
    @property #let's us call course.accepted_count like field, but is actually a function
    def accepted_count(self):
        return self.registrations.filter(status='accepted').count() #num of students enrolled in this course
    
    @property
    def seats_remaining(self):
        return self.capacity - self.accepted_count
    
class Registration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), #(stored in DB, human readible label)
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]    
    
    user = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name='registrations'
    )
    
    course = models.ForeignKey(
        Course,
        on_delete = models.CASCADE,
        related_name='registrations'
    )
    
    status = models.CharField(
        max_length= 10,
        choices = STATUS_CHOICES,
        default='pending'
    )
    
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user','course')
        
    def __str__(self):
        return f"{self.user.username} -> {self.course.title} ({self.status})"    