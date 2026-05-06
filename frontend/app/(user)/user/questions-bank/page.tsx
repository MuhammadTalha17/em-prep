"use client";

import { SimpleGrid, Title, Text, Stack } from "@mantine/core";
import {
  IconHeart,
  IconAmbulance,
  IconBabyCarriage,
  IconFlask,
  IconActivity,
  IconBrain,
} from "@tabler/icons-react";
import { CategoryCard } from "@/components/user/CategoryCard";

const mockCategories = [
  {
    id: "trauma",
    title: "Trauma Management",
    description: "Assessment and management of major and minor traumatic injuries including ABCDE approach.",
    icon: <IconAmbulance size={24} color="#BA0C2F" />,
    badge: { label: "Advanced", color: "green" },
    masteryLevel: 72,
    totalQuestions: 45,
    incorrectQuestions: 12,
  },
  {
    id: "cardiology",
    title: "Cardiology",
    description: "Emergency cardiac conditions including ACS, arrhythmias, heart failure, and cardiac arrest.",
    icon: <IconHeart size={24} color="#BA0C2F" />,
    badge: { label: "Critical Gap", color: "red" },
    masteryLevel: 38,
    totalQuestions: 52,
    incorrectQuestions: 32,
  },
  {
    id: "resuscitation",
    title: "Resuscitation",
    description: "BLS, ALS, PALS protocols, airway management, and emergency cardiovascular care.",
    icon: <IconActivity size={24} color="#BA0C2F" />,
    badge: { label: "Proficient", color: "blue" },
    masteryLevel: 85,
    totalQuestions: 30,
    incorrectQuestions: 4,
  },
  {
    id: "pediatrics",
    title: "Pediatric Emergencies",
    description: "Emergency care of infants and children including developmental considerations.",
    icon: <IconBabyCarriage size={24} color="#BA0C2F" />,
    badge: { label: "Needs Review", color: "orange" },
    masteryLevel: 55,
    totalQuestions: 38,
    incorrectQuestions: 17,
  },
  {
    id: "toxicology",
    title: "Toxicology",
    description: "Management of poisoning and overdoses including antidotes and decontamination.",
    icon: <IconFlask size={24} color="#BA0C2F" />,
    badge: { label: "Advanced", color: "green" },
    masteryLevel: 68,
    totalQuestions: 25,
    incorrectQuestions: 8,
  },
  {
    id: "neurology",
    title: "Neurological Emergencies",
    description: "Stroke, seizures, altered consciousness, and other neurological emergencies.",
    icon: <IconBrain size={24} color="#BA0C2F" />,
    badge: { label: "Critical Gap", color: "red" },
    masteryLevel: 42,
    totalQuestions: 40,
    incorrectQuestions: 23,
  },
];

export default function QuestionsBankPage() {
  return (
    <Stack gap="xl" className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <Title order={1} className="text-3xl font-bold text-slate-800">
          Curriculum Mastery
        </Title>
        <Text size="sm" c="dimmed" className="mt-2 text-slate-500">
          Track your progress across emergency medicine categories
        </Text>
      </div>

      {/* Category Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, xl: 3 }} spacing="lg" className="w-full">
        {mockCategories.map((category) => (
          <CategoryCard
            key={category.id}
            icon={category.icon}
            title={category.title}
            description={category.description}
            badge={category.badge}
            masteryLevel={category.masteryLevel}
            totalQuestions={category.totalQuestions}
            incorrectQuestions={category.incorrectQuestions}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}