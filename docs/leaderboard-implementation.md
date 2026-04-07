# Leaderboard Implementation Guide

## Overview

This guide covers implementing a real-time leaderboard system with gamification for educational platforms. The system tracks student performance through quizzes, awards points, and maintains a live ranking.

## Architecture

### Components

1. **Backend (tRPC Router)**
   - `saveQuizResult` - Save quiz attempt and update leaderboard
   - `getLeaderboard` - Fetch top 10 students
   - `getStudentRank` - Get current student's rank
   - `getPointsHistory` - Audit trail of points
   - `getQuizResults` - Student's quiz history

2. **Frontend (React Component)**
   - LeaderboardWidget - Display top 10 with medal icons
   - Real-time rank display for current student
   - Loading states and empty states

3. **Database**
   - quiz_results - Individual quiz attempts
   - leaderboard - Aggregate student stats
   - points_history - Transaction audit log

## Implementation Steps

### Step 1: Setup Database Tables

Run the SQL setup script to create the three required tables:

```bash
# Using your database client
mysql < setup_leaderboard_tables.sql
```

Or execute the SQL directly through your database tool.

### Step 2: Create tRPC Router

Generate the leaderboard router:

```bash
python scripts/generate_leaderboard_router.py server/routers/quiz-leaderboard.ts
```

Then register it in your main router file:

```typescript
// server/routers.ts
import { quizLeaderboardRouter } from "./quiz-leaderboard";

export const appRouter = router({
  quizLeaderboard: quizLeaderboardRouter,
  // ... other routers
});
```

### Step 3: Create React Component

Generate the LeaderboardWidget component:

```bash
python scripts/generate_leaderboard_component.py client/src/components/LeaderboardWidget.tsx
```

### Step 4: Integrate into Dashboard

Add the component to your student dashboard:

```typescript
import { LeaderboardWidget } from "@/components/LeaderboardWidget";

export function StudentDashboard() {
  return (
    <div className="space-y-4">
      {/* Other dashboard content */}
      <LeaderboardWidget />
    </div>
  );
}
```

### Step 5: Connect Quiz System

When a quiz is completed, call `saveQuizResult`:

```typescript
const saveQuizMutation = trpc.quizLeaderboard.saveQuizResult.useMutation({
  onSuccess: (data) => {
    if (data.passed) {
      toast.success(`Parabéns! +${data.pointsEarned} pontos!`);
    }
  },
});

// In quiz completion handler
saveQuizMutation.mutate({
  videoId: "vp2-unit-1",
  videoTitle: "Vacation Plus 2 - Unit 1",
  score: 85,
  totalQuestions: 5,
  correctAnswers: 4,
});
```

## Customization

### Change Point Values

Edit the `saveQuizResult` mutation in the router:

```typescript
const pointsEarned = passed ? 10 : 0;  // Change 10 to desired value
```

### Change Passing Score

Edit the passing threshold:

```typescript
const passed = input.score >= 70;  // Change 70 to desired percentage
```

### Change Leaderboard Size

Edit the `getLeaderboard` query:

```typescript
.limit(10)  // Change 10 to desired number
```

### Add More Reward Reasons

Extend the `reason` field in points_history:

```typescript
reason: "quiz_completed" | "lesson_completed" | "badge_earned" | "streak_bonus"
```

## Performance Considerations

1. **Indexes**: The setup script creates indexes on frequently queried columns
2. **Leaderboard Cache**: Consider caching top 10 for 5-10 seconds
3. **Real-time Updates**: Use WebSocket or polling for live rank updates
4. **Batch Updates**: Update leaderboard ranks in batches during off-peak hours

## Monitoring

Track these metrics:

- Average quiz completion time
- Pass rate (% of quizzes scoring ≥70%)
- Points distribution (mean, median, std dev)
- Leaderboard churn (how often top 10 changes)

## Troubleshooting

### Leaderboard not updating

Check that `updateLeaderboardRanks()` is being called after quiz results are saved.

### Incorrect point calculations

Verify the passing score threshold and point values in the router.

### Performance issues

Add database indexes if queries are slow:

```sql
CREATE INDEX idx_leaderboard_points ON leaderboard(total_points DESC);
CREATE INDEX idx_quiz_results_student ON quiz_results(student_id);
```
