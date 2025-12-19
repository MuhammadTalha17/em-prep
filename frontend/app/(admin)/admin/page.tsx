"use client";

import { AppButton } from "@/components/AppButton";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import with SSR disabled is CRITICAL for SurveyJS
const SurveyCreatorWidget = dynamic(
  () => import("@/components/SurveyCreator"),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-gray-500">
        Loading Question Editor...
      </div>
    ),
  }
);

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState<
    "selection" | "primary" | "intermediate"
  >("selection");

  if (activeModule === "selection") {
    return (
      <div className="h-full flex flex-col justify-start pt-16 items-center max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Question Manager
        </h2>
        <p className="text-gray-500 mb-10 text-center">
          Select the question bank you want to contribute to.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-6">
          {/* Intermediate Card */}
          <AppButton
            appVariant="admin"
            className="w-full text-5xl font-extrabold h-16"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModule("intermediate");
            }}
          >
            Intermediate Bank
          </AppButton>

          {/* Primary Card */}
          <AppButton
            appVariant="admin"
            className="w-full text-5xl font-extrabold h-16"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModule("primary");
            }}
          >
            Primary Bank
          </AppButton>
        </div>
      </div>
    );
  }

  // MODE 2: EDITOR SCREEN
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center ">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => setActiveModule("selection")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors font-bold"
            title="Back to Selection"
          >
            ←
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeModule} Question Editor
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeModule === "primary" ? "bg-blue-500" : "bg-red-500"
                }`}
              ></span>
              Adding to {activeModule} bank
            </div>
          </div>
        </div>
        {/* This button currently does nothing but is ready for logic */}
        <AppButton appVariant="admin">Save to Database</AppButton>
      </div>
      {/* The Editor Container */}
      <div className="flex-1 min-h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SurveyCreatorWidget defaultLevel={activeModule} />
      </div>
    </div>
  );
}
