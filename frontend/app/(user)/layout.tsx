import { UserHeader } from "@/components/user/UserHeader";
import { UserNavbar } from "@/components/user/UserNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-slate-800 font-sans">
      <UserHeader />

      <div className="flex flex-1 overflow-hidden">
        <UserNavbar />
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
