from rest_framework import permissions
"""Why creating custom permissions if Django provides IsAuthenticated, IsAdminUser ??
    bcz these permissions are like for all/ none . But we want that courses are visible to all users but are editable only for admins """

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Read access for anyone authenticated.
    Write access (POST/PUT/DELETE) only for admins (is_staff=True).
    Used on Course endpoints: everyone can browse, only admins can modify.
    """
    def has_permission(self, request, view):
        # SAFE_METHODS = GET, HEAD, OPTIONS — read-only requests
        if request.method in permissions.SAFE_METHODS:
            return True
        # For write methods, the user must be staff
        return request.user and request.user.is_staff


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level: users can see their own registrations but the admins can see all.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user