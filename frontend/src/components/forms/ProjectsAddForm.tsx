import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput, Textarea } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaHammer, FaProjectDiagram } from 'react-icons/fa';
import { IoIosLink } from 'react-icons/io';
import { RiFullscreenExitLine } from 'react-icons/ri';
import { VscCalendar } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProjectsAddForm: React.FC<FormProps> = ({
	visibility,
	setVisibility,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<ProjectsAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<ProjectsAddProps> = (data) => {
		// prettier-ignore
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const filtered_data = Object.fromEntries(Object.entries(data).filter(([key, val]) => val !== ''));
		const BearerToken = localStorage.getItem('token');

		axios
			.post('/api/projects/add', filtered_data, {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data?.success);
				reset();
				setVisibility(false);

				setTimeout(() => {
					return navigate(0);
				}, 5500);
			})
			.catch((err: AxiosError) => {
				SetFormErrors<ProjectsAddProps>(err, setError);
			});
	};

	const handleCancel = () => {
		reset();
		setVisibility(false);
	};

	return (
		<>
			<div
				className={`${visibility ? 'fixed' : 'hidden'} left-0 top-0 z-20 size-full overflow-y-auto bg-slate-950/70`}
				id="project-add-form">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="project-add-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Project
								</h1>
							</div>
							<div>
								<RiFullscreenExitLine
									className="absolute right-5 top-4 cursor-pointer text-lg text-white hover:text-slate-200 lg:text-xl"
									onClick={() => handleCancel()}
								/>
							</div>
						</div>
						<HR />
						<div>
							{/* prettier-ignore */}
							<form
								className="mx-5 space-y-4"
								onSubmit={handleSubmit(onSubmit)}> {/* eslint-disable-line @typescript-eslint/no-misused-promises */}
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="name"
											value="Name of Project"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										color={errors.name ? 'failure' : ''}
										icon={FaProjectDiagram}
										id="name"
										placeholder="Enter name..."
										{...register('name', {
											required:
												'Project name is required!',
										})}
										aria-invalid={
											errors.name ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="tracking-wide font-barlow"
													role="alert">
													{errors.name?.message}
												</p>
											</>
										}
									/>
								</div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="start-date"
                                            value="Start Date"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.start_date ? 'failure'  :''}
                                        icon={VscCalendar}
                                        id="start-date"
                                        placeholder="MM/YYYY"
                                        {...register("start_date", {
                                            required: 'Start date is required',
                                            pattern: {
                                                value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                                                message: "format must be: MM/YYYY",
                                            }
                                        })}
                                        aria-invalid={
                                            errors.start_date ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.start_date?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="end-date"
                                            value="End Date (Optional)"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.end_date ? 'failure' : ''}
                                        icon={VscCalendar}
                                        id="end-date"
                                        placeholder="MM/YYYY"
                                        {...register("end_date", {
                                            required: false,
                                            pattern: {
                                                value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                                                message: 'Format must be: MM/YYYY',
                                            }
                                        })}
                                        aria-invalid={
                                            errors.end_date ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.end_date?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="desc"
                                            value="Project Description"
                                        />
                                    </div>
                                    <Textarea
                                        className="resize-none placeholder:font-ibm-plex-serif"
                                        color={errors.desc ? "failure" : ''}
                                        id="desc"
                                        placeholder="Enter description..."
                                        rows={4}
                                        {...register("desc", {
                                            required: "Description is required",
                                            maxLength: {
                                                value: 1000,
                                                message: "Description must have a maximum of 100 characters",
                                            },
                                        })}
                                        aria-invalid={
                                            errors.desc ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.desc?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="skills"
                                            value="Skills (list all skills with '|' as the separator)"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.skills ? "failure" : ""}
                                        icon={FaHammer}
                                        id="skills"
                                        placeholder="Enter skills..."
                                        {...register("skills", {
                                            required: "Skills is required",
                                            pattern: {
                                                value: /^([\w\s.*|]+)?$/,
                                                message: "Skills must be separated by '|'",
                                            },
                                        })}
                                        aria-invalid={errors.skills ? 'true' : 'false'}
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.skills?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="repo-url"
                                            value="Github Repository URL"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.project_repo_url ? 'failure' : ''}
                                        icon={IoIosLink}
                                        id="repo-url"
                                        placeholder="Enter url..."
                                        {...register("project_repo_url", {
                                            required: "Repository url is required",
                                        })}
                                        aria-invalid={
                                            errors.project_repo_url ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.project_repo_url?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div>
                                    <div className="block mb-3">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="web-url"
                                            value="Project Website url (Optional)"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.project_url ? 'failure' : ''}
                                        icon={IoIosLink}
                                        id="web-url"
                                        placeholder="Enter url..."
                                        {...register("project_url")}
                                        aria-invalid={
                                            errors.project_url ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p
                                                    className="tracking-wide font-barlow"
                                                    role="alert">
                                                    {errors.project_url?.message}
                                                </p>
                                            </>
                                        }
                                    />
                                </div>
                                <div className="flex flex-row content-evenly justify-evenly">
                                    <div>
                                    <Button
											gradientMonochrome="cyan"
											pill
											size="sm"
											type="submit">
											Submit
										</Button>
									</div>
									<div>
										<Button
											color="light"
											onClick={() => handleCancel()}
											pill>
											Cancel
										</Button>
									</div>
                                </div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProjectsAddForm;
