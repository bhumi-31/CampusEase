from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from django.utils.dateparse import parse_date

from .models import Resource
from .serializers import ResourceSerializer
from accounts.permissions import IsAdminUserRole
from bookings.models import Booking

class ResourceListCreateView(generics.ListCreateAPIView):
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        queryset = Resource.objects.all()

        # Regular students should only see active resources by default
        is_admin = user.is_authenticated and (user.role == 'admin' or user.is_staff or user.is_superuser)
        if not is_admin:
            queryset = queryset.filter(is_active=True)
        else:
            is_active_param = self.request.query_params.get('is_active')
            if is_active_param is not None:
                queryset = queryset.filter(is_active=is_active_param.lower() in ['true', '1'])

        # Search filter
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(location__icontains=search) |
                Q(description__icontains=search)
            )

        # Category filter
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)

        # Min capacity filter
        min_capacity = self.request.query_params.get('min_capacity')
        if min_capacity and min_capacity.isdigit():
            queryset = queryset.filter(capacity__gte=int(min_capacity))

        return queryset.order_by('name')


class ResourceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUserRole()]
        return [permissions.IsAuthenticated()]


class ResourceAvailabilityView(APIView):
    """
    Returns booked time slots for a resource on a specific date.
    Helps students check when the resource is occupied vs available.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
        except Resource.DoesNotExist:
            return Response({'error': 'Resource not found'}, status=status.HTTP_404_NOT_FOUND)

        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'date query parameter is required (YYYY-MM-DD)'}, status=status.HTTP_400_BAD_REQUEST)

        parsed_date = parse_date(date_str)
        if not parsed_date:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch active bookings (pending and approved)
        bookings = Booking.objects.filter(
            resource=resource,
            booking_date=parsed_date,
            status__in=['pending', 'approved']
        ).order_by('start_time')

        booked_slots = [
            {
                'id': b.id,
                'start_time': b.start_time.strftime('%H:%M'),
                'end_time': b.end_time.strftime('%H:%M'),
                'status': b.status,
                'purpose': b.purpose if request.user.role == 'admin' else 'Booked'
            }
            for b in bookings
        ]

        return Response({
            'resource_id': resource.id,
            'resource_name': resource.name,
            'date': date_str,
            'is_active': resource.is_active,
            'booked_slots': booked_slots,
            'total_bookings': len(booked_slots)
        })
