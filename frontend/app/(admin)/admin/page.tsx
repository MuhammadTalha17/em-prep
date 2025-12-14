export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded">
          <div className="text-zinc-500 text-sm">Total Questions</div>
          <div className="text-3xl font-mono text-white">0</div>
        </div>
        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded">
          <div className="text-zinc-500 text-sm">Active Users</div>
          <div className="text-3xl font-mono text-white">0</div>
        </div>
      </div>
    </div>
  );
}
