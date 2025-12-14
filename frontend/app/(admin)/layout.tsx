export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Standard Light Theme Classes
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm">
        <div className="w-10 h-10 bg-red-600 rounded mb-8 shadow-sm"></div>
      </aside>
      <main className="flex-1 p-6">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-xl font-mono font-bold text-gray-700">
            Admin_Console
          </h1>
        </header>
        {children}
      </main>
    </div>
  );
}
