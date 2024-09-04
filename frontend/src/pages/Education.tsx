import { LargeCard, MediumCard } from '@/components/Cards';
import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import CourseAddForm from '@/components/forms/CourseAddForm';
import CourseEditForm from '@/components/forms/CourseEditForm';
import EducationAddForm from '@/components/forms/EducationAddForm';
import EducationEditForm from '@/components/forms/EducationEditForm';
import Section from '@/components/section';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CiSquarePlus } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Education: React.FC = () => {
	const [institutes, setInstitutes] = useState<InstituteProps[]>([]);
	const [courses, setCourses] = useState<CourseProps[]>([]);
	const [showEduAddFormClick, setEduAddFormClick] = useState(false);
	const [showCourseAddForm, setShowCourseAddForm] = useState(false);
	const [showEduEditForm, setEduEditForm] = useState(false);
	const [showCourseEditForm, setCourseEditForm] = useState(false);
	const [EduEditInfo, setEduEditInfo] = useState<InstituteProps>({
		id: 0,
		name: '',
		start_date: '',
		grad_date: '',
		expected_date: '',
		institute_type: '',
		awards: '',
		major: '',
		degree: '',
		logo_path: '',
		logo_file: '',
		institute_url: '',
		small_desc: '',
		created_at: '',
	});
	const [CourseEditInfo, setCourseEditInfo] = useState<CourseProps>({
		id: 0,
		course_name: '',
		course_id: '',
		course_url: '',
		associated_institute: '',
		desc: '',
	});
	const [cookies] = useCookies(['user']);
	const navigate = useNavigate();

	useEffect(() => {
		const imgURLS: string[] = [];
		const allCourses: CourseProps[] = [];

		axios
			.get('/api/education/institute')
			.then(async (res: AxiosResponse) => {
				const institutes = res.data;

				// TODO: once CDN service is up, modify this to set the imgUrl directly to the data which is expected to be a string
				const fullInstitutes = await Promise.all(
					institutes.map(async (entry: InstituteProps) => {
						try {
							const imgRes = await axios.post(
								'/api/image',
								{ fp: entry.logo_path },
								{
									headers: {
										'Content-Type': 'application/json',
									},
									responseType: 'blob',
								}
							);

							const imgUrl = URL.createObjectURL(imgRes.data);
							imgURLS.push(imgUrl);

							// make string array into an actual array
							let awards = entry.awards;
							if (!Array.isArray(awards)) {
								awards = awards.replace(/'/g, '"');

								if (awards !== 'N/A') {
									awards = JSON.parse(awards);
								}
							}

							// get courses
							const courses = await axios.post(
								'/api/education/courses',
								{ institute: entry.name },
								{
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);

							if (courses) {
								allCourses.push(...courses.data);
							}

							return {
								...entry,
								logo_file: imgUrl,
								awards: awards,
							};
						} catch (err) {
							console.error(err);
						}
					})
				);

				setInstitutes(fullInstitutes);
				setCourses(allCourses);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});

		return () => {
			for (const imgUrl of imgURLS) {
				URL.revokeObjectURL(imgUrl);
			}
		};
	}, []);

	const handleEduEditClick = (e: React.MouseEvent, item: InstituteProps) => {
		e.preventDefault();
		setEduEditInfo(item);
		setEduEditForm(true);
	};

	const handleEduDeleteClick = useCallback(
		(e: React.MouseEvent, item_id: number) => {
			e.preventDefault();
			const BearerToken = localStorage.getItem('token');

			axios
				.delete('/api/education/institute/delete', {
					data: { institute_id: item_id },
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
		[navigate]
	);

	const handleCourseEditClick = (e: React.MouseEvent, item: CourseProps) => {
		e.preventDefault();
		setCourseEditInfo(item);
		setCourseEditForm(true);
	};

	const handleCourseDeleteClick = useCallback(
		(e: React.MouseEvent, item_id: number) => {
			e.preventDefault();
			const BearerToken = localStorage.getItem('token');

			axios
				.delete('/api/education/courses/delete', {
					data: { course_id: item_id },
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
		[navigate]
	);

	return (
		<>
			<EducationAddForm
				setVisibility={setEduAddFormClick}
				visibility={showEduAddFormClick}
			/>
			<EducationEditForm
				formInfo={EduEditInfo}
				setVisibility={setEduEditForm}
				visibility={showEduEditForm}
			/>
			<CourseAddForm
				setVisibility={setShowCourseAddForm}
				visibility={showCourseAddForm}
			/>
			<CourseEditForm
				formInfo={CourseEditInfo}
				setVisibility={setCourseEditForm}
				visibility={showCourseEditForm}
			/>
			<NavBar />
			<Header
				title="Institutions"
				desc="This page displays the institutions I have attended and the relevant courses I have taken
					in regards to Computer Science and relevant topics."
			/>
			<div className="container mx-0 my-5 flex flex-col gap-y-5 lg:mx-5">
				<div className="ml-2 space-y-5 p-3">
					{cookies.user ? (
						<Button
							gradientMonochrome="cyan"
							onClick={() => setEduAddFormClick(true)}
							outline
							pill
							size="lg">
							Add Education <CiSquarePlus className="size-6" />
						</Button>
					) : null}
				</div>
				<div>
					<Section col={true} header={false}>
						{institutes.map((entry) => {
							return (
								<>
									<LargeCard
										bg_transparent={true}
										center={false}
										key={entry.id}
										title={false}>
										<div className="flex flex-col content-center gap-y-4">
											<div className="flex flex-col content-center md:flex-row md:gap-x-20">
												<div>
													<img
														alt={`${entry.name} logo`}
														className="size-20 translate-x-3/4 lg:size-32 lg:translate-x-0"
														src={entry.logo_file}
													/>
												</div>
												<div className="flex flex-col gap-y-1">
													<h1 className="font-poppins text-2xl font-semibold tracking-wide text-white lg:text-6xl">
														{entry.name}
													</h1>
													<div>
														<p className="text-sm font-light tracking-tight text-slate-200 md:indent-3">
															Created at:{' '}
															{entry.created_at}
														</p>
													</div>
													<div>
														<p className="text-sm font-light tracking-tight text-slate-200 md:indent-3">
															{entry.start_date} -{' '}
															{entry.expected_date ? (
																<>
																	{
																		entry.grad_date
																	}{' '}
																	(Expected
																	Graduation
																	Date:{' '}
																	{
																		entry.expected_date
																	}
																	)
																</>
															) : (
																entry.grad_date
															)}
														</p>
													</div>
													{cookies.user ? (
														<>
															<div className="mt-5 flex flex-row justify-center gap-x-6">
																<div>
																	<FaPencil
																		className="cursor-pointer hover:text-amber-300"
																		onClick={(
																			e
																		) =>
																			handleEduEditClick(
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
																			handleEduDeleteClick(
																				e,
																				entry.id
																			)
																		}
																	/>
																</div>
															</div>
														</>
													) : null}
												</div>
											</div>
											<div className="flex flex-col justify-stretch gap-4 md:flex-row lg:gap-x-48">
												<ul className="basis-3/4 list-outside list-disc space-y-10 text-slate-300 hover:text-slate-200 lg:ml-10">
													<li className="first-line:font-semibold">
														Institution type: <br />
														{entry.institute_type}
													</li>
													<li className="first-line:font-semibold">
														Degree: <br />
														{entry.degree}
													</li>
													<li className="first-line:font-semibold">
														Major: <br />
														{entry.major
															? entry.major
															: 'N/A'}
													</li>
												</ul>
												<ul className="basis-3/4 list-outside list-disc space-y-5 text-slate-300 hover:text-slate-200">
													<li>
														<span className="font-semibold">
															{' '}
															Awards:{' '}
														</span>

														<ul className="list-inside list-['-'] space-y-3 text-balance">
															{Array.isArray(
																entry.awards
															)
																? entry.awards.map(
																		(
																			award
																		) => (
																			<li
																				key={
																					award
																				}>
																				{
																					award
																				}
																			</li>
																		)
																	)
																: entry.awards}
														</ul>
													</li>
													<li className="text-nowrap first-line:font-semibold">
														Institution Website:{' '}
														<br />
														<a
															className="underline decoration-auto underline-offset-2 hover:text-sky-300"
															rel="noreferrer"
															target="_blank"
															href={
																entry.institute_url
															}>
															{entry.name}
														</a>
													</li>
												</ul>
												<ul className="list-outside list-disc text-slate-300 hover:text-slate-200">
													<li className="leading-6 first-line:font-semibold">
														Short Desc: <br />
														{entry.small_desc}
													</li>
												</ul>
											</div>
										</div>
									</LargeCard>
									<br />
								</>
							);
						})}
					</Section>
				</div>
				<div>
					<h1 className="font-poppins text-5xl font-bold text-white">
						Courses
					</h1>
				</div>
				{cookies.user ? (
					<div>
						<Button
							gradientMonochrome="cyan"
							onClick={() => setShowCourseAddForm(true)}
							outline
							pill
							size="lg">
							Add Course <CiSquarePlus className="size-6" />
						</Button>
					</div>
				) : null}
				<div>
					<div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2">
						{courses.map((entry) => (
							<MediumCard
								bg_transparent={true}
								key={entry.id}
								title={entry.course_id}>
								<div className="flex flex-col gap-y-4 text-balance">
									<div>
										<h3 className="text-xl font-medium tracking-wide">
											{entry.course_name}
										</h3>
									</div>
									<div>
										<p className="first-line:font-bold">
											Course url: <br />
											<a
												className="underline underline-offset-4 hover:text-sky-400"
												href={entry.course_url}
												rel="noreferrer"
												target="_blank">
												{entry.course_name}
											</a>
										</p>
									</div>
									<div>
										<p className="first-line:font-bold">
											Associated Institute: <br />
											{entry.associated_institute}
										</p>
									</div>
									<div>
										<p className="first-line:font-bold">
											Description: <br /> {entry.desc}
										</p>
									</div>
									{cookies.user ? (
										<>
											<div className="flex flex-row items-center justify-center gap-x-6">
												<div>
													<FaPencil
														className="cursor-pointer hover:text-amber-300"
														onClick={(e) =>
															handleCourseEditClick(
																e,
																entry
															)
														}
													/>
												</div>
												<div>
													<FaRegTrashAlt
														className="cursor-pointer hover:text-red-300"
														onDoubleClick={(e) =>
															handleCourseDeleteClick(
																e,
																entry.id
															)
														}
													/>
												</div>
											</div>
										</>
									) : null}
								</div>
							</MediumCard>
						))}
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

export default Education;
