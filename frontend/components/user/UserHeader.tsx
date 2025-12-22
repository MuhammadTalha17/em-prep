"use client";

import { Avatar, Menu } from "@mantine/core";
import { useId } from "react";

export function UserHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-linear-to-r from-red-700 to-red-800 shadow-md z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-600 font-bold text-lg shadow-sm">
          EM
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
          EM Prep
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-red-500">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">Dr. User</div>
            <div className="text-xs text-red-100">Candidate</div>
          </div>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                color="white"
                radius="xl"
                className="cursor-pointer hover:opacity-90 ring-2 ring-red-400"
                size="sm"
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
