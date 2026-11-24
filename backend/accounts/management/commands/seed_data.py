from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta, time
from accounts.models import User
from resources.models import Resource
from bookings.models import Booking, Approval

class Command(BaseCommand):
    help = 'Seeds initial users, campus resources, and realistic demo bookings'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding CampusEase database with initial data...")

        # 1. Admin User
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@campusease.edu',
                'first_name': 'Campus',
                'last_name': 'Administrator',
                'department': 'Campus Facility Administration',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created admin user: admin / admin123"))

        # 2. Student Users
        students_data = [
            {
                'username': 'student',
                'email': 'student@campusease.edu',
                'first_name': 'Rahul',
                'last_name': 'Sharma',
                'department': 'Computer Science and Engineering',
            },
            {
                'username': 'priya_patel',
                'email': 'priya@campusease.edu',
                'first_name': 'Priya',
                'last_name': 'Patel',
                'department': 'Information Technology',
            },
            {
                'username': 'arjun_verma',
                'email': 'arjun@campusease.edu',
                'first_name': 'Arjun',
                'last_name': 'Verma',
                'department': 'Electronics and Communication',
            },
        ]

        students = []
        for s in students_data:
            user, u_created = User.objects.get_or_create(
                username=s['username'],
                defaults={
                    'email': s['email'],
                    'first_name': s['first_name'],
                    'last_name': s['last_name'],
                    'department': s['department'],
                    'role': 'student',
                }
            )
            if u_created:
                user.set_password('student123')
                user.save()
            students.append(user)
        self.stdout.write(self.style.SUCCESS(f"Created/verified {len(students)} demo student accounts (password: student123)"))

        # 3. Resources
        resources_data = [
            {
                'name': 'Turing AI & Data Science Laboratory',
                'category': 'computer_lab',
                'location': 'Block B, 3rd Floor, Room 301',
                'capacity': 60,
                'facilities': '60 High-End Workstations, Nvidia GPUs, Dual 4K Monitors, Smart Podium, Gigabit LAN, AC',
                'image_url': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                'description': 'Advanced computing laboratory tailored for machine learning, big data analysis, high-performance computing, and project workshops.',
                'is_active': True,
            },
            {
                'name': 'Cloud Systems & Networking Lab',
                'category': 'computer_lab',
                'location': 'Block B, 2nd Floor, Room 204',
                'capacity': 45,
                'facilities': 'Linux Terminals, Cisco Routers/Switches Rack, Wi-Fi 6, Dual Projectors, AC',
                'image_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
                'description': 'Specialized facility for hands-on distributed systems, cloud infrastructure simulation, and computer networking experiments.',
                'is_active': True,
            },
            {
                'name': 'Smart Lecture Theater A-101',
                'category': 'classroom',
                'location': 'Academic Block A, Ground Floor',
                'capacity': 90,
                'facilities': 'Tiered Seating, Dual HD Projectors, Wireless Mic System, Wi-Fi, Central AC',
                'image_url': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
                'description': 'Modern tiered classroom ideal for department guest lectures, technical orientations, and seminar sessions.',
                'is_active': True,
            },
            {
                'name': 'Interactive Design Studio C-205',
                'category': 'classroom',
                'location': 'Academic Block C, 2nd Floor',
                'capacity': 35,
                'facilities': 'Moveable Collaboration Tables, Interactive Smart Boards, Stylus Sets, AC',
                'image_url': 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
                'description': 'Dynamic modular classroom designed for group brainstorming, UI/UX design sprints, and collaborative project reviews.',
                'is_active': True,
            },
            {
                'name': 'Dr. APJ Abdul Kalam Central Auditorium',
                'category': 'seminar_hall',
                'location': 'Central Plaza, Main Complex',
                'capacity': 250,
                'facilities': 'Stage Lighting, Acoustic Soundproofing, Dual LED Video Walls, Live Stream Cameras, Central AC',
                'image_url': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
                'description': 'Grand auditorium for college convocations, inter-university hackathons, cultural fests, and international symposiums.',
                'is_active': True,
            },
            {
                'name': 'Management Convention Hall',
                'category': 'seminar_hall',
                'location': 'Management Block D, 1st Floor',
                'capacity': 120,
                'facilities': 'Surround Sound, Dual Stage Displays, Dais Microphones, Central AC',
                'image_url': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
                'description': 'Executive convention hall suited for case study discussions, leadership talks, and corporate placement talks.',
                'is_active': True,
            },
            {
                'name': 'Indoor Badminton & Table Tennis Arena',
                'category': 'sports_facility',
                'location': 'Sports Complex, South Wing',
                'capacity': 50,
                'facilities': '3 Teakwood Badminton Courts, 4 TT Tables, LED Floodlights, Changing Rooms',
                'image_url': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
                'description': 'Standard indoor sports arena for inter-college tournaments, sports practice, and recreational matches.',
                'is_active': True,
            },
            {
                'name': 'Executive Boardroom & Conference Suite',
                'category': 'meeting_room',
                'location': 'Administrative Block, 4th Floor',
                'capacity': 22,
                'facilities': '4K Conference TV, Polycom Video Conf System, Ergonomic Leather Chairs, Wi-Fi 6',
                'image_url': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                'description': 'High-profile conference room for department meetings, academic council discussions, and thesis defense.',
                'is_active': True,
            },
        ]

        resources = []
        for r_data in resources_data:
            res, r_created = Resource.objects.get_or_create(
                name=r_data['name'],
                defaults=r_data
            )
            resources.append(res)
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(resources)} campus facilities."))

        # 4. Sample Bookings
        tomorrow = timezone.now().date() + timedelta(days=1)
        day_after = timezone.now().date() + timedelta(days=2)

        # Clear existing sample bookings to ensure clean constraint test
        Booking.objects.filter(resource__in=resources[:4]).delete()

        # Approved Booking for Rahul
        b1 = Booking.objects.create(
            user=students[0],
            resource=resources[0],  # Turing AI Lab
            booking_date=tomorrow,
            start_time=time(10, 0),
            end_time=time(12, 0),
            purpose='Deep Learning workshop for final year capstone teams',
            status='approved'
        )
        Approval.objects.create(
            booking=b1,
            approved_by=admin,
            decision='approved',
            remarks='Approved. Please ensure students follow lab safety and wear identity cards.'
        )

        # Pending Booking for Priya (Adjacent time slot: 12:00 - 14:00 -> Permitted!)
        b2 = Booking.objects.create(
            user=students[1],
            resource=resources[0],
            booking_date=tomorrow,
            start_time=time(12, 0),
            end_time=time(14, 0),
            purpose='Kaggle Competition Team Sprint',
            status='pending'
        )

        # Pending Booking for Arjun on Auditorium
        b3 = Booking.objects.create(
            user=students[2],
            resource=resources[4],  # Auditorium
            booking_date=day_after,
            start_time=time(14, 0),
            end_time=time(17, 0),
            purpose='Annual IEEE Student Chapter Orientation and Tech Quiz',
            status='pending'
        )

        # Rejected Booking for Rahul on Sports Facility
        b4 = Booking.objects.create(
            user=students[0],
            resource=resources[6],  # Sports Facility
            booking_date=day_after,
            start_time=time(9, 0),
            end_time=time(11, 0),
            purpose='Informal class cricket practice',
            status='rejected'
        )
        Approval.objects.create(
            booking=b4,
            approved_by=admin,
            decision='rejected',
            remarks='Rejected: Facility is reserved for University Badminton Trials during morning hours.'
        )

        self.stdout.write(self.style.SUCCESS("Seeded sample bookings with Approved, Pending, and Rejected statuses."))
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
