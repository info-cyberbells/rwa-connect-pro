import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, User, Image as ImageIcon, Moon } from 'lucide-react';
import { DashboardLayout } from "../../components/layout/DashboardLayout"; 
import { useAppSelector } from "../../store/store";

const AddPenaltyFine = ({ initialData = null }) => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem("role") || "guard";

  const [formData, setFormData] = useState({
    title: '',
    category: 'Fine',
    amount: '',
    appliedTo: 'Specific User',
    selectedUser: '',
    description: ''
  });

  const [fileName, setFileName] = useState('No file chosen');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Fine',
        amount: initialData.amount || '',
        appliedTo: initialData.appliedTo || 'Specific User',
        selectedUser: initialData.selectedUser || '',
        description: initialData.description || ''
      });
      setFileName(initialData.fileName || 'evidence-image.jpg');
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePost = () => {
    // Logic for saving/posting the fine goes here
  };

  return (
    <DashboardLayout role={role as any}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header*/}
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 hover:bg-card rounded-full transition-all border border-transparent hover:border-border shadow-sm">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {initialData ? 'Edit Penalty / Fine' : 'Add Penalty / Fine'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {initialData ? 'Update existing penalty record' : 'Create a new penalty record for residents'}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-sm border border-border p-8 lg:p-10">
          <div className="space-y-6">
            
            {/* Fine Title */}
            <div>
              <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Fine Title</label>
              <input 
                name="title"
                type="text" 
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Late Payment Fine"
                className="w-full px-4 py-3 bg-muted/50/50 border border-border rounded-xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            {/* Category & Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-muted/50/50 border border-border rounded-xl appearance-none outline-none focus:border-blue-500 transition-all font-medium"
                >
                  <option value="Fine">Fine</option>
                  <option value="Penalty">Penalty</option>
                  <option value="Late Fee">Late Fee</option>
                </select>
                <ChevronDown className="absolute right-4 top-[46px] w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <div>
                <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                  <input 
                    name="amount"
                    type="number" 
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-muted/50/50 border border-border rounded-xl outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Applied To & User Selection*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Applied To</label>
                <select 
                  name="appliedTo"
                  value={formData.appliedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-muted/50/50 border border-border rounded-xl appearance-none outline-none focus:border-blue-500 transition-all font-medium"
                >
                  <option value="Specific User">Specific User</option>
                  <option value="All Residents">All Residents</option>
                </select>
                <ChevronDown className="absolute right-4 top-[46px] w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative">
                <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Select User</label>
                <div className="relative">
                  <input 
                    name="selectedUser"
                    type="text" 
                    value={formData.selectedUser}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-muted/50/50 border border-border rounded-xl outline-none font-medium"
                    placeholder="Search User..."
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Proof Image Section */}
            <div>
              <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Proof Image</label>
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-dashed border-border bg-muted/50/30 rounded-2xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                    <ImageIcon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{fileName}</p>
                    <p className="text-[11px] text-muted-foreground font-medium tracking-wide">
                      {initialData ? 'File already attached' : 'No file uploaded'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-blue-600 bg-card border border-blue-100 rounded-lg hover:bg-blue-50 transition-all">
                    {initialData ? 'View' : 'Upload'}
                  </button>
                  {initialData && (
                    <button className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-red-600 bg-card border border-red-100 rounded-lg hover:bg-red-50 transition-all">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-bold mb-2 text-muted-foreground uppercase tracking-wider">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-muted/50/50 border border-border rounded-xl outline-none resize-none focus:border-blue-500 transition-all text-sm leading-relaxed font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handlePost}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98] transition-all"
              >
                {initialData ? 'Update Fine' : 'Post Fine'}
              </button>
              <button className="flex-1 bg-card border border-border text-muted-foreground py-4 rounded-2xl font-bold hover:bg-muted/50 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddPenaltyFine;