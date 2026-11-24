import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Building2, 
  School, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  Layers,
  Compass,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedResources();
  }, []);

  const fetchFeaturedResources = async () => {
    try {
      // Unauthenticated or authenticated fetch of public resources
      const res = await api.get('/resources/');
      setFeaturedResources(res.data.slice(0, 4));
    } catch (err) {
      // Fallback mock preview if backend requires auth
      setFeaturedResources([
        {
          id: 1,
          name: 'Turing AI & Data Science Laboratory',
          category_display: 'Computer Laboratory',
          location: 'Block B, 3rd Floor, Room 301',
          capacity: 60,
          facilities: '60 High-End Workstations, Nvidia GPUs, Dual 4K Monitors, Gigabit LAN, AC',
          image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
          description: 'Advanced computing laboratory tailored for machine learning, big data analysis, and project workshops.'
        },
        {
          id: 2,
          name: 'Dr. APJ Abdul Kalam Central Auditorium',
          category_display: 'Seminar Hall',
          location: 'Central Plaza, Main Complex',
          capacity: 250,
          facilities: 'Stage Lighting, Acoustic Soundproofing, Dual LED Video Walls, Live Stream, AC',
          image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
          description: 'Grand auditorium for college convocations, inter-university hackathons, and symposiums.'
        },
        {
          id: 3,
          name: 'Smart Lecture Theater A-101',
          category_display: 'Classroom',
          location: 'Academic Block A, Ground Floor',
          capacity: 90,
          facilities: 'Tiered Seating, Dual HD Projectors, Wireless Mic System, Central AC',
          image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
          description: 'Modern tiered lecture hall equipped for large batch lectures and guest seminars.'
        },
        {
          id: 4,
          name: 'Indoor Badminton & Sports Arena',
          category_display: 'Sports Facility',
          location: 'Sports Complex, South Wing',
          capacity: 50,
          facilities: '3 Teakwood Badminton Courts, 4 TT Tables, LED Floodlights',
          image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
          description: 'Standard indoor sports arena for inter-college tournaments and recreational matches.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlotClick = (resourceId) => {
    if (!isAuthenticated) {
      // Redirect unauthenticated user to login with return path
      navigate('/login', { state: { message: 'Please sign in or create an account to book campus facilities.' } });
    } else {
      navigate('/resources');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* =========================================================================
          HERO SECTION: Thapar Campus Connect Style Full-Bleed Architectural Banner
          With Slide-Up Text Animation
         ========================================================================= */}
      <section className="relative h-[86vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Architectural Campus Photo (Thapar Learning Lab / Modern Red-Brick College Building) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=85')`,
          }}
        />

        {/* Sophisticated Dark Gradient Vignette for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-900/60" />
        <div className="absolute inset-0 bg-black/25" />

        {/* =====================================================================
            SLIDE-UP ANIMATED HERO CONTENT
           ===================================================================== */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
          
          {/* Animated College Tag */}
          <div className="animate-[slideUp_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 [animation-delay:150ms]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-lg shadow-black/20">
              <School className="w-4 h-4 text-amber-300" />
              <span>Campus Infrastructure & Resource Management</span>
            </div>
          </div>

          {/* Animated Main Heading (Serif / Display Font like Thapar Campus Connect) */}
          <h1 className="animate-[slideUp_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 [animation-delay:300ms] text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-white leading-tight drop-shadow-md">
            Campus<span className="font-sans font-black text-amber-300">Ease</span> Connect
          </h1>

          {/* Animated Subtitle */}
          <p className="animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 [animation-delay:450ms] text-lg sm:text-2xl text-slate-200 font-light tracking-wide mt-3 sm:mt-4 drop-shadow">
            Seamlessly Connected.
          </p>

          <p className="animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 [animation-delay:550ms] text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed drop-shadow">
            The unified digital gateway for students and faculty to discover, reserve, and manage laboratories, smart classrooms, seminar halls, and recreation complexes.
          </p>

          {/* Animated Action Buttons */}
          <div className="animate-[slideUp_1.1s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 [animation-delay:700ms] mt-8 flex flex-col sm:flex-row items-center gap-4">
            
            <button
              onClick={() => handleBookSlotClick()}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2.5 group"
            >
              <span>Book a Campus Facility</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#explore-facilities"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl border border-white/25 backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Explore Catalog</span>
            </a>

          </div>

          {/* Scroll Down Indicator */}
          <a 
            href="#explore-facilities"
            className="animate-bounce mt-12 text-slate-300 hover:text-white transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </a>

        </div>

        {/* Bottom stats ticker */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 to-transparent py-4 px-6 border-t border-white/10 hidden md:block">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-6">
              <span>🏛️ 40+ Labs & Auditoriums</span>
              <span>⚡ 100% Conflict-Free Scheduling</span>
              <span>👥 15,000+ Students & Faculty</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online Gateway Active</span>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          CAMPUS FACILITIES SECTION: Featured Labs & Halls
         ========================================================================= */}
      <section id="explore-facilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <School className="w-3.5 h-3.5" /> Campus Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Campus Infrastructure
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl">
              High-performance compute clusters, interactive lecture halls, and event spaces available for reservations.
            </p>
          </div>

          <button
            onClick={() => handleBookSlotClick()}
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredResources.map((res) => (
            <div 
              key={res.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={res.image_url} 
                  alt={res.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
                    {res.category_display}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {res.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{res.location}</span>
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{res.capacity} Seats</span>
                  </div>

                  <button
                    onClick={() => handleBookSlotClick(res.id)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-indigo-200 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    {!isAuthenticated && <Lock className="w-3 h-3" />}
                    <span>Book Slot</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </section>

      {/* =========================================================================
          KEY ADVANTAGES: Why CampusEase
         ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Institutional Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Built for Seamless Campus Life
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Replacing manual registers and WhatsApp messages with an enterprise-grade digital reservation standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">100% Conflict-Free Engine</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Powered by PostgreSQL range exclusion constraints. The database mathematically blocks overlapping reservations, completely eliminating double-bookings.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Live Slot Transparency</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Check already occupied hours before booking. View real-time availability for any date without walking to the lab or calling department heads.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-3xl border border-slate-700/60">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold">Automated Approval Pipeline</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Submit academic purposes, receive fast administrative review with notes, and track your reservation status on your student dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          CAMPUS FOOTER
         ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 py-8 px-4 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <School className="w-4 h-4 text-amber-300" />
            <span>CampusEase • University Facility Reservation System</span>
          </div>
          <div>
            <span>© 2026 National Institute of Technology. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
