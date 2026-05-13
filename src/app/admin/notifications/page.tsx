"use client";
import { useState } from "react";
import { Bell, Info, AlertTriangle, CheckCircle, AlertOctagon, MoreVertical, Trash2, Check } from "lucide-react";

const demoNotifications = [
  {
    id: 1,
    title: "Fuel Expense Alert",
    message: "Vehicle MH-12-AB-1234 has exceeded daily fuel limit of ₹3,000 for 3 days.",
    type: "alert",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Daily Summary Generated",
    message: "RK Lottery and RK Travel daily summaries for 12 May 2026 are ready for review.",
    type: "info",
    time: "5 hours ago",
    isRead: false,
  },
  {
    id: 3,
    title: "Duplicate Salary Detected",
    message: "Possible duplicate entry for driver Rajesh Patil on 12 May 2026.",
    type: "warning",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 4,
    title: "Collection Submitted",
    message: "Staff Rahul Sharma submitted daily collection for RK Shop 1.",
    type: "success",
    time: "1 day ago",
    isRead: true,
  },
  {
    id: 5,
    title: "Maintenance Reminder",
    message: "Vehicle MH-14-CD-5678 is due for oil change service.",
    type: "info",
    time: "2 days ago",
    isRead: true,
  },
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "alert":
      return { icon: AlertTriangle, color: "text-danger", bg: "bg-danger-subtle" };
    case "warning":
      return { icon: AlertOctagon, color: "text-warning", bg: "bg-warning-subtle" };
    case "success":
      return { icon: CheckCircle, color: "text-success", bg: "bg-success-subtle" };
    default:
      return { icon: Info, color: "text-info", bg: "bg-info-subtle" };
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-text-secondary mt-1">Stay updated with system alerts and activities</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-page transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => {
              const style = getTypeStyles(notif.type);
              return (
                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-4 transition-colors hover:bg-page/30 animate-fade-in stagger-${Math.min(i + 1, 5)} ${!notif.isRead ? "bg-primary/5" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                    <style.icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${!notif.isRead ? "text-text-primary" : "text-text-secondary"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 text-text-muted hover:text-danger hover:bg-danger-subtle rounded-lg transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-page flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">No notifications</h3>
              <p className="text-sm text-text-secondary">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
