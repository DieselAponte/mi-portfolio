export type Project = {
	id: string | number;
	title: string;
	description: string;
	date: string;
	tech_stack: string[];
	github_url: string;
	image_url: string;
};

export type ProjectFilter =
	| "frontend"
	| "backend"
	| "infrastructure"
	| "mobile";
