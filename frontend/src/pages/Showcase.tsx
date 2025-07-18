import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Carousel, HR } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CiSquarePlus } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ShowcaseAddForm from '@/components/forms/ShowcaseAddForm';

const Showcase: React.FC = () => {
	const [showcases, setShowcases] = useState<ShowcaseProps | null>(null);
	const [showcaseFormVis, setShowcaseFormVis] = useState(false);
	const [cookies] = useCookies(['user']);

	useEffect(() => {
		axios
			.get('/api/showcase')
			.then((res: AxiosResponse) => {
				setShowcases(res.data);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	}, []);

	const handleCarouselClick = (e: React.MouseEvent, entry: ProjectProps) => {
		e.preventDefault();

		window.location.href = entry.project_repo_url;
	};

	return (
		<>
			<ShowcaseAddForm
				setVisibility={setShowcaseFormVis}
				visibility={showcaseFormVis}
			/>
			<NavBar />
			<Header
				title="Showcase"
				desc="A curated list of projects that can be best described as
						not only as a showcase of my best work but of my
						progression as a developer thru making those type of
						projects to stand out over others."
			/>

			<div className="space-y-16">
				{cookies.user ? (
					<Button
						className="md:translate-x-4"
						gradientMonochrome="cyan"
						onClick={() => setShowcaseFormVis(true)}
						outline
						pill
						size="lg">
						Add Project to Showcase{' '}
						<CiSquarePlus className="size-6" />
					</Button>
				) : null}
				<div className="h-56 sm:h-64 xl:h-80">
					<Carousel pauseOnHover slideInterval={4500}>
						{showcases?.project_posts?.map((entry) => (
							<div
								className="flex h-full items-center justify-center bg-gradient-to-tl from-slate-700 from-50% to-slate-900 text-white"
								key={entry.id}>
								<div className="flex flex-col justify-start font-ibm-plex-serif">
									<div
										className="cursor-pointer font-poppins text-xl hover:text-cyan-300"
										onClick={(e) =>
											handleCarouselClick(e, entry)
										}>
										{entry.name}
									</div>
									<div className="text-gray-200">
										{entry.start_date} - {entry.end_date}
									</div>
									<HR.Icon />
									<div className="max-w-prose text-sm">
										{entry.desc}
									</div>
								</div>
							</div>
						))}
					</Carousel>
				</div>
				<div className="m-6 flex flex-row content-center justify-between p-3 lg:gap-x-96">
					<div>
						<Button as={Link} color="dark" pill to="/experience">
							Previous
						</Button>
					</div>
					<div>
						<Button as={Link} color="blue" pill to="/projects">
							Next
						</Button>
					</div>
				</div>
			</div>
			<WebFooter />
			<ToastContainer
				autoClose={5000}
				closeButton={false}
				closeOnClick={false}
				draggable={false}
				hideProgressBar={false}
				limit={1}
				newestOnTop={false}
				pauseOnFocusLoss={false}
				pauseOnHover={false}
				position="bottom-right"
				rtl={false}
				theme="dark"
				transition={Zoom}
			/>
		</>
	);
};

export default Showcase;
