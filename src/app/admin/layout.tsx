import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AdminGuard>
  );
}
