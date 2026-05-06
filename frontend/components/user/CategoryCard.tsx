"use client";

import { Card, Text, Badge, Group, Stack, Progress } from "@mantine/core";
import { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: {
    label: string;
    color: string;
  };
  masteryLevel: number;
  totalQuestions: number;
  incorrectQuestions: number;
}

export function CategoryCard({
  icon,
  title,
  description,
  badge,
  masteryLevel,
  totalQuestions,
  incorrectQuestions,
}: CategoryCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="bg-white border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Top Row: Icon + Badge */}
      <Group justify="space-between" mb="md">
        <div className="w-12 h-12 rounded-md bg-red-50 flex items-center justify-center">
          {icon}
        </div>
        {badge && (
          <Badge variant="light" color={badge.color} size="sm">
            {badge.label}
          </Badge>
        )}
      </Group>

      {/* Middle Row: Title + Description */}
      <Text fw={600} size="lg" className="text-slate-800 mt-4 mb-1">
        {title}
      </Text>
      <Text size="sm" c="dimmed" className="text-slate-500 line-clamp-2">
        {description}
      </Text>

      {/* Bottom Row: Stats & Progress */}
      <Stack gap="xs" mt="xl">
        <Group justify="space-between">
          <Text size="xs" fw={700} className="text-slate-700">
            Mastery Level
          </Text>
          <Text size="xs" fw={600} className="text-[#BA0C2F]">
            {masteryLevel}%
          </Text>
        </Group>

        <Progress
          value={masteryLevel}
          size="sm"
          color="crimson"
          classNames={{ root: "bg-slate-100" }}
        />

        <Group justify="space-between">
          <Text size="xs" className="text-slate-400">
            {totalQuestions} Questions
          </Text>
          <Text size="xs" className="text-slate-400">
            {incorrectQuestions} Incorrect
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}