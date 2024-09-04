import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import { GetAssetsUrl } from '@/utils';
import React from 'react';

const AboutMe: React.FC = () => {
	return (
		<>
			<NavBar />
			<div className="container">
				<Header title="About Me" />
				<div className="px-4 py-10">
					<img
						alt="Portfolio Self"
						className="aspect-square size-full px-10 pl-6 md:float-left md:size-1/3"
						src={GetAssetsUrl('portfolio-self.jpeg')}
					/>
					<div className="pb-16">
						<p className="text-balance pt-10 font-ibm-plex-serif font-light leading-7 tracking-widest text-slate-100 subpixel-antialiased">
							I am a student at Willamette University pursuing a
							<span className="text-nowrap pl-1 font-bold hover:cursor-pointer hover:text-cyan-300">
								<a
									href="https://willamette.edu/undergraduate/computer-science/index.html"
									rel="noreferrer"
									target="_blank">
									Computer Science (B.S.) Degree
								</a>
							</span>
							. I enjoy the outdoors and aviation.
							<div className="py-4"></div>
							I&apos;ve been interested in how a website is built
							since my senior year in high school. My interest
							began to further increase in my sophomore year in
							university when I took two web development related
							courses which showed some of the intricacies and
							tools that powered and built websites.
							<div className="py-4"></div>
							I&apos;m currently seeking internship opportunities,
							especially in Software Engineering, where I can
							apply my knowledge, gain hands-on experience, and
							contribute to impactful projects. If you&apos;re
							looking for a driven and curious developer who loves
							tackling challenges and working with teams,
							<span className="pl-2 italic text-cyan-200 hover:cursor-pointer hover:text-cyan-300">
								<a
									href={`${window.location.protocol}//${window.location.host}/contact`}>
									I&apos;d love to connect!
								</a>
							</span>
						</p>
					</div>
				</div>
			</div>
			<WebFooter />
		</>
	);
};

export default AboutMe;
