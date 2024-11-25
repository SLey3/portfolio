/* eslint-disable @typescript-eslint/no-empty-object-type */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TPlateEditor } from '@udecode/plate-common/react';
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
		logo_url: string;
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

	// admin
	interface LinkResultsProps {
		tablename: string;
		item_id: number;
		link: string;
		validity: boolean | string;
		http_code: number;
	}

	type ExecuteQueryResProps = {
		[key: string]: [value: any];
	};

	interface DraftBlogList
		extends Omit<Omit<Omit<BlogList, 'is_draft'>, 'content'>, 'author'> {}

	// forms
	interface NewsLetterCreateForm {
		title: string;
	}

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

	interface ExecuteQueryForm {
		query: string;
	}

	interface CertLicenseAddProps extends CertLicenseProps {}

	interface CourseAddProps extends CourseProps {}

	interface InstituteAddProps extends InstituteProps {
		grad_date?: string;
		expected_date?: string;
		awards?: string;
		major?: string;
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

	interface InstituteEditProps extends Partial<InstituteProps> {}
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

	interface MediumCardProps extends CardProps {
		longWidth?: boolean;
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
		editor: TPlateEditor;
		footerText?: string;
	}

	// protected component
	interface ProtectedComponentProps {
		fallbackUrl?: string;
		children: React.ReactNode;
	}

	// contents and blog viewer
	interface BlogList {
		author: string;
		content: string;
		created_at: string;
		id: number;
		desc: string;
		is_draft: boolean;
		title: string;
	}

	interface BlogViewerProps {
		content: string;
	}

	// utils
	type FormErrRes = {
		errors: { [key: string]: string[] };
	};

	// axios error types
	interface BaseReqError {
		error?: string;
	}

	interface NewsLetterUnSubReqError extends BaseReqError {
		expired?: string;
	}
}
