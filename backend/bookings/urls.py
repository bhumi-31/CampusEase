from django.urls import path
from .views import (
    BookingListCreateView,
    BookingDetailView,
    BookingApprovalActionView,
    StudentDashboardStatsView,
    AdminDashboardStatsView,
)

urlpatterns = [
    path('', BookingListCreateView.as_view(), name='booking-list-create'),
    path('<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('<int:pk>/decision/', BookingApprovalActionView.as_view(), name='booking-approval-action'),
    path('student/dashboard/', StudentDashboardStatsView.as_view(), name='student-dashboard-stats'),
    path('admin/dashboard/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
]
