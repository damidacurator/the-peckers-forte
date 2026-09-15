import React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  changeText?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, changeText, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-blue">
            {icon}
          </div>
        </div>
        {(trend || changeText) && (
          <div className="mt-4 flex items-center text-sm">
            {trend === "up" && <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />}
            {trend === "down" && <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />}
            <span
              className={cn(
                "font-medium",
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {changeText}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
