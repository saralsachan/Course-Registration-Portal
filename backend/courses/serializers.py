from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Registration


class UserSerializer(serializers.ModelSerializer):
    #The inner Meta class is for configuration ABOUT the serializer:
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  #Lightweight user info for embedding in other responses.


class CourseSerializer(serializers.ModelSerializer):
    accepted_count = serializers.IntegerField(read_only=True)
    seats_remaining = serializers.IntegerField(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor',
            'schedule', 'capacity',
            'accepted_count', 'seats_remaining',
            'created_by', 'created_at',
        ]
        read_only_fields = ['created_at']


class RegistrationSerializer(serializers.ModelSerializer):
    # When reading: include the full course and user details
    user = UserSerializer(read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)

    class Meta:
        model = Registration
        fields = ['id', 'user', 'course', 'course_title', 'status', 'registered_at']
        read_only_fields = ['user', 'status', 'registered_at']


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # For security - create_user hashes the password whereas using simple create will use plain text for password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user