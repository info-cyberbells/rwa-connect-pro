import React, { useState, useEffect } from 'react';
import {
  Settings,
  Bell,
  Upload,
  CreditCard,
  Info,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  getPlatformConfigService, 
  updatePlatformConfigService, 
  updateNotificationRulesService,
  getPlansService,
  createPlanService,
  updatePlanService,
  deletePlanService
} from '@/auth/authServices';
import { toast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const [platformName, setPlatformName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState({
    registration: { email: true, push: false },
    payment: { email: true, push: true },
    health: { email: false, push: false },
  });

  // Plans state
  const [plans, setPlans] = useState<any[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, plansRes] = await Promise.all([
        getPlatformConfigService(),
        getPlansService()
      ]);
      
      const config = configRes.settings;
      setPlatformName(config.platformName || '');
      setSupportEmail(config.supportEmail || '');
      setLogoPreview(config.logoUrl ? `http://localhost:4000${config.logoUrl}` : null);
      
      if (config.notificationRules) {
        setNotifications({
          registration: config.notificationRules.newSocietyRegistration || { email: true, push: false },
          payment: config.notificationRules.paymentFailureAlerts || { email: true, push: true },
          health: config.notificationRules.systemHealthUpdates || { email: false, push: false },
        });
      }

      setPlans(plansRes.plans || []);
      setUnsavedChanges(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('platformName', platformName);
      formData.append('supportEmail', supportEmail);
      if (logoFile) formData.append('logo', logoFile);

      await updatePlatformConfigService(formData);
      
      // Also update notification rules
      await updateNotificationRulesService({
        newSocietyRegistration: notifications.registration,
        paymentFailureAlerts: notifications.payment,
        systemHealthUpdates: notifications.health
      });

      toast({ title: "Success", description: "System settings updated successfully" });
      setUnsavedChanges(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key, type) => {
    setNotifications(prev => ({
      ...prev,
      [key]: { ...prev[key], [type]: !prev[key][type] }
    }));
    setUnsavedChanges(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setUnsavedChanges(true);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const planData = {
      name: formData.get('name'),
      pricePerYear: Number(formData.get('price')),
      maxUnits: Number(formData.get('maxUnits')),
      description: formData.get('description'),
      features: (formData.get('features') as string).split(',').map(f => f.trim()),
      isPopular: formData.get('isPopular') === 'on'
    };

    try {
      setSaving(true);
      if (editingPlan) {
        await updatePlanService(editingPlan._id, planData);
        toast({ title: "Success", description: "Plan updated successfully" });
      } else {
        await createPlanService(planData);
        toast({ title: "Success", description: "New plan created and admins notified" });
      }
      setIsPlanModalOpen(false);
      setEditingPlan(null);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save plan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlanService(id);
      toast({ title: "Success", description: "Plan deleted successfully" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete plan", variant: "destructive" });
    }
  };

  const Toggle = ({ active, onClick }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-blue-600' : 'bg-gray-200'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${active ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  if (loading) {
    return (
      <DashboardLayout role="super-admin">
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="super-admin">
    <div className="min-h-screen bg-background text-foreground pb-24">
    

      <header className="max-w-7xl mx-auto px-4 pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure global platform parameters and management rules.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-6 ">
        {/* General Configuration Section */}
        <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">General Configuration</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-80">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => { setPlatformName(e.target.value); setUnsavedChanges(true); }}
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-80">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => { setSupportEmail(e.target.value); setUnsavedChanges(true); }}
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <label className="text-sm font-medium opacity-80">Platform Logo</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="w-24 h-24 bg-muted border-2 border-dashed border-border rounded-2xl flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <span className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 inline-block">
                      Upload New Logo
                    </span>
                    <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                  </label>
                  <p className="text-xs text-muted-foreground">Recommended size: 512x512px. PNG or SVG preferred.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Rules Section */}
        <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold">Notification Rules</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-2xl gap-4">
              <div>
                <h3 className="font-semibold">New Society Registration</h3>
                <p className="text-sm text-muted-foreground">Notify super admins when a new society applies for registration.</p>
              </div>
              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                  <Toggle active={notifications.registration.email} onClick={() => toggleNotification('registration', 'email')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Push</span>
                  <Toggle active={notifications.registration.push} onClick={() => toggleNotification('registration', 'push')} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 rounded-2xl gap-4">
              <div>
                <h3 className="font-semibold">Payment Failure Alerts</h3>
                <p className="text-sm text-muted-foreground">Critical alerts for subscription or utility payment failures.</p>
              </div>
              <div className="flex items-center gap-6 self-end sm:self-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email</span>
                  <Toggle active={notifications.payment.email} onClick={() => toggleNotification('payment', 'email')} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Push</span>
                  <Toggle active={notifications.payment.push} onClick={() => toggleNotification('payment', 'push')} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Subscription Plans</h2>
            </div>
            <button 
              onClick={() => { setEditingPlan(null); setIsPlanModalOpen(true); }}
              className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create New Tier
            </button>
          </div>

          <div className="p-6 xl:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan._id}
                className={`relative border rounded-2xl p-6 flex flex-col transition-all ${
                  plan.isPopular ? 'border-2 border-blue-500 bg-blue-500/5 shadow-lg' : 'border-border bg-card hover:border-blue-400/50'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-center bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Up to {plan.maxUnits || '∞'} Units</p>
                  </div>
                  <button onClick={() => handleDeletePlan(plan._id)} className="text-destructive hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">₹{plan.pricePerYear.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm ml-1">/year</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{plan.description}</p>
                </div>
                <div className="space-y-4 mb-8 flex-grow">
                  {plan.features?.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 fill-green-500 text-background" />
                      {feature}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => { setEditingPlan(plan); setIsPlanModalOpen(true); }}
                  className={`w-full py-2.5 font-semibold rounded-xl transition-colors text-sm ${
                    plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-500/10'
                  }`}
                >
                  Edit Plan
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Bar */}
      {unsavedChanges && (
        <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-300 md:pl-64">          
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6 fill-orange-500 text-white" />
              <span className="text-sm font-medium">You have unsaved changes in settings</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => fetchData()}
                className="flex-1 sm:flex-none px-6 py-2.5 text-foreground/70 font-semibold hover:bg-muted rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
              <button onClick={() => setIsPlanModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handlePlanSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Plan Name</label>
                  <input name="name" defaultValue={editingPlan?.name} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <input name="price" type="number" defaultValue={editingPlan?.pricePerYear} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Units (0 for Unlimited)</label>
                <input name="maxUnits" type="number" defaultValue={editingPlan?.maxUnits || 0} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" defaultValue={editingPlan?.description} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" rows={2} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Features (comma separated)</label>
                <input name="features" defaultValue={editingPlan?.features?.join(', ')} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Feature 1, Feature 2" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isPopular" defaultChecked={editingPlan?.isPopular} id="isPopular" />
                <label htmlFor="isPopular" className="text-sm font-medium">Set as Most Popular</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsPlanModalOpen(false)} className="flex-1 py-2.5 border rounded-xl font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default SystemSettings;