import { MediumCard, SmallCard } from '@/components/Cards';
import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import CertLicenseAddForm from '@/components/forms/CertLicenseAddForm';
import CertLicenseEditForm from '@/components/forms/CertLicenseEditForm';
import WorkExperienceAddForm from '@/components/forms/WorkExperienceAddForm';
import WorkExperienceEditForm from '@/components/forms/WorkExperienceEditForm';
import Section from '@/components/section';
import useAuthToken from '@/utils/hooks/use-auth-token';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Flowbite, Timeline } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
	BiLogoFlask,
	BiLogoTailwindCss,
	BiLogoTypescript,
} from 'react-icons/bi';
import { BsFiletypeSql, BsFiletypeXml } from 'react-icons/bs';
import { CiSquarePlus } from 'react-icons/ci';
import {
	FaBootstrap,
	FaCss3Alt,
	FaExternalLinkAlt,
	FaGitAlt,
	FaHtml5,
	FaMarkdown,
	FaPaintRoller,
	FaPhp,
	FaPython,
	FaRProject,
	FaReact,
	FaRegTrashAlt,
	FaServer,
} from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { IoLanguageOutline, IoLogoJavascript } from 'react-icons/io5';
import { LuArrowRightFromLine } from 'react-icons/lu';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { SiMysql, SiPhpmyadmin } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimelineTheme: CustomFlowbiteTheme = {
	timeline: {
		root: {
			direction: {
				vertical:
					'relative border-l border-gray-500 hover:border-gray-400',
			},
		},
		item: {
			root: {
				vertical: 'group mb-10 ml-6',
			},
			content: {
				body: {
					base: 'mb-4 text-base font-normal font-ibm-plex-serif text-slate-200 group-hover:p-3 hover:text-slate-300',
				},
				time: {
					base: 'mb-1 text-sm font-normal font-barlow leading-none text-slate-300',
				},
				title: {
					base: 'text-lg font-poppins font-semibold text-white',
				},
			},
			point: {
				line: 'hidden h-0.5 w-full bg-gray-700 sm:flex',
				marker: {
					base: {
						vertical:
							'absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-gray-900 bg-gray-700',
					},
					icon: {
						base: 'h-3 w-3 text-cyan-300',
						wrapper:
							'absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full opacity-90 ring-8 ring-slate-800 will-change-auto transition-colors bg-cyan-900 group-hover:bg-cyan-600 group-hover:animate-cyanglow',
					},
				},
			},
		},
	},
};

const Experience: React.FC = () => {
	const [workExperience, setWorkExperience] = useState<ExperienceProps[]>([]);
	const [WorkFormVis, setWorkFormVis] = useState(false);
	const [WorkEditFormVis, setWorkEditFormVis] = useState(false);
	const [WorkEditFormInfo, setWorkEditFormInfo] = useState<ExperienceProps>({
		id: 0,
		name: '',
		type: '',
		position: '',
		start_date: '',
		end_date: '',
		desc: '',
	});
	const [certifications, setCertifications] = useState<CertLicenseProps[]>(
		[]
	);
	const [CertFormVis, setCertFormVis] = useState(false);
	const [CertEditFormVis, setCertEditFormVis] = useState(false);
	const [CertEditFormInfo, setCertEditFormInfo] = useState<CertLicenseProps>({
		id: 0,
		name: '',
		issuing_org: '',
		issue_date: '',
		issue_exp: '',
		credential_id: '',
		credential_url: '',
	});
	const [cookies] = useCookies(['user']);
	const navigate = useNavigate();
	const BearerToken = useAuthToken();

	useEffect(() => {
		axios
			.get('/api/experience')
			.then((res: AxiosResponse) => {
				setWorkExperience(res.data);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error(JSON.stringify(err.response?.data));
			});

		axios
			.get('/api/cert')
			.then((res: AxiosResponse) => {
				setCertifications(res.data);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error(JSON.stringify(err.response?.data));
			});
	}, []);

	const handleWorkExperienceEdit = (
		e: React.MouseEvent,
		item: ExperienceProps
	) => {
		e.preventDefault();
		setWorkEditFormInfo(item);
		setWorkEditFormVis(true);
	};

	const handleWorkExperienceDelete = useCallback(
		(e: React.MouseEvent, item_id: number) => {
			e.preventDefault();

			axios
				.delete('/api/experience/delete', {
					data: { id: item_id },
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				})
				.then((res: AxiosResponse) => {
					toast.success(res.data?.success);

					setTimeout(() => {
						return navigate(0);
					}, 5500);
				})
				.catch((err: AxiosError) => {
					const res = err.response?.data as {
						error: string;
					};
					toast.error(res?.error);
				});
		},
		[navigate, BearerToken]
	);

	const handleCertEdit = (e: React.MouseEvent, item: CertLicenseProps) => {
		e.preventDefault();
		setCertEditFormInfo(item);
		setCertEditFormVis(true);
	};

	const handleCertDelete = useCallback(
		(e: React.MouseEvent, item_id: number) => {
			e.preventDefault();

			axios
				.delete('/api/cert/delete', {
					data: { id: item_id },
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				})
				.then((res: AxiosResponse) => {
					toast.success(res.data?.success);

					setTimeout(() => {
						return navigate(0);
					}, 5500);
				})
				.catch((err: AxiosError) => {
					const res = err.response?.data as {
						error: string;
					};

					toast.error(res?.error);
				});
		},
		[navigate, BearerToken]
	);

	return (
		<>
			<WorkExperienceAddForm
				setVisibility={setWorkFormVis}
				visibility={WorkFormVis}
			/>
			<WorkExperienceEditForm
				formInfo={WorkEditFormInfo}
				setVisibility={setWorkEditFormVis}
				visibility={WorkEditFormVis}
			/>
			<CertLicenseAddForm
				setVisibility={setCertFormVis}
				visibility={CertFormVis}
			/>
			<CertLicenseEditForm
				formInfo={CertEditFormInfo}
				setVisibility={setCertEditFormVis}
				visibility={CertEditFormVis}
			/>
			<NavBar />
			<Header
				title="My Experience"
				desc={
					<>
						I am grateful for each and every opportunity I get and
						have to learn and improve on skills as a developer.
						<br /> This page contains a timeline regarding my work
						experience and a grid of skills that I am familiar with.
					</>
				}
			/>
			<div className="container mx-px my-5 flex flex-col content-center gap-y-8 md:mx-2">
				<div>
					<Section col header="Work Experience" with_hr={false}>
						<div className="space-y-16">
							{cookies.user ? (
								<Button
									className="md:translate-x-4"
									gradientMonochrome="cyan"
									onClick={() => setWorkFormVis(true)}
									outline
									pill
									size="lg">
									Add Work Experience{' '}
									<CiSquarePlus className="size-6" />
								</Button>
							) : null}
							<Flowbite theme={{ theme: TimelineTheme }}>
								<Timeline>
									{workExperience.map((entry) => (
										<Timeline.Item key={entry.id}>
											<Timeline.Point
												icon={LuArrowRightFromLine}
											/>
											<Timeline.Content>
												<Timeline.Time>
													{entry.start_date} -{' '}
													{entry.end_date}
												</Timeline.Time>
												<Timeline.Title>
													{entry.name}
												</Timeline.Title>
												<Timeline.Body>
													<div className="space-y-5">
														<ul className="list-inside list-disc">
															<li>
																Type of Work:{' '}
																{entry.type}
															</li>
															<li>
																Position:{' '}
																{entry.position}
															</li>
														</ul>
														<p className="text-base md:text-lg">
															{entry.desc}
														</p>
													</div>
												</Timeline.Body>
												{cookies.user ? (
													<div className="flex flex-row justify-evenly gap-x-2">
														<div>
															<FaPencil
																className="cursor-pointer hover:text-amber-300"
																onClick={(e) =>
																	handleWorkExperienceEdit(
																		e,
																		entry
																	)
																}
															/>
														</div>
														<div>
															<FaRegTrashAlt
																className="cursor-pointer hover:text-red-300"
																onDoubleClick={(
																	e
																) =>
																	handleWorkExperienceDelete(
																		e,
																		entry.id
																	)
																}
															/>
														</div>
													</div>
												) : null}
											</Timeline.Content>
										</Timeline.Item>
									))}
								</Timeline>
							</Flowbite>
						</div>
					</Section>
				</div>
				<div>
					<Section col={true} header="Certifications & Licenses">
						<div className="space-y-16">
							{cookies.user ? (
								<Button
									className="md:translate-x-4"
									gradientMonochrome="cyan"
									onClick={() => setCertFormVis(true)}
									outline
									pill
									size="lg">
									Add Certification or License{' '}
									<CiSquarePlus className="size-6" />
								</Button>
							) : null}
							<div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 lg:gap-x-96">
								{certifications.map((entry) => (
									<div key={entry.id}>
										<MediumCard
											bg_transparent
											title={entry.name}>
											<div className="my-3 flex flex-col items-center gap-y-3 p-3">
												<div>{entry.issuing_org}</div>
												<div>
													Issued:{' '}
													<span className="italic">
														{entry.issue_date}
													</span>
												</div>
												{entry.issue_exp ? (
													<div>
														Expires:{' '}
														<span className="italic">
															{entry.issue_exp}
														</span>
													</div>
												) : null}
												{entry.credential_id ? (
													<div>
														Credential ID:{' '}
														{entry.credential_id}
													</div>
												) : null}
												<div>
													<Button
														className="font-poppins"
														color="gray"
														outline
														pill
														rel="noreferrer"
														target="_blank"
														href={
															entry.credential_url
														}>
														Show Credential{' '}
														<FaExternalLinkAlt className="h-3 w-6 translate-y-3 text-cyan-400 lg:translate-y-1" />
													</Button>
												</div>
												{cookies.user ? (
													<div className="mt-6 flex flex-row justify-evenly gap-x-8">
														<div>
															<FaPencil
																className="cursor-pointer hover:text-amber-300"
																onClick={(e) =>
																	handleCertEdit(
																		e,
																		entry
																	)
																}
															/>
														</div>
														<div>
															<FaRegTrashAlt
																className="cursor-pointer hover:text-red-300"
																onDoubleClick={(
																	e
																) =>
																	handleCertDelete(
																		e,
																		entry.id
																	)
																}
															/>
														</div>
													</div>
												) : null}
											</div>
										</MediumCard>
									</div>
								))}
							</div>
						</div>
					</Section>
				</div>
				<div>
					<Section col header="Skills" with_hr>
						<div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-72 xl:grid-cols-4">
							<div>
								<SmallCard
									title="Python"
									icon={
										<FaPython className="text-[#4584B6]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="Javascript"
									icon={
										<IoLogoJavascript className="text-amber-300" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="Typescript"
									icon={
										<BiLogoTypescript className="text-[#3178C6]" />
									}
								/>
							</div>
							<div>
								<SmallCard icon={<FaRProject />} title="R" />
							</div>
							<div>
								<SmallCard
									icon={<FaPhp className="text-[#8993be]" />}
									title="PHP"
								/>
							</div>
							<div>
								<SmallCard
									icon={<BsFiletypeSql />}
									title="SQL"
								/>
							</div>
							<div>
								<SmallCard
									title="HTML"
									icon={
										<FaHtml5 className="text-[#f06529]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="CSS"
									icon={
										<FaCss3Alt className="text-[#2965f1]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									icon={<BsFiletypeXml />}
									title="XML"
								/>
							</div>
							<div>
								<SmallCard
									icon={<BiLogoFlask />}
									title="Flask"
								/>
							</div>
							<div>
								<SmallCard
									title="React.js"
									icon={
										<FaReact className="text-[#00d8ff]" />
									}
								/>
							</div>
							<div>
								<SmallCard title="Slim PHP" />
							</div>
							<div>
								<SmallCard
									title="Bootstrap"
									icon={
										<FaBootstrap className="text-[#694a97]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="TailwindCSS"
									icon={
										<BiLogoTailwindCss className="text-[#3490dc]" />
									}
								/>
							</div>
							<div>
								<SmallCard title="Flowbite" />
							</div>
							<div>
								<SmallCard
									title="Excel"
									icon={
										<RiFileExcel2Fill className="text-[#64a683]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="Vscode"
									icon={
										<VscVscode className="text-[#0078d7]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									title="MySQL"
									icon={
										<SiMysql className="text-[#00758f]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									icon={<SiPhpmyadmin />}
									title="phpMyAdmin"
								/>
							</div>
							<div>
								<SmallCard
									icon={<FaMarkdown className="text-black" />}
									title="Markdown"
								/>
							</div>
							<div>
								<SmallCard
									title="Git"
									icon={
										<FaGitAlt className="text-[#F1502F]" />
									}
								/>
							</div>
							<div>
								<SmallCard
									icon={<FaServer />}
									title="Backend"
								/>
							</div>
							<div>
								<SmallCard
									icon={<FaPaintRoller />}
									title="Frontend"
								/>
							</div>
							<div>
								<SmallCard
									icon={<IoLanguageOutline />}
									title="English"
								/>
							</div>
							<div>
								<SmallCard
									icon={<IoLanguageOutline />}
									title="Spanish"
								/>
							</div>
						</div>
					</Section>
				</div>
				<div className="m-6 flex flex-row content-center justify-between p-3 lg:gap-x-96">
					<div>
						<Button as={Link} color="dark" pill to="/projects">
							Previous
						</Button>
					</div>
					<div>
						<Button as={Link} color="blue" pill to="/showcase">
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

export default Experience;
