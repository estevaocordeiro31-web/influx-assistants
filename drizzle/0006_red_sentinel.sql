ALTER TABLE `student_profiles` ADD `study_duration_years` decimal(3,1);--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `study_duration_months` int;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `specific_goals` text;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `discomfort_areas` text;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `comfort_areas` text;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `english_consumption_sources` json;--> statement-breakpoint
ALTER TABLE `student_profiles` ADD `improvement_areas` text;