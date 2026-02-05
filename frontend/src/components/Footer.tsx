import { Footer } from 'flowbite-react';
import React from 'react';
import { BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';

const WebFooter: React.FC = () => {
	return (
		<>
			<Footer bgDark container id="web-footer">
				<div className="w-full">
					<div className="grid w-full grid-cols-1 justify-items-center gap-8 px-6 py-8 md:grid-cols-4">
						<div>
							<Footer.Title title="Home Page" />
							<Footer.LinkGroup>
								<Footer.Link href="/">Home</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Experience" />
							<Footer.LinkGroup col>
								<Footer.Link href="/education">
									Education
								</Footer.Link>
								<Footer.Link href="/experience">
									Experience
								</Footer.Link>
								<Footer.Link href="/showcase">
									Showcase
								</Footer.Link>
								<Footer.Link href="/projects">
									Projects
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Miscellaneous" />
							<Footer.LinkGroup col>
								<Footer.Link href="/blog">Blog</Footer.Link>
								<Footer.Link href="/contact">
									Contact Me
								</Footer.Link>
								<Footer.Link href="/about">
									About Me
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title="Admin" />
							<Footer.LinkGroup>
								<Footer.Link href="/login">
									Administrator Login
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
					<div className="w-full bg-gray-700 px-4 py-6 sm:flex sm:items-center sm:justify-between">
						<Footer.Copyright
							by="Sergio Ley Languren"
							href="#"
							year={2024}
						/>
						<div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
							<Footer.Icon
								href="https://www.linkedin.com/in/sergioley"
								icon={BsLinkedin}
							/>
							<Footer.Icon
								href="https://github.com/SLey3"
								icon={BsGithub}
							/>
							<Footer.Icon
								href="https://www.instagram.com/sergioley3/"
								icon={BsInstagram}
							/>
						</div>
					</div>
				</div>
			</Footer>
		</>
	);
};

export default WebFooter;
