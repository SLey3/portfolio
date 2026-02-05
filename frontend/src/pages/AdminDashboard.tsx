import { getAdminLinkHighlightColor } from '@/utils';
import useAuthToken from '@/utils/hooks/use-auth-token';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button } from 'flowbite-react';
import React, { type Key, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CiSquarePlus } from 'react-icons/ci';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MediumCard } from '@/components/Cards';
import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import ProtectedComponent from '@/components/protected';

const AdminDashboard: React.FC = () => {
	const [linkResults, setLinkResults] = useState<null | LinkResultsProps[]>(
		null
	);
	const [sqlResults, setSqlResults] = useState<ExecuteQueryResProps[] | null>(
		null
	);
	const [blogDrafts, setBlogDrafts] = useState<DraftBlogList[] | null>(null);
	const [sqlErr, setSqlErr] = useState<null | string>(null);
	const [linkIsProcessing, setLinkIsProcessing] = useState(false);
	const [blogIsProcessing, setBlogIsProcessing] = useState(false);
	const { register, handleSubmit, reset } = useForm<ExecuteQueryForm>({
		resetOptions: {
			keepValues: false,
		},
	});
	const navigate = useNavigate();
	const BearerToken = useAuthToken();

	const onSQLQuerySubmit: SubmitHandler<ExecuteQueryForm> = (data) => {
		axios
			.post(
				'/api/admin/sql',
				{ query: data.query },
				{
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				}
			)
			.then((res: AxiosResponse) => {
				if (res.status === 206) {
					setSqlErr(res.data?.err_msg);
					return;
				}

				setSqlErr(null);
				setSqlResults(res.data?.res);
				reset();
			})
			.catch((err: AxiosError) => {
				const data = err.response?.data as {
					err_msg?: string;
				};

				setSqlErr(data.err_msg!);
			});
	};

	const handleLinkReport = (e: React.MouseEvent) => {
		e.preventDefault();
		setLinkIsProcessing(true);

		axios
			.get('/api/admin/links', {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
				},
			})
			.then((res: AxiosResponse) => {
				setLinkResults(res.data.report);
				setLinkIsProcessing(false);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	};

	const handleBlogDraftRequest = (e: React.MouseEvent) => {
		e.preventDefault();
		setBlogIsProcessing(true);

		axios
			.get('/api/blog/drafts', {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
				},
			})
			.then((res: AxiosResponse) => {
				if (res.status === 204) {
					toast.warning('HTTP 204: No current blog drafts found.', {
						position: 'bottom-center',
					});
					setBlogIsProcessing(false);
					return;
				}

				setBlogDrafts(res.data);
				toast.info('Blog Drafts loaded!');
				setBlogIsProcessing(false);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error(
					'Error occurred while requesting blog drafts data. Try again later'
				);
				setBlogIsProcessing(false);
			});
	};

	const handleBlogDraftDelete = (e: React.MouseEvent, blogId: number) => {
		axios
			.delete('/api/blog/delete', {
				data: {
					id: blogId,
				},
				headers: {
					Authorization: `Bearer ${BearerToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data.success);
			})
			.catch((err: AxiosError<{ error: string }>) => {
				toast.error(err.response?.data.error);
			});
	};

	const handleBlogEditClick = (e: React.MouseEvent, blogId: number) => {
		e.preventDefault();

		return navigate(`/blog/edit/${blogId}?f_a=true`);
	};

	return (
		<>
			<ProtectedComponent>
				<NavBar />
				<Header title="Admin Dashboard" />
				<div className="container mx-auto py-10">
					<div className="flex flex-col items-center gap-y-14">
						<div>
							<div className="bg-gradient-slate size-auto rounded-lg border-x-2 border-b-4 border-x-slate-600 border-b-slate-800 py-24 shadow-lg shadow-slate-400 md:h-auto lg:w-[60rem] xl:w-[78rem]">
								<div className="flex flex-col justify-evenly gap-y-14 pl-8">
									<div>
										<h1 className="text-wrap border-l border-l-slate-100 pl-4 font-barlow text-4xl font-bold text-white">
											Link Health Check
										</h1>
									</div>
									<div>
										{linkResults ? (
											<div className="overflow-x-scroll">
												<table className="size-auto bg-white md:h-auto md:w-[97%]">
													<thead className="h-auto bg-slate-400 font-poppins text-slate-700 md:h-10">
														<tr>
															<th scope="col">
																Table Name
															</th>
															<th scope="col">
																Row Id
															</th>
															<th scope="col">
																Link
															</th>
															<th scope="col">
																Validity
															</th>
															<th scope="col">
																HTTP Code
															</th>
														</tr>
													</thead>
													<tbody className="font-barlow [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-b-slate-400">
														{linkResults.map(
															(entry) => (
																<tr
																	className={`${getAdminLinkHighlightColor(entry.http_code)} h-12 text-center`}
																	key={
																		entry.link
																	}>
																	<th scope="rowgroup">
																		{
																			entry.tablename
																		}
																	</th>
																	<td>
																		{
																			entry.item_id
																		}
																	</td>
																	<td className="truncate">
																		{
																			entry.link
																		}
																	</td>
																	<td>{`${entry.validity}`}</td>
																	<td>
																		{
																			entry.http_code
																		}
																	</td>
																</tr>
															)
														)}
													</tbody>
												</table>
											</div>
										) : (
											<Button
												color="gray"
												isProcessing={linkIsProcessing}
												onClick={handleLinkReport}
												pill
												size="lg">
												Generate Report
												<CiSquarePlus className="ml-2 size-5" />
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="bg-gradient-slate size-auto rounded-lg border-x-2 border-b-4 border-x-slate-600 border-b-slate-800 py-24 shadow-lg shadow-slate-400 lg:w-[60rem] xl:w-[78rem]">
								<div className="flex flex-col justify-evenly gap-y-14 pl-8">
									<div>
										<h1 className="text-wrap border-l border-l-slate-100 pl-4 font-barlow text-4xl font-bold text-white">
											Execute Select Statement
										</h1>
									</div>
									<div>
										{}
										<form
											className="item-center flex flex-row gap-x-5"
											onSubmit={handleSubmit(
												onSQLQuerySubmit
											)}>
											<div>
												<div className="flex flex-row gap-x-0">
													<div>
														<div className="h-9 w-32 rounded-bl-sm rounded-tl-md bg-slate-400 py-2 text-center font-ibm-plex-serif font-semibold text-blue-500">
															SELECT
														</div>
													</div>
													<div className="grow">
														<input
															autoComplete="off"
															className={`h-9 w-[40rem] caret-blue-300 xl:w-[52rem] ${sqlErr ? 'bg-red-400/60 caret-red-800' : 'bg-white caret-blue-800'} border-0`}
															type="text"
															{...register(
																'query',
																{
																	required:
																		'Query must not be blank',
																}
															)}
														/>
														<div
															className={`${sqlErr ? 'block' : 'hidden'} pt-px font-barlow text-xs font-light tracking-wide text-red-400`}>
															{sqlErr}
														</div>
													</div>
												</div>
											</div>
											<div>
												<Button
													outline
													size="md"
													type="submit">
													Execute
												</Button>
											</div>
										</form>
									</div>
									{sqlResults ? (
										<>
											<div>
												<h1 className="font-poppins text-2xl font-semibold text-white">
													SQL Results
												</h1>
											</div>
											<div className="overflow-x-auto">
												<table className="size-auto border border-slate-200 md:h-auto md:w-[97%]">
													<thead className="h-auto border-b border-b-slate-200 font-poppins text-slate-200 md:h-10">
														<tr className="[&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-r-slate-200">
															{Object.keys(
																sqlResults[0]
															).map((column) => (
																<th
																	className="text-center"
																	key={column}
																	scope="col">
																	{column}
																</th>
															))}
														</tr>
													</thead>
													<tbody>
														{sqlResults
															? sqlResults.map(
																	(row) => (
																		<tr
																			className="border-b border-b-slate-200 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-r-slate-200"
																			key={
																				row.id as unknown as Key
																			}>
																			{Object.values(
																				row
																			).map(
																				(
																					val
																				) => (
																					<td
																						className="text-center font-barlow"
																						key={
																							val as unknown as Key
																						}>
																						{
																							val
																						}
																					</td>
																				)
																			)}
																		</tr>
																	)
																)
															: null}
													</tbody>
												</table>
											</div>
										</>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div className="grid grid-rows-2 pt-32">
						<div>
							<Header title="Blog Drafts" />
						</div>
						<div
							className={
								blogDrafts
									? 'flex -translate-x-80 -translate-y-80 flex-col flex-wrap content-center justify-between gap-8 pt-0'
									: 'align-bottom'
							}>
							{blogDrafts ? (
								blogDrafts.map((blog) => (
									<div key={blog.id}>
										<MediumCard
											bg_transparent
											longWidth
											title={blog.title}>
											<div className="grid grid-rows-5 content-center">
												<div className="justify-self-center pb-10">
													<p className="font-poppins text-sm font-extralight tracking-tighter">
														<span className="font-semibold">
															Created At:{' '}
														</span>{' '}
														{blog.created_at}
													</p>
												</div>
												<div>
													<h3 className="font-poppins text-lg font-semibold tracking-tight text-slate-100">
														Blog ID
													</h3>
												</div>
												<div>
													<p className="font-barlow font-[250] tracking-tight text-slate-300">
														{blog.id}
													</p>
												</div>
												<div>
													<h3 className="font-poppins text-lg font-semibold tracking-tight text-slate-100">
														Description
													</h3>
												</div>
												<div>
													<p className="box-content overflow-hidden text-ellipsis font-barlow font-[250] leading-7 tracking-wide text-slate-300">
														{blog.desc}
													</p>
												</div>
												<div className="grid grid-cols-2 justify-items-center gap-x-3 pt-10">
													<div>
														<FaPencil
															className="cursor-pointer hover:text-amber-200"
															onClick={(e) =>
																handleBlogEditClick(
																	e,
																	blog.id
																)
															}
														/>
													</div>
													<div>
														<FaTrash
															className="cursor-pointer hover:text-red-200"
															onDoubleClick={(
																e
															) =>
																handleBlogDraftDelete(
																	e,
																	blog.id
																)
															}
														/>
													</div>
												</div>
											</div>
										</MediumCard>
									</div>
								))
							) : (
								<Button
									gradientMonochrome="cyan"
									isProcessing={blogIsProcessing}
									pill
									size="lg"
									onClick={(e: React.MouseEvent) =>
										handleBlogDraftRequest(e)
									}>
									Load Drafts
								</Button>
							)}
						</div>
					</div>
				</div>
				<WebFooter />
				<ToastContainer
					autoClose={5000}
					closeButton
					closeOnClick
					draggable={false}
					hideProgressBar={false}
					limit={2}
					newestOnTop
					pauseOnFocusLoss={false}
					pauseOnHover={false}
					position="bottom-right"
					rtl={false}
					theme="dark"
					transition={Zoom}
				/>
			</ProtectedComponent>
		</>
	);
};

export default AdminDashboard;
