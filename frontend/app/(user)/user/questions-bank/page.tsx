"use client";

import { Card, Text, Badge, Group, Stack } from "@mantine/core";
import {
  IconHeart,
  IconAmbulance,
  IconBabyCarriage,
  IconFlask,
  IconActivity,
  IconEye,
  IconEar,
  IconWoman,
  IconPill,
  IconDroplet,
  IconBrain,
  IconStethoscope,
  IconSnowflake,
  IconWheelchair,
  IconVirus,
  IconAlertCircle,
  IconRadioactive,
  IconBone,
  IconLungs,
  IconScissors,
  IconTestPipe,
  IconHeartbeat,
  IconCookie,
  IconDropletFilled,
  IconBug,
  IconTool,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppButton } from "@/components/AppButton";
import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/questions";
import { useExamStore } from "@/lib/store/examStore";

const iconMap: Record<string, any> = {
  Cardiology: IconHeart,
  MajorTrauma: IconAmbulance,
  MinorTrauma: IconAlertCircle,
  Pediatrics: IconBabyCarriage,
  Toxicology: IconFlask,
  Resuscitation: IconActivity,
  Eye: IconEye,
  ENT: IconEar,
  ObstetricAndGynaecology: IconWoman,
  PainAndSedation: IconPill,
  Nephrology: IconDroplet,
  Neurology: IconBrain,
  Gastroenterology: IconStethoscope,
  EnvironmentalEmergencies: IconSnowflake,
  ElderlyCare: IconWheelchair,
  Dermatology: IconVirus,
  Allergy: IconAlertCircle,
  OncologicalEmergencies: IconRadioactive,
  Musculoskeletal: IconBone,
  Respiratory: IconLungs,
  SurgicalEmergencies: IconScissors,
  Urology: IconTestPipe,
  Vascular: IconHeartbeat,
  Endocrinology: IconCookie,
  Haemotology: IconDropletFilled,
  InfectiousDiseases: IconBug,
  ProceduralSkills: IconTool,
  ComplexOrChallengingSituations: IconAlertTriangle,
};

const colorMap: Record<string, string> = {
  Cardiology: "red",
  MajorTrauma: "orange",
  MinorTrauma: "yellow",
  Pediatrics: "blue",
  Toxicology: "green",
  Resuscitation: "pink",
  Eye: "cyan",
  ENT: "grape",
  ObstetricAndGynaecology: "pink",
  PainAndSedation: "violet",
  Nephrology: "teal",
  Neurology: "indigo",
  Gastroenterology: "lime",
  EnvironmentalEmergencies: "cyan",
  ElderlyCare: "gray",
  Dermatology: "orange",
  Allergy: "yellow",
  OncologicalEmergencies: "red",
  Musculoskeletal: "orange",
  Respiratory: "blue",
  SurgicalEmergencies: "red",
  Urology: "teal",
  Vascular: "red",
  Endocrinology: "grape",
  Haemotology: "red",
  InfectiousDiseases: "green",
  ProceduralSkills: "gray",
  ComplexOrChallengingSituations: "orange",
};

export default function QuestionsBank() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const setExamCategories = useExamStore(
    (state) => state.setSelectedCategories
  );
  const router = useRouter();

  const {
    data: categories = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: () => questionsApi.getAll(),
    select: (questions: any) => {
      const counts: Record<string, number> = {};
      questions.forEach((q: any) => {
        counts[q.category] = (counts[q.category] || 0) + 1;
      });
      return counts;
    },
  });

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const startQuiz = () => {
    setExamCategories(selectedCategories);
    router.push("/user/exam");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Stack gap="xl">
        <div>
          <Text size="xl" fw={700} c="red.8" className="text-2xl md:text-3xl">
            Select Practice Categories
          </Text>
          <Text size="sm" c="dimmed" className="mt-2">
            Choose one or more categories to practice
          </Text>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(categories).map(([category, count]) => {
            const Icon = iconMap[category] || IconActivity;
            const color = colorMap[category] || "gray";
            const isSelected = selectedCategories.includes(category);

            return (
              <Card
                key={category}
                shadow="sm"
                padding="sm"
                radius="md"
                withBorder
                className={`cursor-pointer transition-all hover:shadow-lg border ${
                  isSelected
                    ? "ring-2 ring-red-500 bg-linear-to-br from-red-50 to-red-100 border-red-200"
                    : "bg-linear-to-br from-white to-red-50/30 border-red-100/50 hover:border-red-200 hover:from-red-50/50 hover:to-red-100/50"
                }`}
                onClick={() => toggleCategory(category)}
              >
                <Group justify="space-between" mb="xs">
                  <Icon size={32} color={`var(--mantine-color-${color}-6)`} />
                  {isSelected && (
                    <Badge color="red" variant="filled" size="xs">
                      Selected
                    </Badge>
                  )}
                </Group>

                <Text fw={600} size="md" mb="xs">
                  {category}
                </Text>
                <Text
                  size="xs"
                  c="white"
                  className="bg-red-500/80 font-bold px-2 py-1 rounded"
                >
                  {count === 1 ? "1 question" : `${count} questions`}
                </Text>
              </Card>
            );
          })}
        </div>

        {selectedCategories.length > 0 && (
          <div className="flex justify-center mt-4">
            <AppButton
              appVariant="user"
              size="lg"
              onClick={startQuiz}
              className="px-8"
            >
              Start Quiz ({selectedCategories.length}{" "}
              {selectedCategories.length === 1 ? "category" : "categories"})
            </AppButton>
          </div>
        )}
      </Stack>
    </div>
  );
}
