"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Stack,
  Title,
  Paper,
  FileInput,
  Text,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconUpload,
  IconAlertCircle,
  IconCheck,
} from "@tabler/icons-react";
import { apiClient } from "@/lib/axios";
import { AppButton } from "@/components/AppButton";
import { QuestionsTable } from "@/components/QuestionsTable";
import type { Question } from "@/lib/validation";

type EditableFields = {
  correct_answer: string;
  category: string;
};

interface UploadResponse {
  success: boolean;
  count: number;
  questions: Question[];
}

export default function UploadQuestionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editableFields, setEditableFields] = useState<Record<number, EditableFields>>({});
  const [error, setError] = useState<string | null>(null);
  const [planLevel, setPlanLevel] = useState<string | null>("Intermediate");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setEditableFields({});

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<UploadResponse>(
        "/questions/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        setQuestions(response.data.questions);
        console.log(`Extracted ${response.data.count} questions`);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectAnswerChange = useCallback(
    (index: number, value: string | null) => {
      setEditableFields((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          correct_answer: value || "",
        },
      }));
    },
    [],
  );

  const handleCategoryChange = useCallback(
    (index: number, value: string | null) => {
      setEditableFields((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          category: value || "",
        },
      }));
    },
    [],
  );

  const handleSave = async () => {
    if (!planLevel) return;

    setLoading(true);
    setError(null);

    try {
      const questionsToSave = questions.map((q, index) => {
        const edited = editableFields[index];
        return {
          questionText: q.question_text,
          questionType: "radiogroup",
          choices: q.choices,
          correctAnswer: edited?.correct_answer ?? q.correct_answer,
          category: edited?.category ?? q.category,
          planLevel: planLevel,
          explanation: q.explanation || "",
          imageUrl: q.image_url || undefined,
          explanationImageUrl: q.explanation_image_url || undefined,
        };
      });

      await apiClient.post("/questions/bulk", { questions: questionsToSave });

      setSaveSuccess(true);
      setQuestions([]);
      setEditableFields({});
      setFile(null);
      setPlanLevel("Primary");

      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to save questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Title order={2}>Upload Questions from PDF</Title>

        <Paper p="md" withBorder>
          <Stack gap="md">
            <FileInput
              label="Select PDF File"
              placeholder="Choose a PDF file"
              accept="application/pdf"
              value={file}
              onChange={setFile}
              leftSection={<IconUpload size={16} />}
              disabled={loading}
            />

            <AppButton
              onClick={handleUpload}
              disabled={!file || loading}
              appVariant="admin"
              leftSection={
                loading ? <Loader size="xs" color="dark" /> : <IconUpload size={16} />
              }
            >
              {loading ? "Uploading..." : "Upload and Extract Questions"}
            </AppButton>

            {file && (
              <Text size="sm" c="dimmed">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </Text>
            )}

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
                {error}
              </Alert>
            )}

            {saveSuccess && (
              <Alert icon={<IconCheck size={16} />} title="Success" color="green">
                Successfully saved questions to database!
              </Alert>
            )}

            {questions.length > 0 && (
              <Alert icon={<IconAlertCircle size={16} />} title="Success" color="green">
                Successfully extracted {questions.length} questions!
              </Alert>
            )}
          </Stack>
        </Paper>

        {questions.length > 0 && (
          <QuestionsTable
            questions={questions}
            editableFields={editableFields}
            planLevel={planLevel || ""}
            onCorrectAnswerChange={handleCorrectAnswerChange}
            onCategoryChange={handleCategoryChange}
            onPlanLevelChange={setPlanLevel}
            onSave={handleSave}
            canSave={true}
            saving={loading}
          />
        )}
      </Stack>
    </Container>
  );
}