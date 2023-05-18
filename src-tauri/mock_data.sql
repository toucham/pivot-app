PRAGMA foreign_keys=ON;

INSERT OR IGNORE INTO activity(id, name, desc, rank, icon, time_ms, last_updated)
VALUES 
(1, 'Workout', 'This is a workout timer tracker', 1, 128512, 360000, date('now')),
(2, 'Project', 'for tracking working on project', 2, 127939, 10000, date('now', 'start of month')),
(3, 'Homework', 'for tracking on doing homework', 3, 128218, 25000, date('now')),
(4, 'Gaming', NULL, 4, 127918, 360000, date('now')),
(5, 'Reading', NULL, 5, 128512, 360000, date('now', 'start of year'));

INSERT OR IGNORE INTO progress(time_ms, type, activity_id)
VALUES 
(10800000, 0, 1),
(10800000, 0, 2),
(3600000, 1, 4);

INSERT OR IGNORE INTO timer(activity_id, start_date, end_date)
VALUES
(2, '2023-05-17T17:30:00.000Z', '2023-05-17T18:00:00.000Z'),
(3, '2023-05-17T16:30:00.000Z', '2023-05-17T18:00:00.000Z'),
(1, '2023-05-17T10:00:00.000Z', '2023-05-17T12:00:00.000Z'),
(1, '2023-05-16T10:00:00.000Z', '2023-05-17T12:00:00.000Z'),
(1, '2023-05-14T10:00:00.000Z', '2023-05-17T12:00:00.000Z');

SELECT * from activity;

SELECT * from progress;

SELECT * from timer;
