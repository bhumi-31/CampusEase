from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    UserRegistrationView,
    CurrentUserProfileView,
    UserListView,
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('profile/', CurrentUserProfileView.as_view(), name='auth_profile'),
    path('users/', UserListView.as_view(), name='admin_user_list'),
]
