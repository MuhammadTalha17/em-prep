import Header from "@/components/admin/Header";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen  bg-gray-100 text-gray-900 font-sans ">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
