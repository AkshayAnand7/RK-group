"use client";
import { useState } from "react";
import { 
  Settings, User, Lock, Bell, Shield, Globe, Database, 
  ChevronRight, Save, CheckCircle, Loader2, Camera
} from "lucide-react";

const sections = [
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "security", label: "Security & Password", icon: Lock },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "permissions", label: "Role Permissions", icon: Shield },
  { id: "system", label: "System Config", icon: Database },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar - horizontal on mobile, vertical on desktop */}
        <div className="lg:col-span-1">
          <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none pb-2 lg:pb-0">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === section.id 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-text-secondary hover:bg-surface hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="sm:hidden text-xs">{section.label.split(' ')[0]}</span>
                </div>
                {activeTab !== section.id && <ChevronRight className="w-4 h-4 opacity-40 hidden lg:block" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded-2xl border border-border overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">{sections.find(s => s.id === activeTab)?.label}</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {activeTab === "profile" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-surface shadow-sm overflow-hidden">
                        <span className="text-primary text-2xl font-bold">SA</span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Profile Photo</h3>
                      <p className="text-xs text-text-muted mt-1">JPG, GIF or PNG. Max size of 800K</p>
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 transition-all cursor-pointer">Upload</button>
                        <button className="px-3 py-1.5 text-text-muted text-xs font-semibold rounded-lg hover:bg-page transition-all cursor-pointer">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">First Name</label>
                      <input defaultValue="Akshay" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">Last Name</label>
                      <input defaultValue="Admin" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">Email</label>
                      <input defaultValue="admin@rkgroup.com" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">Phone</label>
                      <input defaultValue="+91 98765 43210" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full h-11 px-4 bg-page border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold mb-2">Two-Factor Authentication</h3>
                    <p className="text-xs text-text-secondary mb-4">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
                    <button className="px-4 py-2 bg-page border border-border rounded-lg text-xs font-semibold text-text-primary hover:bg-surface hover:shadow-sm transition-all cursor-pointer">Enable 2FA</button>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4 animate-fade-in">
                  {[
                    { label: "Email Notifications", desc: "Receive reports and alerts via email" },
                    { label: "App Notifications", desc: "Receive real-time alerts in the dashboard" },
                    { label: "Daily Summary", desc: "Receive a consolidated daily business report" },
                    { label: "Security Alerts", desc: "Get notified about unusual login attempts" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-page border border-border/50">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 sm:px-6 py-4 bg-page/50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-text-muted">Last updated: 13 May 2026</p>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-60 min-w-[120px] justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <><CheckCircle className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>

          <div className="bg-danger/5 border border-danger/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-danger">Delete Account</h3>
              <p className="text-xs text-danger/70 mt-1">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button className="px-4 py-2 bg-danger text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-all cursor-pointer">Deactivate Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}
