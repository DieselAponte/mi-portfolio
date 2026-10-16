export type Project = {
	id: string | number;
	title: string;
	description: string;
	date: string;
	tech_stack: string[];
	github_url: string;
	image_url: string;
	live_demo_url?: string;

	// Secciones detalladas (IndividualProjectDetail)
	problem_statement?: string;
	solution_statement?: string;
	target_users?: string[];
	value_proposition?: string;
	technical_decisions?: string;
	key_challenge?: string;
	challenges_faced?: string;
	measurable_results?: string;
	technical_learnings?: string;
	next_steps?: string;
};

export type ProjectFilter =
	| "frontend"
	| "backend"
	| "infrastructure"
	| "mobile";
