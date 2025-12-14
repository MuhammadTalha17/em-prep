"use client";

import { Avatar, Menu } from "@mantine/core";

export function DashboardHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          EM
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          EM Prep
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">Dr. User</div>
            <div className="text-xs text-gray-500">Candidate</div>
          </div>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                color="red"
                radius="xl"
                className="cursor-pointer hover:opacity-90"
              >
                DU
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item>Profile</Menu.Item>
              <Menu.Item>Account</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red">Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </header>
  );
}
