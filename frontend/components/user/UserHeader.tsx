"use client";

import { Avatar, Menu } from "@mantine/core";
import { useId } from "react";

export function UserHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 shadow-sm z-20">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#BA0C2F] font-bold text-lg shadow-sm border border-slate-200">
          EM
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
          EM Prep
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-3 pl-3 md:pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">Dr. User</div>
            <div className="text-xs text-slate-500">Candidate</div>
          </div>

          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Avatar
                color="crimson"
                radius="xl"
                className="cursor-pointer hover:opacity-90 ring-2 ring-slate-200"
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
              <Menu.Item color="crimson">Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
    </header>
  );
}
