from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to administrator users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )

class IsStudentUserRole(permissions.BasePermission):
    """
    Allows access to authenticated student users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )
