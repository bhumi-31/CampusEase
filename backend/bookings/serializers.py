from rest_framework import serializers
from django.utils import timezone
from .models import Booking, Approval
from resources.models import Resource
from resources.serializers import ResourceSerializer
from accounts.serializers import UserSerializer

class ApprovalSerializer(serializers.ModelSerializer):
    approved_by_details = UserSerializer(source='approved_by', read_only=True)

    class Meta:
        model = Approval
        fields = ['id', 'booking', 'approved_by', 'approved_by_details', 'decision', 'remarks', 'created_at']
        read_only_fields = ['id', 'approved_by', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    resource_details = ResourceSerializer(source='resource', read_only=True)
    approval_details = ApprovalSerializer(source='approval', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'user_details',
            'resource',
            'resource_details',
            'booking_date',
            'start_time',
            'end_time',
            'purpose',
            'status',
            'status_display',
            'approval_details',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at', 'updated_at']

    def validate(self, attrs):
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        booking_date = attrs.get('booking_date')
        resource = attrs.get('resource')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({
                'end_time': 'End time must be strictly after start time.'
            })

        if booking_date and booking_date < timezone.now().date():
            raise serializers.ValidationError({
                'booking_date': 'Booking date cannot be in the past.'
            })

        if resource and not resource.is_active:
            raise serializers.ValidationError({
                'resource': 'This resource is currently deactivated and cannot be booked.'
            })

        return attrs


class BookingApprovalActionSerializer(serializers.Serializer):
    decision = serializers.ChoiceField(choices=['approved', 'rejected'])
    remarks = serializers.CharField(required=False, allow_blank=True, default='')
