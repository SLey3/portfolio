import React from 'react';
import { useLocation } from 'react-router-dom';

import WebFooter from '@/components/Footer';
import NavBar from '@/components/NavBar';

const Http404: React.FC = () => {
	const location = useLocation();

	return (
		<>
			<NavBar />
			<div className="container mx-auto py-52">
				<div className="flex flex-col items-center gap-y-5">
					<h1 className="font-barlow text-9xl text-white xl:text-[12rem]">
						404
					</h1>
					<p className="max-w-40 text-wrap align-middle text-xl tracking-wide text-slate-200 max-sm:-translate-x-4 md:max-w-full">
						Path &quot;
						<span className="break-words">{location.pathname}</span>
						&quot; does not exists
					</p>
				</div>
			</div>
			<WebFooter />
		</>
	);
};

export default Http404;
