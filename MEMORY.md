# Iron-Log Project Memory

## Project Overview
**FYT FYN FYN** — Minimalist fitness tracking app built with React + Vite + Supabase.

**Tech Stack:**
- React 18 + React Router
- Vite build tool
- Supabase (PostgreSQL backend)
- Tailwind CSS + custom CSS animations
- Custom SVG line charts (no Recharts dependency)
- Custom Collapse component for expand/collapse animations

**Repository:** https://github.com/fosxteri000/iron-log

---

## Recent Major Features (This Session)

### 1. Stats Page Complete Redesign
**File:** `src/pages/Progress.jsx` (full rewrite)

**New layout (top to bottom):**
1. **Summary Card** — THIS WEEK overview with sessions/cardio/cheat counts + trend indicators (↑↓→) vs last week
2. **Insight Strip** — 3 horizontal-scroll cards: consistency + streak, balance ratios, best session this month
3. **Donut Chart** — Training split breakdown (dynamic per user's program), center shows active days
4. **Weekly Bar Chart** — 8-week session history, stacked strength/cardio with cheat day markers
5. **Volume Trend Line** — Weekly/monthly toggle for strength volume progression
6. **Best Lifts** — Per-category top 5 exercises, last 30 days

**New Components:**
- `src/components/SummaryCard.jsx` — Trend card with comparative analysis
- `src/components/InsightStrip.jsx` — Scrollable insight cards
- `src/components/DonutChart.jsx` — SVG donut with opacity-based coloring
- `src/components/WeeklyBarChart.jsx` — SVG stacked bar chart
- `src/components/VolumeTrendChart.jsx` — Wrapper with weekly/monthly mode toggle

**New Utilities:**
- `src/lib/statsQueries.js` — Data aggregation functions:
  - `getWeekSummary()` — This week vs last week sessions/volume/cardio
  - `getCurrentStreak()` — Consecutive active days
  - `getBalanceData()` — Volume ratio by category
  - `getSplitBreakdown()` — 30-day training split breakdown
  - `getWeeklySessions()` — Last 8 weeks session counts
  - `getVolumeTrend()` — Weekly or monthly volume progression
  - `getBestSession()` — Highest volume session this month

- `src/lib/statsInsights.js` — Insight generation (praise/roast messages):
  - `getDonutMessage()` — Balance feedback
  - `getBarMessage()` — Consistency feedback
  - `getVolumeMessage()` — Trend feedback

**Key Design Decisions:**
- All charts use custom SVG (no external chart library)
- Donut segments use CSS variable colors with opacity variations
- Chevron animations on toggle buttons
- Stagger animations for cards on page load
- No pagination — all data shown (last 8 weeks, 30 days, etc.)

---

### 2. Exercise Logging UX Redesign
**Files:** `src/components/CategorySection.jsx`, `src/components/ExerciseInlineForm.jsx`, `src/pages/ExerciseDetail.jsx`

**Pattern Change:**
- **Before:** Tap exercise → navigate to separate page with form + chart + history
- **After:** Tap exercise → expand inline (exactly like Cardio section), no navigation

**CategorySection.jsx Changes:**
- `expandedId` state tracks which exercise is open (only one at a time)
- Tap exercise name → `toggleExpand()` → inline form appears
- Chevron icon rotates 180° on expand using CSS `rotate-180`
- `History ↗` button (small, muted, right side) → navigates to detail page
- Edit/delete mode preserved as before

**ExerciseInlineForm.jsx (new):**
- Self-contained component with full logging UI
- Shows: Last session → Suggestion pills A/B (progressive overload) → USE LAST SESSION button → Target inputs → LOG SETS
- Collapse animation for set rows
- On save: displays funny message → auto-collapses row
- Uses `useExerciseHistory()` hook internally

**ExerciseDetail.jsx Changes:**
- Removed log form entirely (moved to inline)
- Now shows only: Volume trend chart + Max weight chart + Personal Bests + History
- Added new **Personal Bests** card (max weight ever, best set ever with dates)
- History expanded to show 20 sessions (was 10)

---

## Architecture Patterns

### Data Flow
1. Hooks fetch data from Supabase (`useExercises`, `useExerciseHistory`, `useProgressData`, etc.)
2. Data passed to components as props or via custom hooks
3. LocalStorage caches user profile for instant load
4. Animations use CSS transitions or keyframe animations (no JavaScript animation libraries)

### Component Organization
- **Pages:** Home, Progress, ExerciseDetail, Calendar, Login, Settings, Setup
- **Components:** CategorySection (with nested ExerciseInlineForm), CardioSection, BodyWeightSection, CheatDaySection, LineChart, Collapse
- **Hooks:** useExercises, useExerciseHistory, useProgressData, useCardio, useBodyWeight, useCheatDays, useProfile, useAuth, useTheme

### State Management
- Profile uses React Context (ProfileProvider in App.jsx)
- Page-level state for expand/collapse, editing, forms
- No Redux/Zustand — kept minimal

---

## Design Tokens & Styling

**CSS Variables (theme-aware):**
```
--t-bg, --t-bg-alt, --t-bg-alt2 (backgrounds)
--t-text, --t-text-inv (text colors)
--t-muted, --t-muted-soft (secondary text)
--t-border, --t-border-light, --t-border-mid (borders)
--t-accent, --t-accent-text (primary colors)
--t-cheat (orange for cheat days)
```

**Themes:** light (default), dark, cherry, blue

**Key Animations:**
- `fadeIn` — page entrance
- `cardIn` — stagger animation for cards
- `slideUp`, `popIn` — entrance animations
- `collapse-content` — grid-template-rows collapse (uses Collapse component)
- `rotate-180` — chevron toggle

**Typography:**
- Font sizes use `clamp()` for responsive scaling
- Letter-spacing: `tracking-widest`, `tracking-[0.3em]`, etc.
- Weights: bold (700), normal (400)

---

## Database Schema (Supabase)
- `exercises` (user_id, name, category)
- `workout_sessions` (user_id, date)
- `workout_sets` (user_id, exercise_id, session_id, weight_kg, reps, target_weight_kg, target_reps)
- `cardio_sessions` (user_id, date, duration_minutes, calories, type, distance_km, incline_level, speed_level)
- `body_weight_logs` (user_id, date, weight_kg, body_fat_percent)
- `cheat_days` (user_id, date, selections [array])
- `user_profiles` (user_id, name, split, custom_days, day_split)

---

## Split Types & Programs
- **PPL** — Push/Pull/Leg (3 days)
- **Upper/Lower** — Upper/Lower (4 days)
- **Full Body** — Everything each session (3 days)
- **Bro Split** — One muscle group per day (5 days)
- **PPLUL** — Push/Pull/Leg/Upper/Lower (5 days, advanced)
- **Custom** — User-named training days
- **Day Split** — Assign exercises by day of week (Mon–Sun)

Each split has `sections` array defining the training categories for that program.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/pages/Home.jsx` | Today's workout view with CategorySection + Cardio + Cheat |
| `src/pages/Progress.jsx` | Stats/analytics page with new charts & insights |
| `src/pages/ExerciseDetail.jsx` | Exercise history, charts, personal bests |
| `src/components/CategorySection.jsx` | Exercise list with inline expand form |
| `src/components/ExerciseInlineForm.jsx` | Inline log form (last session, suggestions, target, sets) |
| `src/components/CardioSection.jsx` | Cardio logging (inline, like exercises now mirror this) |
| `src/lib/statsQueries.js` | Data aggregation for Progress page |
| `src/lib/statsInsights.js` | Insight message generation |
| `src/index.css` | Theme variables, animations, Tailwind overrides |

---

## Next Steps / Known Limitations
- Charts are custom SVG (scalable, lightweight, but limited interactivity)
- No offline mode yet (could use local SQLite cache)
- No workout templates or pre-built programs
- Personal records tracking is basic (only max weight/best set)
- No social features or sharing

---

## Git Commits Reference
- `2cd25a0` — Stats page redesign (8 files changed, 666 insertions)
- `b5ac476` — Exercise logging inline UX redesign (3 files, 360 insertions)
