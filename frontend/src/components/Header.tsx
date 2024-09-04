import React from 'react';

const Header: React.FC<HeadersProps> = ({ title, desc = null }) => {
	return (
		<div className="mx-2 my-10 box-content space-y-4 border-l-4 border-slate-300/50 p-10">
			<h1 className="font-poppins text-2xl font-bold italic text-white lg:text-4xl">
				{title}
			</h1>
			{desc ? (
				<p className="text-balance indent-1 font-ibm-plex-serif leading-6 tracking-widest text-slate-300">
					{desc}
				</p>
			) : null}
		</div>
	);
};

export default Header;
