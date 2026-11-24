from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    facilities_list = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id',
            'name',
            'category',
            'category_display',
            'description',
            'location',
            'capacity',
            'facilities',
            'facilities_list',
            'image',
            'image_url',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_facilities_list(self, obj):
        if not obj.facilities:
            return []
        return [f.strip() for f in obj.facilities.split(',') if f.strip()]
