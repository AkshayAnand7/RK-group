'use client'

import { useState } from "react";
import { Bell, Info, AlertTriangle, CheckCircle, AlertOctagon, Trash2, Check } from "lucide-react";
import { markAllAsRead, deleteNotification } from "./actions";

const getTypeStyles = (type: string) => {
  switch (type) {
    case "alert":
      return { icon: AlertTriangle, color: "text-danger", bg: "bg-danger-subtle" };
    case "warning":
      return { icon: AlertOctagon, color: "text-warning", bg: "bg-warning-subtle" };
    case "success":
    case "collection":
      return { icon: CheckCircle, color: "text-success", bg: "bg-success-subtle" };
    default:
      return { icon: Info, color: "text-info", bg: "bg-info-subtle" };
  }
};

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  async function handleMarkAllRead() {
    const result = await markAllAsRead();
    if (result.success) {
      window.location.reload();
    }
  }

  async function handleDelete(id: number) {
    const result = await deleteNotification(id);
    if (result.success) {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-text-secondary mt-1">Stay updated with system alerts and activities</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleMarkAllRead}
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
                  className={`p-4 flex gap-4 transition-colors hover:bg-page/30 animate-fade-in ${!notif.is_read ? "bg-primary/5" : ""}`}
                >
                  <div className={`w-10 h-10 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                    <style.icon className={`w-5 h-5 ${style.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${!notif.is_read ? "text-text-primary" : "text-text-secondary"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-text-muted whitespace-nowrap">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    {!notif.is_read && (
                      <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleDelete(notif.id)}
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
