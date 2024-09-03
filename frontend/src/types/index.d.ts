/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Value } from '@udecode/plate-common';
import React from 'react';

declare module '@/components/plate-ui/*';

declare global {
	// education
	interface CourseProps {
		id: number;
		course_name: string;
		course_id: string;
		course_url: string;
		associated_institute: string;
		desc: string;
	}

	interface InstituteProps {
		id: number;
		name: string;
		start_date: string;
		grad_date: string;
		expected_date: string;
		institute_type: string;
		awards: string;
		major: string;
		degree: string;
		logo_path: string;
		logo_file: string;
		institute_url: string;
		small_desc: string;
		created_at: string;
	}

	// projects
	interface ProjectProps {
		id: number;
		name: string;
		start_date: string;
		end_date: string;
		desc: string;
		skills: string | string[];
		project_repo_url: string;
		project_url?: string;
	}

	// showcase
	interface ShowcaseProps {
		id: number;
		project_posts: ProjectProps[];
	}

	// experience
	interface ExperienceProps {
		id: number;
		name: string;
		type: string;
		position: string;
		start_date: string;
		end_date: string;
		desc: string;
	}
	interface CertLicenseProps {
		id: number;
		name: string;
		issuing_org: string;
		issue_date: string;
		issue_exp?: string;
		credential_id?: string;
		credential_url: string;
	}

	// forms
	interface LoginForm {
		email: string;
		password: string;
	}

	interface ContactForm {
		name: string;
		email: string;
		contact_type: string;
		msg_subject: string;
		msg_body: string;
	}

	interface CertLicenseAddProps extends CertLicenseProps {}

	interface CourseAddProps extends CourseProps {}

	interface InstituteAddProps extends Omit<InstituteProps, 'logo_file'> {
		expected_date?: string;
		awards?: string;
		major?: string;
		logo_path: File | string;
	}

	interface ProjectsAddProps extends ProjectProps {
		end_date?: string;
		skills: string;
	}

	interface ShowcaseAddProps {
		project_name: string;
	}

	interface ExperienceAddProps extends ExperienceProps {
		end_date?: string;
	}

	interface BlogAddFormProps {
		title: string;
		desc: string;
	}

	interface CertLicenseEditProps extends Partial<CertLicenseProps> {}

	interface CourseEditProps extends Partial<CourseProps> {}

	interface InstituteEditProps
		extends Partial<Omit<InstituteProps, 'logo_file'>> {
		logo_path?: File | string;
	}
	interface ProjectEditProps extends Partial<ProjectProps> {
		skills?: string;
	}

	interface ExperienceEditProps extends Partial<ExperienceProps> {}

	interface BlogEditProps extends Partial<BlogAddFormProps> {
		is_draft?: boolean;
	}

	interface FormProps {
		visibility: boolean;
		setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
	}

	interface EditFormProps<T> extends FormProps {
		formInfo: T;
	}

	// cards
	interface CardProps {
		title: string | boolean; // title is optional either a string or false (bool)
		bg_transparent?: boolean;
		children: React.ReactNode;
	}

	interface SmallCardProps extends Omit<CardProps, 'children'> {
		title: string; // override title type as title is required for the small card
		icon?: React.ReactElement | null;
	}

	interface LargeCardProps extends CardProps {
		center?: boolean;
	}

	// footer
	interface NewsLetterInput {
		email: string;
	}

	// header
	interface HeadersProps {
		title: string;
		desc?: React.ReactNode | string;
	}

	// section
	interface SectionProps {
		header: string | boolean;
		col?: boolean;
		col_row_reverse?: boolean;
		ltr?: boolean;
		center?: boolean;
		with_hr?: boolean;
		children: React.ReactNode;
	}

	// main page
	interface MainNewsLetterInput {
		email: string;
	}

	// editor
	interface TextEditorProps {
		setContent: React.Dispatch<React.SetStateAction<Value>>;
		editValues?: Value;
	}

	// protected component
	interface ProtectedComponentProps {
		fallbackUrl?: string;
		children: React.ReactNode;
	}

	// contents and blog viewer
	interface BlogList {
		author: string;
		content: Value;
		created_at: string;
		id: number;
		desc: string;
		is_draft: boolean;
		title: string;
	}

	interface BlogViewerProps {
		content: Value;
	}

	// utils
	type FormErrRes = {
		errors: { [key: string]: string[] };
	};
}
