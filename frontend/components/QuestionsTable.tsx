"use client";

import { memo, useMemo, useDeferredValue } from "react";
import {
  Paper,
  Title,
  Stack,
  Group,
  Badge,
  Table,
  Select,
  Text,
  Alert,
  Image,
  Box,
  Tooltip,
  ActionIcon,
  Loader,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { AppButton } from "@/components/AppButton";
import { validateQuestions, CATEGORIES, type Question } from "@/lib/validation";

type EditableFields = {
  correct_answer: string;
  category: string;
};

type ValidationResult = {
  results: Array<{
    index: number;
    errors: Array<{ field: string; message: string }>;
    isValid: boolean;
  }>;
  summary: {
    totalQuestions: number;
    validCount: number;
    invalidCount: number;
    needsReviewCount: number;
    duplicateIndices: number[];
  };
  canSave: boolean;
};

interface QuestionsTableProps {
  questions: Question[];
  editableFields: Record<number, EditableFields>;
  planLevel: string;
  onCorrectAnswerChange: (index: number, value: string | null) => void;
  onCategoryChange: (index: number, value: string | null) => void;
  onPlanLevelChange: (value: string | null) => void;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
}

// Memoized row component
const QuestionRow = memo(({
  q,
  index,
  mergedQ,
  rowResult,
  isInvalid,
  categoryOptions,
  onCorrectAnswerChange,
  onCategoryChange,
}: {
  q: Question;
  index: number;
  mergedQ: Question;
  rowResult: any;
  isInvalid: boolean;
  categoryOptions: readonly string[];
  onCorrectAnswerChange: (index: number, value: string | null) => void;
  onCategoryChange: (index: number, value: string | null) => void;
}) => (
  <Table.Tr
    style={{
      backgroundColor: isInvalid ? "var(--mantine-color-red-0)" : undefined,
    }}
  >
    <Table.Td>{index + 1}</Table.Td>
    <Table.Td style={{ maxWidth: 300 }}>
      <Text size="sm">{q.question_text}</Text>
    </Table.Td>
    <Table.Td>
      <Stack gap="xs">
        {Object.entries(q.choices).map(([key, value]) => (
          <Box key={key} style={{ fontSize: "0.875rem" }}>
            <Badge size="sm" mr="xs">{key}</Badge>
            {value}
          </Box>
        ))}
      </Stack>
    </Table.Td>
    <Table.Td>
      <Select
        data={Object.keys(q.choices)}
        value={mergedQ.correct_answer}
        onChange={(value) => onCorrectAnswerChange(index, value)}
        w={80}
        error={isInvalid && rowResult?.errors?.some((e: any) => e.field === "correct_answer")}
      />
    </Table.Td>
    <Table.Td>
      <Select
        data={categoryOptions}
        value={mergedQ.category}
        onChange={(value) => onCategoryChange(index, value)}
        searchable
        w={200}
        error={isInvalid && rowResult?.errors?.some((e: any) => e.field === "category")}
      />
    </Table.Td>
    <Table.Td>
      <Stack gap="xs">
        {q.image_url && (
          <Box>
            <Badge size="xs" color="blue" mb={4}>Q</Badge>
            <Image src={q.image_url} alt="Question" w={60} h={60} fit="contain" />
          </Box>
        )}
        {q.explanation_image_url && (
          <Box>
            <Badge size="xs" color="green" mb={4}>Exp</Badge>
            <Image src={q.explanation_image_url} alt="Explanation" w={60} h={60} fit="contain" />
          </Box>
        )}
        {!q.image_url && !q.explanation_image_url && (
          <Text size="sm" c="dimmed">No image</Text>
        )}
      </Stack>
    </Table.Td>
    <Table.Td>
      <Tooltip
        label={
          rowResult?.errors?.length > 0 ? (
            <Stack gap={4}>
              {rowResult.errors.map((err: any, i: number) => (
                <Text key={i} size="xs">{err.message}</Text>
              ))}
            </Stack>
          ) : "All good"
        }
        multiline
        w={200}
      >
        <ActionIcon
          color={isInvalid ? "red" : "green"}
          variant="light"
          size="sm"
        >
          {isInvalid ? <IconAlertTriangle size={14} /> : <IconCheck size={14} />}
        </ActionIcon>
      </Tooltip>
    </Table.Td>
  </Table.Tr>
));

export function QuestionsTable({
  questions,
  editableFields,
  planLevel,
  onCorrectAnswerChange,
  onCategoryChange,
  onPlanLevelChange,
  onSave,
  canSave,
  saving,
}: QuestionsTableProps) {
  // Memoize category options
  const categoryOptions = useMemo(() => CATEGORIES, []);

  // Merge questions with editable fields - only recomputes when questions or editableFields change
  const mergedQuestions = useMemo(() => {
    return questions.map((q, index) => ({
      ...q,
      correct_answer: editableFields[index]?.correct_answer ?? q.correct_answer,
      category: editableFields[index]?.category ?? q.category,
    }));
  }, [questions, editableFields]);

  // Deferred value for validation
  const deferredMergedQuestions = useDeferredValue(mergedQuestions);

  // Validation - only recomputes when deferred value changes
  const validation: ValidationResult = useMemo(() => {
    const result = validateQuestions(deferredMergedQuestions);
    return {
      ...result,
      canSave: result.summary.invalidCount === 0 && questions.length > 0,
    };
  }, [deferredMergedQuestions, questions.length]);

  // Get merged question for display
  const getMergedQuestion = (index: number) => mergedQuestions[index];

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Preview Questions ({questions.length})</Title>
          <Group gap="md">
            <Badge
              size="lg"
              color={validation.summary.invalidCount > 0 ? "red" : "green"}
              leftSection={
                validation.summary.invalidCount > 0 ? (
                  <IconAlertTriangle size={14} />
                ) : (
                  <IconCheck size={14} />
                )
              }
            >
              {validation.summary.validCount} ready,{" "}
              {validation.summary.needsReviewCount} need review
            </Badge>
            <Select
              label="Plan Level (applies to all)"
              placeholder="Select plan level"
              data={["Primary", "Intermediate"]}
              value={planLevel}
              onChange={onPlanLevelChange}
              w={200}
            />
          </Group>
        </Group>

        {validation.summary.needsReviewCount > 0 && (
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Validation Issues"
            color="yellow"
          >
            {validation.summary.needsReviewCount} question(s) have validation
            problems and cannot be saved until corrected.
            {validation.summary.duplicateIndices.length > 0 && (
              <Text size="sm" mt={4}>
                {validation.summary.duplicateIndices.length} duplicate(s) detected.
              </Text>
            )}
          </Alert>
        )}

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Question</Table.Th>
              <Table.Th>Choices</Table.Th>
              <Table.Th>Correct Answer</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Image</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {questions.map((q, index) => {
              const mergedQ = getMergedQuestion(index);
              const rowResult = validation.results[index];
              const isInvalid = rowResult && !rowResult.isValid;

              return (
                <QuestionRow
                  key={index}
                  q={q}
                  index={index}
                  mergedQ={mergedQ}
                  rowResult={rowResult}
                  isInvalid={isInvalid}
                  categoryOptions={categoryOptions}
                  onCorrectAnswerChange={onCorrectAnswerChange}
                  onCategoryChange={onCategoryChange}
                />
              );
            })}
          </Table.Tbody>
        </Table>

        <AppButton
          appVariant="admin"
          onClick={onSave}
          size="lg"
          disabled={!canSave || !planLevel || saving}
          leftSection={saving ? <Loader size="xs" color="dark" /> : undefined}
          fullWidth
        >
          {saving ? "Saving..." : `Save ${questions.length} Questions to Database`}
        </AppButton>
      </Stack>
    </Paper>
  );
}