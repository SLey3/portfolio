import { cva } from 'class-variance-authority';
import { Edit2, LucideProps } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FaIndent, FaOutdent } from 'react-icons/fa6';
import {
	LuAlignCenter,
	LuAlignJustify,
	LuAlignLeft,
	LuAlignRight,
	LuBaseline,
	LuBold,
	LuCheck,
	LuChevronDown,
	LuChevronRight,
	LuChevronsUpDown,
	LuCode,
	LuColumns2,
	LuColumns3,
	LuCombine,
	LuExternalLink,
	LuEye,
	LuFileCode,
	LuFilm,
	LuGripVertical,
	LuHeading1,
	LuHeading2,
	LuHeading3,
	LuHeading4,
	LuHeading5,
	LuHeading6,
	LuImage,
	LuItalic,
	LuKeyboard,
	LuLink2,
	LuLink2Off,
	LuList,
	LuListOrdered,
	LuMessageSquare,
	LuMessageSquarePlus,
	LuMinus,
	LuMoon,
	LuPaintBucket,
	LuPaintbrush,
	LuPilcrow,
	LuPlus,
	LuQuote,
	LuRectangleHorizontal,
	LuRectangleVertical,
	LuRotateCcw,
	LuSearch,
	LuSettings,
	LuSmile,
	LuStrikethrough,
	LuSubscript,
	LuSunMedium,
	LuSuperscript,
	LuTable,
	LuText,
	LuTrash,
	LuTwitter,
	LuUnderline,
	LuUngroup,
	LuWrapText,
	LuX,
} from 'react-icons/lu';
import { MdMoreHoriz } from 'react-icons/md';

export type Icon = LucideIcon;

const borderAll = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6zm10 13h5a1 1 0 0 0 1-1v-5h-6v6zm-2-6H5v5a1 1 0 0 0 1 1h5v-6zm2-2h6V6a1 1 0 0 0-1-1h-5v6zm-2-6H6a1 1 0 0 0-1 1v5h6V5z" />
	</svg>
);

const borderBottom = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M13 5a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2h2zm-8 6a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2zm-2 7a1 1 0 1 1 2 0 1 1 0 0 0 1 1h12a1 1 0 0 0 1-1 1 1 0 1 1 2 0 3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm17-8a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1zM7 4a1 1 0 0 0-1-1 3 3 0 0 0-3 3 1 1 0 0 0 2 0 1 1 0 0 1 1-1 1 1 0 0 0 1-1zm11-1a1 1 0 1 0 0 2 1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3z" />
	</svg>
);

const borderLeft = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M6 21a1 1 0 1 0 0-2 1 1 0 0 1-1-1V6a1 1 0 0 1 1-1 1 1 0 0 0 0-2 3 3 0 0 0-3 3v12a3 3 0 0 0 3 3zm7-16a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2h2zm6 6a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-5 9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm4-17a1 1 0 1 0 0 2 1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3zm-1 17a1 1 0 0 0 1 1 3 3 0 0 0 3-3 1 1 0 1 0-2 0 1 1 0 0 1-1 1 1 1 0 0 0-1 1z" />
	</svg>
);

const borderNone = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M14 4a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm-9 7a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2zm14 0a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6 10a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2h2zM7 4a1 1 0 0 0-1-1 3 3 0 0 0-3 3 1 1 0 0 0 2 0 1 1 0 0 1 1-1 1 1 0 0 0 1-1zm11-1a1 1 0 1 0 0 2 1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3zM7 20a1 1 0 0 1-1 1 3 3 0 0 1-3-3 1 1 0 1 1 2 0 1 1 0 0 0 1 1 1 1 0 0 1 1 1zm11 1a1 1 0 1 1 0-2 1 1 0 0 0 1-1 1 1 0 1 1 2 0 3 3 0 0 1-3 3z" />
	</svg>
);

const borderRight = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M13 5a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2h2zm-8 6a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2zm9 9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM6 3a1 1 0 0 1 0 2 1 1 0 0 0-1 1 1 1 0 0 1-2 0 3 3 0 0 1 3-3zm1 17a1 1 0 0 1-1 1 3 3 0 0 1-3-3 1 1 0 1 1 2 0 1 1 0 0 0 1 1 1 1 0 0 1 1 1zm11 1a1 1 0 1 1 0-2 1 1 0 0 0 1-1V6a1 1 0 0 0-1-1 1 1 0 1 1 0-2 3 3 0 0 1 3 3v12a3 3 0 0 1-3 3z" />
	</svg>
);

const borderTop = (props: LucideProps) => (
	<svg
		fill="currentColor"
		focusable="false"
		height="48"
		role="img"
		viewBox="0 0 24 24"
		width="48"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path d="M3 6a1 1 0 0 0 2 0 1 1 0 0 1 1-1h12a1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3zm2 5a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2zm14 0a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-5 9a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm-8 1a1 1 0 1 0 0-2 1 1 0 0 1-1-1 1 1 0 1 0-2 0 3 3 0 0 0 3 3zm11-1a1 1 0 0 0 1 1 3 3 0 0 0 3-3 1 1 0 1 0-2 0 1 1 0 0 1-1 1 1 1 0 0 0-1 1z" />
	</svg>
);

const rightSideDoubleColumn = (props: LucideProps) => (
	<svg
		fill="none"
		height="16"
		viewBox="0 0 16 16"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path
			clipRule="evenodd"
			d="M11.25 3H13V13H11.25V3ZM10.25 2H11.25H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H11.25H10.25H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H10.25ZM10.25 13H3L3 3H10.25V13Z"
			fill="#595E6F"
			fillRule="evenodd"></path>
	</svg>
);

const leftSideDoubleColumn = (props: LucideProps) => (
	<svg
		fill="none"
		height="16"
		viewBox="0 0 16 16"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path
			clipRule="evenodd"
			d="M5.75 3H13V13H5.75V3ZM4.75 2H5.75H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H5.75H4.75H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H4.75ZM4.75 13H3L3 3H4.75V13Z"
			fill="#595E6F"
			fillRule="evenodd"></path>
	</svg>
);

const doubleSideDoubleColumn = (props: LucideProps) => (
	<svg
		fill="none"
		height="16"
		viewBox="0 0 16 16"
		width="16"
		xmlns="http://www.w3.org/2000/svg"
		{...props}>
		<path
			clipRule="evenodd"
			d="M10.25 3H5.75V13H10.25V3ZM10.25 2H5.75H4.75H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H4.75H5.75H10.25H11.25H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2H11.25H10.25ZM11.25 3V13H13V3H11.25ZM3 13H4.75V3H3L3 13Z"
			fill="#595E6F"
			fillRule="evenodd"></path>
	</svg>
);

export const Icons = {
	add: LuPlus,
	alignCenter: LuAlignCenter,
	alignJustify: LuAlignJustify,
	alignLeft: LuAlignLeft,
	alignRight: LuAlignRight,
	arrowDown: LuChevronDown,
	bg: LuPaintBucket,
	blockquote: LuQuote,
	bold: LuBold,
	borderAll,
	borderBottom,
	borderLeft,
	borderNone,
	borderRight,
	borderTop,
	check: LuCheck,
	chevronRight: LuChevronRight,
	chevronDown: LuChevronDown,
	chevronsUpDown: LuChevronsUpDown,
	clear: LuX,
	close: LuX,
	code: LuCode,
	codeblock: LuFileCode,
	color: LuBaseline,
	column: LuRectangleVertical,
	combine: LuCombine,
	ungroup: LuUngroup,
	comment: LuMessageSquare,
	commentAdd: LuMessageSquarePlus,
	delete: LuTrash,
	dragHandle: LuGripVertical,
	editing: Edit2,
	emoji: LuSmile,
	externalLink: LuExternalLink,
	h1: LuHeading1,
	h2: LuHeading2,
	h3: LuHeading3,
	h4: LuHeading4,
	h5: LuHeading5,
	h6: LuHeading6,
	image: LuImage,
	indent: FaIndent,
	italic: LuItalic,
	kbd: LuKeyboard,
	lineHeight: LuWrapText,
	link: LuLink2,
	minus: LuMinus,
	more: MdMoreHoriz,
	ol: LuListOrdered,
	outdent: FaOutdent,
	paragraph: LuPilcrow,
	refresh: LuRotateCcw,
	row: LuRectangleHorizontal,
	search: LuSearch,
	settings: LuSettings,
	strikethrough: LuStrikethrough,
	subscript: LuSubscript,
	superscript: LuSuperscript,
	table: LuTable,
	text: LuText,
	trash: LuTrash,
	ul: LuList,
	underline: LuUnderline,
	unlink: LuLink2Off,
	viewing: LuEye,
	doubleColumn: LuColumns2,
	threeColumn: LuColumns3,
	rightSideDoubleColumn: rightSideDoubleColumn,
	leftSideDoubleColumn: leftSideDoubleColumn,
	doubleSideDoubleColumn: doubleSideDoubleColumn,
	excalidraw: LuPaintbrush,
	embed: LuFilm,
	// www
	gitHub: (props: LucideProps) => (
		<svg viewBox="0 0 438.549 438.549" {...props}>
			<path
				d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
				fill="currentColor"></path>
		</svg>
	),
	logo: (props: LucideProps) => (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
				fill="currentColor"
			/>
		</svg>
	),
	moon: LuMoon,
	sun: LuSunMedium,
	twitter: LuTwitter,
};

export const iconVariants = cva('', {
	variants: {
		variant: {
			toolbar: 'size-5',
			menuItem: 'mr-2 size-5',
		},
		size: {
			sm: 'mr-2 size-4',
			md: 'mr-2 size-6',
		},
	},
	defaultVariants: {},
});
