import { HR } from 'flowbite-react';
import React from 'react';

/**
 * A React functional component that renders a section with various layout and styling options.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.header - The header text to display at the top of the section.
 * @param {boolean} [props.col=false] - Determines if the section should use a column layout.
 * @param {boolean} [props.col_row_reverse=false] - Determines if the section should reverse the row or column layout.
 * @param {boolean} [props.ltr=true] - Determines if the text should be left-to-right. If false, text will be right-to-left.
 * @param {boolean} [props.center=false] - Determines if the content should be centered.
 * @param {boolean} [props.with_hr=false] - Determines if a horizontal rule should be displayed before and after the section.
 * @param {React.ReactNode} props.children - The content to be displayed within the section.
 *
 * @returns {JSX.Element} The rendered section component.
 */
const Section: React.FC<SectionProps> = ({
	header,
	col = false,
	col_row_reverse = false,
	ltr = true,
	center = false,
	with_hr = false,
	children,
}) => {
	let positioning = col
		? col_row_reverse
			? 'flex-col-reverse '
			: 'flex-col '
		: col_row_reverse
			? 'flex-row-reverse max-sm:flex-col-reverse ' // mandatory for mobile devices to always use flex-col
			: 'flex-row max-sm:flex-col ';

	positioning +=
		(ltr || !ltr) && !center
			? 'justify-evenly max-sm:justify-center max-sm:items-center' // mandatory for mobile devices to always use justify-center items-center
			: 'justify-center items-center';

	const body_spacing = col
		? col_row_reverse
			? 'pb-4 my-2'
			: 'pt-4 my-2'
		: col_row_reverse
			? 'pl-4 m-2 max-sm:pb-4 max-sm:my-2' // mandatory for mobile devices to always use appropriate spacing
			: 'pr-4 m-2 max-sm:pt-4 max-sm:my-2';

	const text_align =
		(ltr || !ltr) && !center
			? ltr
				? 'text-left max-sm:text-center' // mandatory for mobile devices to always use text-center
				: 'text-right max-sm:text-center'
			: 'text-center';

	return (
		<>
			{with_hr ? <HR /> : null}
			<section
				className={`flex ${positioning} h-auto w-screen content-center p-10`}>
				{/* Header */}
				{header ? (
					<div>
						<h1 className="p-4 font-poppins text-4xl font-bold text-white">
							{header}
						</h1>
					</div>
				) : null}
				<div
					className={`${body_spacing} min-w-20 max-w-prose align-middle font-ibm-plex-serif text-lg font-light leading-7 tracking-wide text-slate-200 antialiased ${text_align}`}>
					{children}
				</div>
			</section>
			{with_hr ? <HR /> : null}
		</>
	);
};

export default Section;
