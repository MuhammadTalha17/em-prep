import { Avatar } from "@mantine/core";

export default function Header() {

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    AD
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900">
                    Admin Console
                  </h1>
                </div>
        
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-gray-900">
                    Administrator
                  </div>
                  <Avatar color="dark" radius="xl">
                    AD
                  </Avatar>
                </div>
              </header>
    )
}