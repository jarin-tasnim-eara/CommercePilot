import RequireAuth from "@/components/auth/RequireAuth";
import Sidebar from "@/components/layout/Sidebar";
import MobileDrawer from "@/components/layout/MobileDrawer";
import Topbar from "@/components/layout/Topbar";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <MobileDrawer />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <Breadcrumbs />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}