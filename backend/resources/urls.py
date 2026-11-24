from django.urls import path
from .views import ResourceListCreateView, ResourceDetailView, ResourceAvailabilityView

urlpatterns = [
    path('', ResourceListCreateView.as_view(), name='resource-list-create'),
    path('<int:pk>/', ResourceDetailView.as_view(), name='resource-detail'),
    path('<int:pk>/availability/', ResourceAvailabilityView.as_view(), name='resource-availability'),
]
