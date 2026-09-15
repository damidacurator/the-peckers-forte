"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((options: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, ...options }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex w-full items-start gap-4 rounded-lg border p-4 shadow-lg bg-background",
              t.type === "success" && "border-green-500 text-green-700",
              t.type === "error" && "border-red-500 text-red-700",
              t.type === "info" && "border-blue-500 text-blue-700"
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{t.title}</h3>
              {t.description && <p className="text-sm mt-1 opacity-90">{t.description}</p>}
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
