import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans ">
      {/* Client Component Header */}
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 flex flex-col pt-6 pb-4 px-4 md:flex bg-white border-r border-gray-200">
          <div className="flex-1 flex flex-col gap-1">
            {/* Nav Item: Active (Red background for "selected" feel, widely used in Medical Apps) */}
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 bg-red-50 text-red-700 rounded-xl font-semibold transition-all"
            >
              <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center text-red-600 text-xs">
                D
              </div>
              Dashboard
            </a>

            {/* Nav Item: Inactive */}
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium"
            >
              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xs">
                Q
              </div>
              Question Bank
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all font-medium"
            >
              <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-xs">
                P
              </div>
              Performance
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
