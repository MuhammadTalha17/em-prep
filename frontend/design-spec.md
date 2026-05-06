Text-Based Visual Design Spec (Reference UI)

1. Global Theme & Colors
   Primary Accent (Red): Deep crimson/red (approx #BA0C2F). Used for active states, buttons, progress bars, and icons.
   App Background: Very light off-white/gray (#F8F9FA or Tailwind bg-gray-50).
   Surface/Card Background: Pure white (#FFFFFF).
   Text Colors:
   Primary Text: Dark slate/gray (#1e293b or Tailwind text-slate-800), not pure black.
   Secondary Text: Muted gray (#64748b or Tailwind text-slate-500).
   Borders: Very light gray (#e2e8f0 or Tailwind border-slate-200).
2. Layout Structure
   Top Header: Solid white background, 1px light gray bottom border. Left side has logo (dark text with red accent). Right side has user avatar.
   Sidebar (Left): Solid white background, 1px light gray right border.
   Active Item: Light red background (bg-red-50), red text, red icon.
   Inactive Items: Transparent background, dark gray text, gray icons.
   Main Content Area: Light gray app background (#F8F9FA) to make the white cards pop. Generous padding (e.g., p-8).
3. "Question Bank" Page Layout (Curriculum Mastery)
   Page Header:
   Title: Large, bold, dark slate text (e.g., text-3xl font-bold text-slate-800).
   Subtitle: Smaller, muted gray text below the title.
   Category Grid: A 3-column grid (grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6).
4. Category Card Component Design
   Each card in the grid must follow this exact anatomy:
   Container: White background, rounded corners (radius="md" or rounded-xl), 1px light gray border, very subtle shadow (shadow-sm).
   Inner Padding: Generous padding (p-6).
   Top Row (Flex Container):
   Left: A small square icon wrapper. Very light red background (bg-red-50), rounded corners (rounded-md), containing a red icon (text-primary).
   Right: A Mantine <Badge>. Visual variant depends on data (e.g., light green text/bg for "Advanced", light red for "Critical Gap").
   Middle Row (Text):
   Title: Bold, medium size (text-lg font-semibold mt-4 mb-1).
   Description: Small, muted gray text, limited to 2 lines (text-sm text-slate-500).
   Bottom Row (Stats & Progress - pinned to bottom of card):
   Spacing: Add a top margin (mt-6) to separate from the text.
   Labels: Flex container with "Mastery Level" (left, small bold text) and the percentage (right, small red text).
   Progress Bar: Mantine <Progress> bar. Very thin (size="sm"), filled with the primary red color, gray track.
   Footer Stats: Flex container below progress bar. "X Questions" on the left, "Y Incorrect" on the right. Both are very small, extremely light gray text (text-xs text-slate-400).
