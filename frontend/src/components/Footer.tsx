import axios from 'axios';
import { Button, Footer, TextInput } from 'flowbite-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { HiOutlineArrowRight } from 'react-icons/hi';

const WebFooter: React.FC = () => {
	const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
	const { register, handleSubmit } = useForm<NewsLetterInput>();

	const onSubmit: SubmitHandler<NewsLetterInput> = (data) => {
		axios
			.post('/api/newsletter/subscribe', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(() => {
				setSubscriptionSuccess(true);
			})
			.catch(() => {
				return;
			});
	};

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
						<div className="col-span-1 md:col-span-4">
							{/* eslint-disable-next-line @typescript-eslint/no-misused-promises -- reason being that this is the normal method to apply handleSubmit per react-hook-forms */}
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="flex flex-col items-center gap-y-4">
									<div className="flex flex-row items-center justify-center gap-x-3">
										<TextInput
											className="w-32"
											placeholder="johndoe@example.com"
											shadow
											sizing="sm"
											type="text"
											{...register('email', {
												required:
													'Field cannot be empty!',
											})}
											color={
												subscriptionSuccess
													? 'success'
													: 'gray'
											}
											disabled={
												subscriptionSuccess
													? true
													: false
											}
											helperText={
												<>
													<p className="font-cormorant-garamond">
														{subscriptionSuccess
															? 'Subscription activated! Thank you for subscribing to the newsletter'
															: null}
													</p>
												</>
											}
										/>
										<Button
											className={`${subscriptionSuccess ? 'hidden' : 'block'} select-none`}
											gradientMonochrome="cyan"
											pill
											type="submit">
											Sign Up
											<HiOutlineArrowRight className="h-11 translate-x-1 md:h-5" />
										</Button>
									</div>
									<p className="mt-2 w-64 select-none text-center font-cormorant-garamond text-xs font-light leading-tight tracking-tight text-slate-400 antialiased">
										Stay updated on my professional
										activities, including new projects,
										releases, internships, and blog posts,
										by subscribing to my newsletter.
										It&apos;s also a great way to provide
										feedback and stay connected.
									</p>
								</div>
							</form>
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
