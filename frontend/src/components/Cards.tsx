import React from 'react';

// cards (sm, md, lg)
/**
 * A small card component that displays a title and an optional icon.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title to be displayed on the card.
 * @param {boolean} [props.bg_transparent=false] - Determines if the background should be transparent.
 * @param {React.ReactNode} [props.icon=null] - An optional icon to be displayed on the card.
 *
 * @returns {JSX.Element} The rendered small card component.
 */
export const SmallCard: React.FC<SmallCardProps> = ({
	title,
	bg_transparent = false,
	icon = null,
}) => {
	const bg = bg_transparent
		? 'bg-transparent border-white'
		: 'bg-slate-100/5 border-black/10';
	return (
		<>
			<div
				className={`rounded-xl border shadow-lg shadow-slate-800 ${bg} m-3 h-16 w-52 overflow-hidden p-3 hover:border-x-4 hover:border-b-8 hover:border-slate-800 hover:shadow-2xl hover:shadow-cyan-600`}>
				<div className="flex flex-row content-center justify-stretch gap-x-4 py-1">
					{icon ? (
						<div className="py-1 pl-4 text-[1.4rem]">{icon}</div>
					) : null}
					<div>
						<h3 className="font-poppins text-lg font-bold text-white">
							{title}
						</h3>
					</div>
				</div>
			</div>
		</>
	);
};

/**
 * A React functional component that renders a medium-sized card with customizable background,
 * width, title, and children content.
 *
 * @param {MediumCardProps} props - The properties object.
 * @param {string} props.title - The title to be displayed on the card.
 * @param {boolean} [props.bg_transparent=false] - Determines if the card background should be transparent.
 * @param {boolean} [props.longWidth=false] - Determines if the card should have a longer width.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 *
 * @returns {JSX.Element} The rendered medium card component.
 */
export const MediumCard: React.FC<MediumCardProps> = ({
	title,
	bg_transparent = false,
	longWidth = false,
	children,
}) => {
	const bg = bg_transparent
		? 'bg-transparent border-white'
		: 'bg-slate-100/5 border-black/10';

	const width = longWidth ? 'lg:w-[45vw]' : 'lg:w-96';
	return (
		<>
			<div
				className={`rounded-xl border shadow-lg shadow-slate-800 ${bg} m-3 size-auto overflow-x-hidden overflow-y-scroll p-3 hover:border-x-4 hover:border-b-8 hover:border-slate-800 hover:shadow-2xl hover:shadow-black md:h-[35rem] ${width}`}>
				<div className="flex flex-col content-center items-center justify-center gap-y-2">
					{title ? (
						<div>
							<h2 className="mx-5 mt-10 font-poppins text-4xl font-bold tracking-wider text-white">
								{title}
							</h2>
						</div>
					) : null}
					<div className="text-wrap px-3 font-ibm-plex-serif text-lg leading-snug tracking-tight text-slate-100">
						{children}
					</div>
				</div>
			</div>
		</>
	);
};

/**
 * A large card component that displays a title and children content.
 *
 * @param {LargeCardProps} props - The properties for the LargeCard component.
 * @param {string} props.title - The title to display at the top of the card.
 * @param {boolean} [props.bg_transparent=false] - Whether the background should be transparent.
 * @param {boolean} [props.center=true] - Whether the content should be centered.
 * @param {React.ReactNode} props.children - The content to display inside the card.
 *
 * @returns {JSX.Element} The rendered LargeCard component.
 */
export const LargeCard: React.FC<LargeCardProps> = ({
	title,
	bg_transparent = false,
	center = true,
	children,
}) => {
	const bg = bg_transparent
		? 'bg-transparent border-white'
		: 'bg-slate-100/5 border-black/10';
	return (
		<>
			<div
				className={`rounded-xl border shadow-lg shadow-slate-800 ${bg} m-3 size-auto overflow-x-hidden overflow-y-scroll p-3 lg:w-[55rem] xl:w-[65rem]`}>
				<div
					className={`flex flex-col gap-y-8 ${center ? 'items-center' : 'items-start'} content-center`}>
					{title ? (
						<div>
							<h3 className="font-poppins text-4xl font-bold text-white">
								{title}
							</h3>
						</div>
					) : null}
					<div className="text-wrap px-3 font-ibm-plex-serif text-base leading-loose tracking-tight text-slate-100">
						{children}
					</div>
				</div>
			</div>
		</>
	);
};
