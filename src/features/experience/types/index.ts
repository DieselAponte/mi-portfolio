export type TrajectoryStatus = "COMPLETED" | "IN PROGRESS" | "ACTIVE";

export function mapProjectStatusToTrajectory(status?: string): TrajectoryStatus {
	if (!status) return "IN PROGRESS";
	const s = status.trim().toLowerCase();
	if (s.includes("terminado") || s.includes("completed")) {
		return "COMPLETED";
	}
	if (s.includes("activo") || s.includes("active")) {
		return "ACTIVE";
	}
	return "IN PROGRESS";
}

export interface TrajectoryPanelData {
	id: string | number;
	title: string;
	subtitle: string;
	status: TrajectoryStatus;
}

export interface TrajectorySectionData extends TrajectoryPanelData {
	eyebrow: string;
	heading: string;
	summary: string;
	highlights: string[];
}

export interface TechBubble {
	id: string | number;
	label: string;
	top: string;
	right: string;
	delay: string;
	duration: string;
}

export interface ExperienceSlide {
	id: string | number;
	role: string;
	organization: string;
	timeframe: string;
	summary: string;
	tags: string[];
}

export interface ExperienceCertification {
	id: string | number;
	title: string;
	meta: string;
	url?: string;
	order_index: number;
}

export interface ExperienceCarouselItem {
	id: string | number;
	title: string;
	subtitle: string;
	image_path: string;
	order_index: number;
}

// =============================================================================
// Trayectoria — New Data Model (NivelPublicacion)
// =============================================================================

export enum PublicationType {
	EDUCATION = "EDUCATION",
	PROJECT = "PROJECT",
	EXPERIENCE = "EXPERIENCE",
}

export enum ProjectStatus {
	DESIGN = "En etapa de Diseño",
	DEVELOPMENT = "En desarrollo",
	COMPLETED = "Terminado",
}

export interface Technology {
	id: string | number;
	name: string;
	icon?: string;
	sector: string;
	is_predefined: boolean;
}

export interface Topic {
	id: string | number;
	name: string;
	is_predefined: boolean;
}

export interface NivelPublicacion {
	id: string | number;
	title: string;
	description: string;
	image_path: string;
	image_description: string;
	type: PublicationType;
	order_index: number;
	technologies?: Technology[];
	topics?: Topic[];
}

export interface EducationDetails {
	id?: string | number;
	publicacion_id?: string | number;
	institution: string;
	obtained_date: string;
	skills_learned: string[];
}

export interface ProjectDetails {
	id?: string | number;
	publicacion_id?: string | number;
	why_i_built_this: string;
	how_it_works: string;
	what_i_learned: string[];
	url_repository: string;
	status: ProjectStatus;
}

export interface ProfessionalExpDetails {
	id?: string | number;
	publicacion_id?: string | number;
	company: string;
}

export interface PublicationResponsibility {
	id?: string | number;
	publicacion_id?: string | number;
	content: string;
	order_index: number;
}

export interface PublicationAchievement {
	id?: string | number;
	publicacion_id?: string | number;
	content: string;
	order_index: number;
}

// Full publication types (base + details + relations)
export interface EducationPublication extends NivelPublicacion {
	type: PublicationType.EDUCATION;
	details: EducationDetails;
}

export interface ProjectPublication extends NivelPublicacion {
	type: PublicationType.PROJECT;
	details: ProjectDetails;
}

export interface ExperiencePublication extends NivelPublicacion {
	type: PublicationType.EXPERIENCE;
	details: ProfessionalExpDetails;
	responsibilities: PublicationResponsibility[];
	achievements: PublicationAchievement[];
}

export type FullPublication =
	| EducationPublication
	| ProjectPublication
	| ExperiencePublication;
