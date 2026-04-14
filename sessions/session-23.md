# Session 23 — Automated Event Notifications

## Dependencies
Session 22 (subscriptions)

## Branch
`session/23-automated-notifications`

## Goal
Build background job / scheduled task system for automated event notifications: voting start alerts, voting end approaching reminders, and results announcements.

## Tasks
- Set up a lightweight job scheduling approach. Options:
  - Use Railway's cron jobs feature
  - Or build a simple polling worker in the API that runs on an interval
  - Or use pg-boss (PostgreSQL-backed job queue) for more robustness
  - Recommended: pg-boss for production reliability, simple interval for MVP
- Install job queue package if using pg-boss: `npm install pg-boss`
- Create `apps/api/src/lib/jobs.ts`:
  - Job queue setup and connection
  - Define job types: `voting-start-notification`, `voting-end-reminder`, `results-notification`
  - Exports for scheduling and processing jobs
- Create `apps/api/src/jobs/` directory with:
  - `voting-start.ts` — when an event's votingStart time passes, send a message to all registrants that voting is now open
  - `voting-end-reminder.ts` — send a reminder when voting end is approaching (configurable: 30 min, 15 min before)
  - `results-announcement.ts` — when results are calculated, send a notification to all registrants with results summary
- Schedule jobs:
  - On event creation / update, schedule the notification jobs based on votingStart/votingEnd times
  - If votingStart/votingEnd are updated, reschedule the jobs
- Use the messaging system (session 21) to create event messages for these notifications
- Also send emails to registrants who have email addresses via the email service (session 22)
- Start job worker in the API process (or as a separate service if preferred)

## Files to Create/Modify
Create:
- `apps/api/src/lib/jobs.ts`
- `apps/api/src/jobs/voting-start.ts`
- `apps/api/src/jobs/voting-end-reminder.ts`
- `apps/api/src/jobs/results-announcement.ts`

Modify:
- `apps/api/src/index.ts` (start job worker)
- `apps/api/src/routes/events.ts` (schedule jobs on create/update)
- `apps/api/package.json`

## Acceptance Criteria
- Job scheduling system works
- Voting start notification fires at the correct time
- Voting end reminder fires before voting ends
- Results notification fires when results are calculated
- Jobs are rescheduled when event times change
- Notifications create event messages AND send emails
