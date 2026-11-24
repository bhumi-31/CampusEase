from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import IntegrityError, transaction
from django.utils import timezone
from django.db.models import Count, Q

from .models import Booking, Approval
from .serializers import (
    BookingSerializer,
    ApprovalSerializer,
    BookingApprovalActionSerializer
)
from resources.models import Resource
from accounts.models import User
from accounts.permissions import IsAdminUserRole

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.select_related('resource', 'user', 'approval', 'approval__approved_by')

        is_admin = user.role == 'admin' or user.is_staff or user.is_superuser
        if not is_admin:
            # Regular students only see their own bookings
            queryset = queryset.filter(user=user)
        else:
            # Admins can filter by student, resource, status, or date
            student_id = self.request.query_params.get('student_id')
            if student_id:
                queryset = queryset.filter(user_id=student_id)

        # Filters
        status_filter = self.request.query_params.get('status')
        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)

        resource_id = self.request.query_params.get('resource_id')
        if resource_id:
            queryset = queryset.filter(resource_id=resource_id)

        date_filter = self.request.query_params.get('date')
        if date_filter:
            queryset = queryset.filter(booking_date=date_filter)

        return queryset.order_by('-booking_date', '-start_time')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                booking = serializer.save(user=request.user, status='pending')
            headers = self.get_success_headers(serializer.data)
            return Response(
                BookingSerializer(booking).data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except IntegrityError as exc:
            # PostgreSQL ExclusionConstraint conflict error handling
            error_msg = str(exc)
            if 'exclude_overlapping_active_bookings' in error_msg or 'exclusion' in error_msg.lower():
                return Response(
                    {
                        'error': 'Conflict detected: The selected resource is already booked for this time slot.',
                        'detail': 'Another pending or approved reservation overlaps with your selected date and time range. Please choose a different slot.'
                    },
                    status=status.HTTP_409_CONFLICT
                )
            return Response(
                {'error': 'Database integrity error occurred while booking.', 'detail': error_msg},
                status=status.HTTP_400_BAD_REQUEST
            )


class BookingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.is_staff or user.is_superuser:
            return Booking.objects.select_related('resource', 'user', 'approval')
        return Booking.objects.filter(user=user).select_related('resource', 'user', 'approval')

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        user = request.user
        is_admin = user.role == 'admin' or user.is_staff or user.is_superuser

        # If it is a student, they can only cancel their own pending/approved bookings
        if not is_admin and booking.user != user:
            return Response({'error': 'You do not have permission to modify this booking.'}, status=status.HTTP_403_FORBIDDEN)

        if booking.status == 'cancelled':
            return Response({'message': 'Booking is already cancelled.'}, status=status.HTTP_200_OK)

        # Update status to cancelled so time range is freed up for others
        booking.status = 'cancelled'
        booking.save()
        return Response(
            {'message': 'Booking successfully cancelled.', 'booking': BookingSerializer(booking).data},
            status=status.HTTP_200_OK
        )


class BookingApprovalActionView(APIView):
    """
    Administrator endpoint to approve or reject a pending booking.
    """
    permission_classes = [IsAdminUserRole]

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookingApprovalActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        decision = serializer.validated_data['decision']
        remarks = serializer.validated_data.get('remarks', '')

        try:
            with transaction.atomic():
                booking.status = decision
                booking.save()

                Approval.objects.update_or_create(
                    booking=booking,
                    defaults={
                        'approved_by': request.user,
                        'decision': decision,
                        'remarks': remarks
                    }
                )

            return Response({
                'message': f'Booking has been {decision}.',
                'booking': BookingSerializer(booking).data
            }, status=status.HTTP_200_OK)

        except IntegrityError as exc:
            return Response({
                'error': 'Cannot approve booking due to a schedule conflict.',
                'detail': str(exc)
            }, status=status.HTTP_409_CONFLICT)


class StudentDashboardStatsView(APIView):
    """
    Dashboard metrics and statistics for the authenticated student.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_bookings = Booking.objects.filter(user=user)

        total_bookings = user_bookings.count()
        pending_count = user_bookings.filter(status='pending').count()
        approved_count = user_bookings.filter(status='approved').count()
        rejected_count = user_bookings.filter(status='rejected').count()
        cancelled_count = user_bookings.filter(status='cancelled').count()

        today = timezone.now().date()
        upcoming = user_bookings.filter(
            booking_date__gte=today,
            status__in=['pending', 'approved']
        ).select_related('resource').order_by('booking_date', 'start_time')[:5]

        recent = user_bookings.select_related('resource').order_by('-created_at')[:5]

        return Response({
            'metrics': {
                'total_bookings': total_bookings,
                'pending': pending_count,
                'approved': approved_count,
                'rejected': rejected_count,
                'cancelled': cancelled_count,
            },
            'upcoming_reservations': BookingSerializer(upcoming, many=True).data,
            'recent_activity': BookingSerializer(recent, many=True).data
        })


class AdminDashboardStatsView(APIView):
    """
    Comprehensive dashboard metrics and charts statistics for administrators.
    """
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_resources = Resource.objects.count()
        active_resources = Resource.objects.filter(is_active=True).count()
        total_students = User.objects.filter(role='student').count()

        all_bookings = Booking.objects.all()
        total_bookings = all_bookings.count()
        pending_bookings = all_bookings.filter(status='pending').count()
        approved_bookings = all_bookings.filter(status='approved').count()
        rejected_bookings = all_bookings.filter(status='rejected').count()
        cancelled_bookings = all_bookings.filter(status='cancelled').count()

        # Category distribution for Recharts
        category_counts = Resource.objects.values('category').annotate(count=Count('id')).order_by('-count')
        category_map = dict(Resource.CATEGORY_CHOICES)
        category_distribution = [
            {
                'category_key': item['category'],
                'category_name': category_map.get(item['category'], item['category']),
                'count': item['count']
            }
            for item in category_counts
        ]

        # Booking status distribution for Recharts
        status_distribution = [
            {'name': 'Pending', 'value': pending_bookings, 'color': '#f59e0b'},
            {'name': 'Approved', 'value': approved_bookings, 'color': '#10b981'},
            {'name': 'Rejected', 'value': rejected_bookings, 'color': '#ef4444'},
            {'name': 'Cancelled', 'value': cancelled_bookings, 'color': '#6b7280'},
        ]

        # Recent 5 bookings
        recent = Booking.objects.select_related('resource', 'user').order_by('-created_at')[:5]

        return Response({
            'metrics': {
                'total_resources': total_resources,
                'active_resources': active_resources,
                'total_students': total_students,
                'total_bookings': total_bookings,
                'pending_requests': pending_bookings,
                'approved_bookings': approved_bookings,
                'rejected_bookings': rejected_bookings,
                'cancelled_bookings': cancelled_bookings,
            },
            'category_distribution': category_distribution,
            'status_distribution': status_distribution,
            'recent_activity': BookingSerializer(recent, many=True).data
        })
