"use client";
import { useExamStore } from "@/lib/store/examStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { questionsApi } from "@/lib/questions";
import {
  Card,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  Image,
  Radio,
} from "@mantine/core";
import { useEffect, useState } from "react";

export default function ExamPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const selectedCategories = useExamStore((state) => state.selectedCategories);
  const currentQuestionIndex = useExamStore(
    (state) => state.currentQuestionIndex
  );
  const questionIds = useExamStore((state) => state.questionIds);
  const setQuestionIds = useExamStore((state) => state.setQuestionIds);
  const answers = useExamStore((state) => state.answers);
  const setAnswer = useExamStore((state) => state.setAnswer);
  //local storage for immediate user feedback.
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["exam-questions", selectedCategories],
    queryFn: async () => {
      const allQuestions = await questionsApi.getAll();
      const filtered = allQuestions.filter((q: any) =>
        selectedCategories.includes(q.category)
      );
      // Saving only IDs to Zustand
      const ids = filtered.map((q: any) => q.id);
      setQuestionIds(ids);

      return filtered; // Keep full questions in component state
    },
    enabled: selectedCategories.length > 0 && isHydrated,
  });

  // Get current question
  const currentQuestionId = questionIds[currentQuestionIndex];
  const currentQuestion = questions.find(
    (q: any) => q.id === currentQuestionId
  );

  // Load saved answer
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestionId] || null);
  }, [currentQuestionIndex, answers, currentQuestionId]);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if no categories selected (only after hydration)
  useEffect(() => {
    if (isHydrated && selectedCategories.length === 0) {
      router.push("/user/questions-bank");
    }
  }, [isHydrated, selectedCategories, router]);

  // Show loader while hydrating
  if (!isHydrated || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader color="red" size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Stack gap="lg">
        {/* Progress Bar */}
        <div>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
            <Text size="sm" fw={600} c="red">
              {Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100
              )}
              % Complete
            </Text>
          </Group>
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            color="red"
            size="sm"
          />
        </div>

        {/* Question Card - ADD HERE */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <div>
              <Text size="lg" fw={600}>
                {currentQuestion?.questionText}
              </Text>
            </div>

            {/* Image if exists */}
            {currentQuestion?.imageUrl && (
              <Image
                src={currentQuestion?.imageUrl}
                alt="Question image"
                radius="md"
                mah={300}
                fit="contain"
              />
            )}

            {/* Answer choices */}
            <Radio.Group
              value={selectedAnswer || ""}
              onChange={(value) => {
                setSelectedAnswer(value); // 1. Update UI instantly
                setAnswer(currentQuestionId, value); // 2. Save to Zustand
              }}
            >
              <Stack gap="sm">
                {currentQuestion?.choices.map((choice: any, index: number) => (
                  <Radio
                    key={index}
                    value={choice.value}
                    label={choice.text}
                    size="md"
                    styles={{
                      label: { cursor: "pointer" },
                    }}
                  />
                ))}
              </Stack>
            </Radio.Group>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}
