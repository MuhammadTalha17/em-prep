import { Button } from "@mantine/core";

export default function UserDashboard() {
  return (
    <div>
      {/* Session Card: Clean White, Soft Shadow, Crisp Border */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
        {/* Subtle red accent on the right instead of dark glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-4 -mt-4 z-0 opacity-50"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome Back, Candidate
        </h2>

        <h3 className="text-xl font-bold mb-2 text-gray-900 z-10 relative">
          Resume Session
        </h3>

        <p className="text-gray-600 mb-6 z-10 relative max-w-md mt-2">
          You have no active sessions. Start a new practice exam to track your
          progress and improve your weak areas.
        </p>

        <div className="flex gap-3 z-10 relative mt-4">
          <Button
            color="red"
            size="md"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            Start New Session
          </Button>

          <Button
            variant="outline"
            color="gray"
            size="md"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            View History
          </Button>
        </div>
      </div>

      {/* Example Status Stats Row (Clean Look) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Questions Answered
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">0</div>
        </div>
        {/* ... more stats ... */}
      </div>
    </div>
  );
}
