import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  CheckCircle2, 
  MapPin, 
  Users, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { value: 'computer_lab', label: 'Computer Laboratory' },
  { value: 'classroom', label: 'Classroom' },
  { value: 'seminar_hall', label: 'Seminar Hall' },
  { value: 'sports_facility', label: 'Sports Facility' },
  { value: 'meeting_room', label: 'Meeting Room' },
];

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'computer_lab',
    description: '',
    location: '',
    capacity: 30,
    facilities: '',
    image_url: '',
    is_active: true,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources/');
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      category: 'computer_lab',
      description: '',
      location: '',
      capacity: 30,
      facilities: 'Wi-Fi, Projector, AC',
      image_url: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res) => {
    setEditingResource(res);
    setFormData({
      name: res.name,
      category: res.category,
      description: res.description,
      location: res.location,
      capacity: res.capacity,
      facilities: res.facilities || '',
      image_url: res.image_url || '',
      is_active: res.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (res) => {
    try {
      await api.patch(`/resources/${res.id}/`, {
        is_active: !res.is_active,
      });
      setActionMsg(`Resource "${res.name}" status updated.`);
      fetchResources();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteResource = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/resources/${id}/`);
      setActionMsg(`Resource "${name}" was deleted.`);
      fetchResources();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete resource.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingResource) {
        await api.put(`/resources/${editingResource.id}/`, formData);
        setActionMsg(`Updated "${formData.name}" successfully.`);
      } else {
        await api.post('/resources/', formData);
        setActionMsg(`Added new resource "${formData.name}".`);
      }
      setIsModalOpen(false);
      fetchResources();
      setTimeout(() => setActionMsg(''), 5000);
    } catch (err) {
      alert('Error saving resource details. Please verify your inputs.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Campus Facilities Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, toggle availability, or configure laboratory and room capacities.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Resource
        </button>
      </div>

      {actionMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Resource Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-20 border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No resources registered</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Add New Resource" to catalogue the first room or lab.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Resource</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Facilities</th>
                  <th className="py-3.5 px-4">Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {res.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {res.category_display}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {res.location}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {res.capacity} seats
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {res.facilities || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(res)}
                        title={res.is_active ? 'Click to deactivate' : 'Click to activate'}
                        className="flex items-center gap-1.5 focus:outline-none"
                      >
                        {res.is_active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <ToggleRight className="w-5 h-5 text-emerald-600" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                            <ToggleLeft className="w-5 h-5 text-slate-400" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(res)}
                          title="Edit Resource"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(res.id, res.name)}
                          title="Delete Resource"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingResource ? 'Edit Resource Details' : 'Create New Campus Resource'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Resource Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Advanced AI & Robotics Lab"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Building & Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Technology Tower 3, Room 402"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Facilities (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="e.g. Wi-Fi, Projector, Smart Board, AC, Dual Monitors"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Image URL (Photograph)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specifications, safety rules, intended purpose..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    editingResource ? 'Save Changes' : 'Create Facility'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminResources;
