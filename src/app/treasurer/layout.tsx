import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["Treasurer"]} portalName="Treasurer Portal">
      <DashboardLayout>{children}</DashboardLayout>
    </RoleGuard>
  );
}
