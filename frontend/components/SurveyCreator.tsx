"use client";

import { useEffect, useRef, useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import { Serializer } from "survey-core";

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  // simplified UI for admins
  //showJSONEditorTab: false,
};

interface SurveyCreatoreWidgetProps {
  defaultLevel: string;
}

export default function SurveyCreatoreWidget({
  defaultLevel,
}: SurveyCreatoreWidgetProps) {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  // Use a ref to track the latest prop value without re-initializing Creator
  const levelRef = useRef(defaultLevel);
  useEffect(() => {
    levelRef.current = defaultLevel;
  }, [defaultLevel]);

  useEffect(() => {
    // 1. ADD CUSTOM PROPERTY: "Category"
    // This adds a new field to every question's property pane
    Serializer.addProperty("question", {
      name: "category",
      type: "dropdown",
      category: "general", // Put it in the main General tab
      displayName: "Question Category",
      choices: [
        "Cardiology",
        "Trauma",
        "Pediatrics",
        "Toxicology",
        "Resuscitation",
      ],
    });

    // 2. ADD PLAN LEVEL PROPERTY (With Default)
    if (!Serializer.findProperty("question", "plan_level")) {
      Serializer.addProperty("question", {
        name: "plan_level",
        type: "dropdown",
        category: "general",
        displayName: "Plan Level",
        choices: [
          { value: "primary", text: "Primary" },
          { value: "intermediate", text: "Intermediate" },
          { value: "advanced", text: "Advanced" },
        ],
      });
    }

    const newCreator = new SurveyCreator(creatorOptions);

    newCreator.onQuestionAdded.add((sender, options) => {
      const currentLevel = levelRef.current;

      // Try both methods for safety
      options.question.plan_level = currentLevel;
      options.question.setPropertyValue("plan_level", currentLevel);
    });

    // Save Event Hook
    newCreator.saveSurveyFunc = (saveNo: any, callback: any) => {
      console.log("Saving Survey JSON:", JSON.stringify(newCreator.JSON));
      callback(saveNo, true);
    };
    setCreator(newCreator);
  }, []);

  if (!creator)
    return <div className="p-4 text-gray-500">Loading Editor...</div>;

  return (
    <div className="h-[calc(100vh-200px)] w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
