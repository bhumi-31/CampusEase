from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
import datetime

from accounts.models import User
from resources.models import Resource
from bookings.models import Booking

class ConflictPreventionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create Admin
        self.admin = User.objects.create_user(
            username='admin_test',
            email='admin@campusease.edu',
            password='password123',
            role='admin',
            is_staff=True
        )

        # Create Students
        self.student_a = User.objects.create_user(
            username='student_a',
            email='student_a@campusease.edu',
            password='password123',
            role='student'
        )
        self.student_b = User.objects.create_user(
            username='student_b',
            email='student_b@campusease.edu',
            password='password123',
            role='student'
        )
        self.student_c = User.objects.create_user(
            username='student_c',
            email='student_c@campusease.edu',
            password='password123',
            role='student'
        )

        # Create Resource
        self.resource = Resource.objects.create(
            name='Computer Lab 1',
            category='computer_lab',
            description='High performance computer lab with 60 workstations',
            location='Engineering Block B, 2nd Floor',
            capacity=60,
            facilities='Wi-Fi, AC, Dual Monitors, Smart Board'
        )

        # Future booking date
        self.booking_date = timezone.now().date() + datetime.timedelta(days=2)

    def test_conflict_prevention_scenarios(self):
        # 1. Student A books 10:00 to 12:00
        self.client.force_authenticate(user=self.student_a)
        res_a = self.client.post('/api/bookings/', {
            'resource': self.resource.id,
            'booking_date': str(self.booking_date),
            'start_time': '10:00:00',
            'end_time': '12:00:00',
            'purpose': 'AI Research Workshop'
        })
        self.assertEqual(res_a.status_code, status.HTTP_201_CREATED, res_a.data)
        booking_a_id = res_a.data['id']

        # 2. Student B tries to book 11:00 to 13:00 (Overlapping!) -> MUST BE REJECTED with 409 CONFLICT
        self.client.force_authenticate(user=self.student_b)
        res_b = self.client.post('/api/bookings/', {
            'resource': self.resource.id,
            'booking_date': str(self.booking_date),
            'start_time': '11:00:00',
            'end_time': '13:00:00',
            'purpose': 'Web Development Hackathon'
        })
        self.assertEqual(res_b.status_code, status.HTTP_409_CONFLICT, "Overlapping booking was not rejected!")
        self.assertIn('Conflict detected', res_b.data['error'])

        # 3. Student C books 12:00 to 14:00 (Adjacent boundary - permitted!)
        self.client.force_authenticate(user=self.student_c)
        res_c = self.client.post('/api/bookings/', {
            'resource': self.resource.id,
            'booking_date': str(self.booking_date),
            'start_time': '12:00:00',
            'end_time': '14:00:00',
            'purpose': 'Competitive Coding Practice'
        })
        self.assertEqual(res_c.status_code, status.HTTP_201_CREATED, res_c.data)

        # 4. Student A cancels their booking
        self.client.force_authenticate(user=self.student_a)
        cancel_res = self.client.delete(f'/api/bookings/{booking_a_id}/')
        self.assertEqual(cancel_res.status_code, status.HTTP_200_OK)

        # 5. Now Student B retries 10:00 to 12:00 -> MUST SUCCEED because cancelled bookings are excluded!
        self.client.force_authenticate(user=self.student_b)
        retry_res_b = self.client.post('/api/bookings/', {
            'resource': self.resource.id,
            'booking_date': str(self.booking_date),
            'start_time': '10:00:00',
            'end_time': '12:00:00',
            'purpose': 'Web Development Hackathon (Retried)'
        })
        self.assertEqual(retry_res_b.status_code, status.HTTP_201_CREATED, retry_res_b.data)
