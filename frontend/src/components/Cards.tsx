import React from 'react';

// cards (sm, md, lg)
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

export const MediumCard: React.FC<CardProps> = ({
	title,
	bg_transparent = false,
	children,
}) => {
	const bg = bg_transparent
		? 'bg-transparent border-white'
		: 'bg-slate-100/5 border-black/10';
	return (
		<>
			<div
				className={`rounded-xl border shadow-lg shadow-slate-800 ${bg} m-3 size-auto overflow-x-hidden overflow-y-scroll p-3 hover:border-x-4 hover:border-b-8 hover:border-slate-800 hover:shadow-2xl hover:shadow-black md:h-[35rem] lg:w-96`}>
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
