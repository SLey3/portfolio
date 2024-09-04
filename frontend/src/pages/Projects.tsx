import { MediumCard } from '@/components/Cards';
import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ProjectsAddForm from '@/components/forms/ProjectsAddForm';
import ProjectsEditForm from '@/components/forms/ProjectsEditForm';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Pagination } from 'flowbite-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CiSquarePlus } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Projects: React.FC = () => {
	const [projects, setProjects] = useState<ProjectProps[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [projectFormVis, setProjectFormVis] = useState(false);
	const [projectEditFormVis, setProjectEditFormVis] = useState(false);
	const [projectEditFormInfo, setProjectEditFormInfo] =
		useState<ProjectProps>({
			id: 0,
			name: '',
			start_date: '',
			end_date: '',
			desc: '',
			skills: '',
			project_repo_url: '',
			project_url: '',
		});
	const [currentPage, setCurrentPage] = useState(1);
	const [cookies] = useCookies(['user']);
	const navigate = useNavigate();

	const onPageChange = (page: number) => setCurrentPage(page);

	useEffect(() => {
		axios
			.get('/api/projects', {
				params: { page: currentPage },
			})
			.then((res: AxiosResponse) => {
				const parsed_data = res.data?.map((entry: ProjectProps) => ({
					...entry,
					skills:
						typeof entry.skills === 'string'
							? entry.skills.split('|').map((val) => val.trim())
							: entry.skills.map((val) => val.trim()),
				}));
				setProjects(parsed_data);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error(JSON.stringify(err.response?.data));
			});
	}, [currentPage]);

	useEffect(() => {
		axios
			.get('/api/projects/totalpages')
			.then((res: AxiosResponse) => {
				setTotalPages(res.data?.payload);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error(JSON.stringify(err.response?.data));
			});
	}, []);

	const handleProjectEdit = (e: React.MouseEvent, formInfo: ProjectProps) => {
		e.preventDefault();
		setProjectEditFormInfo(formInfo);
		setProjectEditFormVis(true);
	};

	const handleProjectDelete = useCallback(
		(e: React.MouseEvent, item_id: number) => {
			e.preventDefault();
			const BearerToken = localStorage.getItem('token');

			axios
				.delete('/api/projects/delete', {
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
		[navigate]
	);

	return (
		<>
			<ProjectsAddForm
				setVisibility={setProjectFormVis}
				visibility={projectFormVis}
			/>
			<ProjectsEditForm
				formInfo={projectEditFormInfo}
				setVisibility={setProjectEditFormVis}
				visibility={projectEditFormVis}
			/>
			<NavBar />
			<Header
				title="My Projects"
				desc="A paginated list of projects that I had made all around
						from self to university. This is a general list of
						projects."
			/>
			{cookies.user ? (
				<Button
					className="md:translate-x-4"
					gradientMonochrome="cyan"
					onClick={() => setProjectFormVis(true)}
					outline
					pill
					size="lg">
					Add New Project <CiSquarePlus className="size-6" />
				</Button>
			) : null}
			<div className="grid grid-rows-1 justify-items-center gap-y-3 p-2 pt-10">
				<div className="columns-1 lg:columns-2 lg:space-y-8">
					{projects.map((entry) => (
						<div key={entry.id}>
							<MediumCard title={entry.name}>
								<div className="flex flex-col items-center gap-y-5">
									<div className="h-5 grow text-base text-gray-200">
										{entry.start_date} - {entry.end_date}
									</div>
									<div className="flex-1 flex-col content-center">
										<div className="font-semibold">
											Description
										</div>
										<div className="leading-7 tracking-wider">
											{entry.desc}
										</div>
									</div>
									<div className="flex-1 flex-col content-center">
										<div className="mb-3 font-semibold">
											Skills:
										</div>
										<div>
											<ul className="list-outside list-disc">
												{Array.isArray(entry.skills)
													? entry.skills.map(
															(award) => (
																<li
																	className="hover:py-1 hover:text-xl hover:text-cyan-300"
																	key={award}>
																	{award}
																</li>
															)
														)
													: entry.skills}
											</ul>
										</div>
									</div>
									<div>
										<div className="tracking-wide">
											<span className="font-semibold">
												Github Repository URL:{' '}
											</span>
											<a
												className="no-underline decoration-3 underline-offset-2 hover:text-cyan-300 hover:underline hover:decoration-cyan-300"
												href={entry.project_repo_url}
												rel="noreferrer"
												target="_blank">
												{entry.name}
											</a>
										</div>
									</div>
									{entry.project_url ? (
										<div>
											<div className="tracking-wide">
												<span className="font-semibold">
													Project Website:{' '}
												</span>
												<a
													className="no-underline decoration-3 underline-offset-2 hover:text-cyan-300 hover:underline hover:decoration-cyan-300"
													href={entry.project_url}
													rel="noreferrer"
													target="_blank">
													{entry.name}
												</a>
											</div>
										</div>
									) : null}
									{cookies.user ? (
										<div className="flex flex-row justify-evenly gap-x-6">
											<div>
												<FaPencil
													className="cursor-pointer hover:text-amber-300"
													onClick={(e) =>
														handleProjectEdit(
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
														handleProjectDelete(
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
				<div>
					<div className="flex overflow-x-auto sm:justify-center">
						<Pagination
							currentPage={currentPage}
							layout="pagination"
							onPageChange={onPageChange}
							showIcons
							totalPages={totalPages}
						/>
					</div>
				</div>
			</div>
			<div className="m-6 flex flex-row content-center justify-between p-3 lg:gap-x-96">
				<div>
					<Button as={Link} color="dark" pill to="/showcase">
						Previous
					</Button>
				</div>
				<div>
					<Button as={Link} color="blue" pill to="/experience">
						Next
					</Button>
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

export default Projects;
