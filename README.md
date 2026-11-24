# CampusEase – Campus Resource, Laboratory and Facility Booking Platform

CampusEase is a centralized digital resource reservation platform designed for universities and colleges. It replaces manual registers, phone calls, and informal chat groups with an automated, transparent, conflict-free booking system.

---

## 🌟 Key Features & Academic Highlights

1. **Database-Level Conflict Prevention Engine**:
   - Uses PostgreSQL's `btree_gist` extension and Django's `ExclusionConstraint` with `DateTimeRangeField`.
   - Prevents race conditions and double-booking at the ACID database layer across all active reservations (`pending` and `approved`), while automatically releasing slots for `cancelled` or `rejected` requests.
   - Half-open interval matching `[start_time, end_time)` permits back-to-back bookings (e.g. 10:00–12:00 followed by 12:00–14:00) while rejecting overlapping requests with HTTP 409 Conflict.
2. **Role-Based Access Control (RBAC)**:
   - **Student**: Discover facilities, check live slot availability, submit booking requests with purpose, monitor approval status, cancel personal reservations.
   - **Administrator**: Full CRUD for facilities, activate/deactivate facilities, review and approve/reject bookings with remarks, monitor Recharts visual metrics, view registered students.
3. **Interactive Visual Dashboards**:
   - Recharts-powered distribution charts for facility categories and reservation statuses.
   - One-click demo credentials autofill for effortless live presentations and evaluations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React, Recharts |
| **Backend** | Python 3, Django 6, Django REST Framework, SimpleJWT (JWT Auth), Django CORS Headers |
| **Database** | PostgreSQL with `btree_gist` extension |

---

## 🚀 Quick Start Guide

### 1. Database Setup
Ensure PostgreSQL is running locally and database exists:
```bash
createdb campusease_db
psql -d campusease_db -c "CREATE EXTENSION IF NOT EXISTS btree_gist;"
```

### 2. One-Command Launch
Run the automated startup script from the root folder:
```bash
./start.sh
```
This automatically starts:
- **Backend API**: `http://localhost:8000/api/`
- **Frontend App**: `http://localhost:5173/`

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Approvals queue, facility CRUD, Recharts analytics |
| **Student** | `student` | `student123` | Resource catalog, live slot checker, booking requests |
| **Student 2** | `priya_patel` | `student123` | Department bookings |
| **Student 3** | `arjun_verma` | `student123` | Seminar hall reservations |

*(You can also click the "🚀 Quick Demo Credentials" buttons on the Login page to autofill instantly!)*

---

## 🧪 Testing Concurrency & Conflict Engine

Run the dedicated test suite validating the database-level exclusion constraints:
```bash
cd backend
venv/bin/python manage.py test bookings
```
Scenarios verified:
- Student A books 10:00–12:00 $\rightarrow$ HTTP 201 Created.
- Student B books 11:00–13:00 $\rightarrow$ HTTP 409 Conflict (PostgreSQL `ExclusionConstraint` rejection).
- Student C books 12:00–14:00 (back-to-back) $\rightarrow$ HTTP 201 Created.
- Student A cancels booking $\rightarrow$ Slot is freed.
- Student B books 10:00–12:00 $\rightarrow$ HTTP 201 Created.

---

## 🎓 Viva / Presentation Guide for Class

When presenting CampusEase to your professor or evaluator:
1. **The Problem Statement**: Explain how campuses currently face confusion, double-booking, and lack of accountability with manual registers.
2. **Architecture**: Highlight the clear decoupling of a Vite React frontend communicating via SimpleJWT tokens with a Django REST API.
3. **The Standout Feature**: Emphasize **PostgreSQL Exclusion Constraints with GiST indexing**. Point out that unlike ordinary beginner projects that only do `if Booking.objects.filter(...)` in Python (which suffers from race conditions under concurrent requests), CampusEase enforces atomicity directly inside PostgreSQL.
4. **Live Demo Flow**:
   - Log in as **Student** $\rightarrow$ Search resources $\rightarrow$ Open **Turing AI Lab** $\rightarrow$ Show occupied slots $\rightarrow$ Try booking an overlapping time slot to show the conflict error banner $\rightarrow$ Book an available slot.
   - Switch to **Admin** $\rightarrow$ Show Recharts distribution graphs $\rightarrow$ Go to **Booking Requests** $\rightarrow$ One-click Approve the student's request with a note.
   - Return to **Student** $\rightarrow$ Show updated status badge changing to **Approved** with administrator remarks.
