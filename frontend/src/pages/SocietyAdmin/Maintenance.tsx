import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 
import { useParams, useNavigate } from 'react-router-dom';

const Maintenance = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Maintenance',
    amount: '',
    dueDate: 31,
    unitType: '2 BHK',
    appliedTo: 'All Units',
    description: ''
  });

  useEffect(() => {
    if (id) {
      setFormData({
        title: 'Monthly Maintenance - Feb 2026',
        category: 'Maintenance',
        amount: '3500',
        dueDate: 28,
        unitType: '2 BHK',
        appliedTo: 'All Units',
        description: 'Regular monthly maintenance charges for Feb.'
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <DashboardLayout role="society-admin">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {id ? 'Edit Maintenance Charge' : 'Create Maintenance Charge'}
            </h1>
            <p className="text-sm text-slate-500">Manage your society maintenance billing</p>
          </div>
        </div>

        <main className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 lg:p-10">
          <div className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">Charge Title</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. January 2026 Maintenance"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Category & Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl appearance-none outline-none focus:border-blue-500 transition-all font-medium"
                >
                  <option>Maintenance</option>
                  <option>Electricity</option>
                  <option>Water</option>
                </select>
                <ChevronDown className="absolute right-4 top-[46px] w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div>
                <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div>
              <label className="block text-[13px] font-bold mb-2 text-slate-500 uppercase tracking-wider">Due Date</label>
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30">
                <div className="grid grid-cols-7 text-center gap-y-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                     <div key={d} className="text-[10px] font-black text-slate-400 pb-2">{d}</div>
                  ))}
                  {days.map(d => (
                    <button 
                      key={d}
                      onClick={() => setFormData({...formData, dueDate: d})}
                      className={`py-2 text-sm rounded-xl transition-all font-bold ${
                        formData.dueDate === d 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'hover:bg-blue-50 text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98] transition-all">
                {id ? 'Update Charge' : 'Post Charge'}
              </button>
              <button 
                onClick={() => navigate(-1)}
                className="flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Maintenance;