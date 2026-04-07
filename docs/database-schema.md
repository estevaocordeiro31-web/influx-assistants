# Database Schema for Educational Platforms

## Core Tables

### quiz_results
Stores individual quiz attempt records with scoring and point information.

```sql
CREATE TABLE quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  video_id VARCHAR(100) NOT NULL,
  video_title VARCHAR(255) NOT NULL,
  score INT NOT NULL,              -- 0-100 percentage
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  passed BOOLEAN NOT NULL,         -- true if score >= 70%
  points_earned INT NOT NULL,      -- 10 points if passed
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
```

**Purpose**: Track every quiz attempt with detailed scoring metrics
**Indexes**: `student_id`, `video_id` for fast queries

### leaderboard
Maintains current ranking and aggregate statistics per student.

```sql
CREATE TABLE leaderboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL UNIQUE,
  student_name VARCHAR(255) NOT NULL,
  total_points INT DEFAULT 0 NOT NULL,
  quizzes_completed INT DEFAULT 0 NOT NULL,
  lessons_completed INT DEFAULT 0 NOT NULL,
  rank INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
```

**Purpose**: Fast leaderboard queries without aggregating quiz_results
**Indexes**: `total_points DESC` for ranking queries
**Updates**: Automatically updated when quiz_results are inserted

### points_history
Audit log for all point transactions.

```sql
CREATE TABLE points_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  points INT NOT NULL,
  reason VARCHAR(255) NOT NULL,   -- "quiz_completed", "lesson_completed", etc
  related_id INT,                 -- ID of quiz or lesson
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id)
);
```

**Purpose**: Audit trail for gamification system
**Indexes**: `student_id` for history queries

## Scoring System

- **Quiz Passing Score**: 70% minimum
- **Points Awarded**: 10 points per passed quiz
- **Point Reasons**: "quiz_completed", "lesson_completed", "badge_earned"

## Leaderboard Updates

The leaderboard is updated in real-time when:
1. Quiz result is saved
2. Points are awarded
3. New lesson is completed

Rank is recalculated after each point transaction to maintain accuracy.

## Query Patterns

### Get Top 10 Students
```sql
SELECT * FROM leaderboard 
ORDER BY total_points DESC 
LIMIT 10;
```

### Get Student Rank
```sql
SELECT * FROM leaderboard 
WHERE student_id = ?;
```

### Get Points History
```sql
SELECT * FROM points_history 
WHERE student_id = ? 
ORDER BY created_at DESC;
```

### Get Quiz Results
```sql
SELECT * FROM quiz_results 
WHERE student_id = ? 
ORDER BY created_at DESC;
```
