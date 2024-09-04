import { MediumCard } from '@/components/Cards';
import WebFooter from '@/components/Footer';
import NavBar from '@/components/NavBar';
import Section from '@/components/section';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, TextInput } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiCarousel } from 'react-icons/bi';
import { FaPersonCircleExclamation } from 'react-icons/fa6';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { RiGraduationCapFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home: React.FC = () => {
	const typewriter_words: string[] = [
		'Full Stack Web Developer',
		'Frontend',
		'Backend',
		'SQL',
		'React.js',
		'Typescript / Javascript',
		'Python',
		'Flask',
	];

	const { register, handleSubmit } = useForm<MainNewsLetterInput>();

	const onSubmit: SubmitHandler<MainNewsLetterInput> = (data) => {
		axios
			.post('/api/newsletter/subscribe', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data?.success);
			})
			.catch((err: AxiosError) => {
				const res = err.response?.data as {
					errors: { [key: string]: string[] };
				};

				toast.error(res?.errors[0]);
			});
	};

	return (
		<>
			<NavBar />
			<div className="float-right mt-5 space-y-5 p-3 md:w-60 md:-translate-x-36 lg:-translate-x-64">
				<h1 className="text-balance font-poppins text-6xl text-white md:text-7xl lg:text-8xl">
					Welcome! I&apos;m Sergio Ley Languren
				</h1>
				<div className="text-wrap font-poppins text-3xl text-white md:text-[33px] lg:text-4xl">
					What I Do:
					<br />{' '}
					<span className="font-extrabold text-slate-300">
						<Typewriter
							cursor={true}
							cursorStyle={'_|'}
							delaySpeed={2500}
							loop={0}
							words={typewriter_words}
						/>
					</span>
				</div>
			</div>
			<div className="hidden w-full md:absolute md:right-44 md:top-1/4 md:clear-left md:block lg:right-32 xl:right-72">
				<div className="flex flex-col items-center gap-y-3">
					<div className="relative lg:right-16 lg:w-1/2 xl:left-80 xl:w-full">
						<h2 className="font-poppins text-2xl font-bold tracking-normal text-white lg:text-5xl lg:tracking-wider">
							Sign up for the Newsletter
						</h2>
					</div>
					<div className="relative lg:right-44 xl:right-16">
						<p className="w-72 font-cormorant-garamond text-base font-light leading-relaxed text-slate-200 lg:text-lg xl:w-[40rem]">
							Stay updated on my professional activities,
							including new projects, releases, internships, and
							blog posts, by subscribing to my newsletter.
							It&apos;s also a great way to provide feedback and
							stay connected.
						</p>
					</div>
					<div>
						{/* prettier-ignore */}
						<form
							className="relative flex flex-col content-center justify-start w-full gap-6 md:right-10 lg:right-32 lg:translate-x-0 xl:right-36 xl:flex-row"
							onSubmit={handleSubmit(onSubmit)}> {/* eslint-disable-line @typescript-eslint/no-misused-promises -- reason being that this is the normal method to apply handleSubmit per react-hook-forms */}
							<div>
								<TextInput
									className="lg:w-96"
									id="newsletter-register"
									placeholder="johndoe@example.com"
									sizing="lg"
									type="text"
									{...register('email', {
										required: 'Field cannot be empty!',
									})}
								/>
							</div>
							<div>
								<Button
									gradientMonochrome="cyan"
									pill
									size="lg"
									type="submit">
									Sign Up
									<HiOutlineArrowRight className="translate-x-1 h-11 md:h-5" />
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div className="mb-16 mt-3 flex w-screen translate-y-12 flex-col space-y-5">
				<Section
					col_row_reverse={true}
					header="Who am I?"
					ltr={false}
					with_hr>
					<div className="flex-auto flex-col content-stretch space-y-3">
						<p>
							Hi, I am an aspiring Full Stack Web Developer with
							experience with frameworks for both backend and
							frontend such as React.js and Flask. I strive to
							continuously learn more to strengthen my programming
							skills and strive to adapt and learn new frameworks.
						</p>
						<Link
							className="inline-flex font-barlow italic text-cyan-300 underline decoration-cyan-300 decoration-3 underline-offset-4 after:content-link hover:text-cyan-600 hover:decoration-cyan-600"
							to="/about">
							Learn More
						</Link>
					</div>
				</Section>
				<Section
					center={true}
					col={true}
					header="Qualifications and Projects"
					with_hr>
					<div className="grid grid-cols-1 md:w-3/4 md:translate-x-16 lg:-translate-x-48 lg:grid-cols-2 lg:gap-x-96 xl:-translate-x-80 xl:grid-cols-3 xl:gap-x-[26rem]">
						<div>
							<MediumCard bg_transparent title={false}>
								<div className="relative left-1/2 my-3 -translate-x-10 p-5 md:-translate-x-16 lg:-translate-x-16">
									<RiGraduationCapFill className="text-4xl text-slate-500 md:text-8xl" />
								</div>
								<div className="mb-3 p-2">
									<h2 className="text-center font-poppins text-[1.5rem] font-semibold md:text-3xl">
										Education
									</h2>
								</div>
								<div className="flex flex-col gap-y-3">
									<div>
										<p>
											My educational experience from my
											current educational career to
											courses I&apos;ve taken that are
											relevant to both my major as a
											Computer Science (CS) major and
											those relevant to my work as a
											developer.
										</p>
									</div>
									<div>
										<Link
											className="inline-flex font-barlow italic text-cyan-300 underline decoration-cyan-300 decoration-3 underline-offset-4 after:content-link hover:text-cyan-600 hover:decoration-cyan-600"
											to="/education">
											Go To Page
										</Link>
									</div>
								</div>
							</MediumCard>
						</div>
						<div>
							<MediumCard bg_transparent title={false}>
								<div className="relative left-1/2 my-3 -translate-x-10 p-5 md:-translate-x-16 lg:-translate-x-16">
									<FaPersonCircleExclamation className="text-4xl text-slate-500 md:text-8xl" />
								</div>
								<div className="mb-3 p-2">
									<h2 className="text-center font-poppins text-[1.5rem] font-semibold md:text-3xl">
										Experience
									</h2>
								</div>
								<div className="flex flex-col gap-y-3">
									<div>
										<p>
											My work experience and programming
											skills that I self-taught myself.
											You will find work experience
											ranging from internships to
											volunteering in this page.
										</p>
									</div>
									<div>
										<Link
											className="inline-flex font-barlow italic text-cyan-300 underline decoration-cyan-300 decoration-3 underline-offset-4 after:content-link hover:text-cyan-600 hover:decoration-cyan-600"
											to="/experience">
											Go To Page
										</Link>
									</div>
								</div>
							</MediumCard>
						</div>
						<div className="lg:translate-x-52 xl:translate-x-0">
							<MediumCard bg_transparent title={false}>
								<div className="relative left-1/2 my-3 -translate-x-10 p-5 md:-translate-x-16 lg:-translate-x-16">
									<BiCarousel className="text-4xl text-slate-500 md:text-8xl" />
								</div>
								<div className="mb-3 p-2">
									<h2 className="text-center font-poppins text-[1.5rem] font-semibold md:text-3xl">
										Showcase
									</h2>
								</div>
								<div className="flex flex-col gap-y-3">
									<div>
										<p>
											Selected projects that truly
											represents my knowledge and skills
											in web development further showing
											my experience in the field and
											usually are the ones shown in my
											resume.
										</p>
									</div>
									<div>
										<Link
											className="inline-flex font-barlow italic text-cyan-300 underline decoration-cyan-300 decoration-3 underline-offset-4 after:content-link hover:text-cyan-600 hover:decoration-cyan-600"
											to="/showcase">
											Go To Page
										</Link>
									</div>
								</div>
							</MediumCard>
						</div>
					</div>
				</Section>
			</div>
			<WebFooter />
			<ToastContainer
				autoClose={5000}
				closeOnClick
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

export default Home;
