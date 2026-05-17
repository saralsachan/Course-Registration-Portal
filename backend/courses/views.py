from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from django.contrib.auth.models import User

from .models import Course, Registration
from .serializers import (
    CourseSerializer,
    RegistrationSerializer,
    RegisterUserSerializer,
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin


class CourseViewSet(viewsets.ModelViewSet):
    """
    Model.ViewSet provides list/retrieve/create/update/destroy for Courses.
    Read: any authenticated user. Write: admin only.
    """
    queryset = Course.objects.all().order_by('-created_at')
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        # Auto-set created_by to the logged-in admin
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        """
        Custom endpoint: POST /api/courses/{id}/register/
        Lets the current user register for this course.
        """
        course = self.get_object()
        # Prevent duplicate registration
        existing = Registration.objects.filter(user=request.user, course=course).first()
        if existing:
            return Response(
                {'detail': f'Already registered (status: {existing.status})'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        registration = Registration.objects.create(user=request.user, course=course)
        serializer = RegistrationSerializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    List/retrieve registrations.
    Admins: see all. Regular users: see only their own.
    """
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Registration.objects.all().order_by('-registered_at')
        return Registration.objects.filter(user=user).order_by('-registered_at')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def accept(self, request, pk=None):
        """POST /api/registrations/{id}/accept/ — admin marks as accepted."""
        registration = self.get_object()
        # Check capacity before accepting
        if registration.course.seats_remaining <= 0:
            return Response(
                {'detail': 'Course is full.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        registration.status = 'accepted'
        registration.save()
        return Response(RegistrationSerializer(registration).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """POST /api/registrations/{id}/reject/ — admin marks as rejected."""
        registration = self.get_object()
        registration.status = 'rejected'
        registration.save()
        return Response(RegistrationSerializer(registration).data)


class RegisterUserView(CreateAPIView):
    """Public signup endpoint — POST /api/auth/register/"""
    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()
