"use client";

import { useEffect, useRef, useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { Serializer } from "survey-core";
import { uploadImage } from "@/lib/supabase";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true,
  // simplified UI for admins
  //showJSONEditorTab: false,
};

interface SurveyCreatoreWidgetProps {
  defaultLevel: string;
  onCreatorReady?: (creator: SurveyCreator) => void;
}

export default function SurveyCreatoreWidget({
  defaultLevel,
  onCreatorReady,
}: SurveyCreatoreWidgetProps) {
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  // Use a ref to track the latest prop value without re-initializing Creator
  const levelRef = useRef(defaultLevel);
  useEffect(() => {
    levelRef.current = defaultLevel;
  }, [defaultLevel]);

  useEffect(() => {
    // 1. ADDING CUSTOM PROPERTY: "Category"
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
          { value: "intermediate", text: "Intermediate" },
          { value: "primary", text: "Primary" },
        ],
      });
    }

    //3. Image upload property
    Serializer.addProperty("question", {
      name: "imageLink",
      type: "file",
      category: "general",
      displayName: "Question Image",
    });

    const newCreator = new SurveyCreator(creatorOptions);

    newCreator.onUploadFile.add(async (_, options) => {
      const { files, callback } = options;
      try {
        const file = files[0];
        if (!file) return;
        console.log("Uploading file...", file.name);

        // Upload to Supabase
        const url = await uploadImage(file);
        console.log("Upload success:", url);
        // Pass URL back to SurveyJS
        callback("success", url);
      } catch (error) {
        console.error("Upload failed:", error);
        callback("error");
      }
    });

    newCreator.onQuestionAdded.add((sender, options) => {
      const currentLevel = levelRef.current;

      //both methods for safety
      options.question.plan_level = currentLevel;
      options.question.setPropertyValue("plan_level", currentLevel);
    });

    // Save Event Hook
    newCreator.saveSurveyFunc = (saveNo: any, callback: any) => {
      //console.log("Saving Survey JSON:", JSON.stringify(newCreator.JSON));
      callback(saveNo, true);
    };
    setCreator(newCreator);

    //callback
    if (onCreatorReady) {
      onCreatorReady(newCreator);
    }
  }, [onCreatorReady]);

  if (!creator) {
    return <div className="p-4 text-gray-500">Loading Editor...</div>;
  }

  return (
    <div className="h-[calc(100vh-200px)] w-full bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      {creator && <SurveyCreatorComponent creator={creator} />}
    </div>
  );
}
