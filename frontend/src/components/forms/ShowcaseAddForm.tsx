import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiCarousel } from 'react-icons/bi';
import { RiFullscreenExitLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShowcaseAddForm: React.FC<FormProps> = ({
	visibility,
	setVisibility,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<ShowcaseAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<ShowcaseAddProps> = (data) => {
		const BearerToken = localStorage.getItem('token');

		axios
			.post('/api/showcase/add', data, {
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
				const res = err.response?.data as {
					error: string;
				};

				setError('project_name', {
					type: 'custom',
					message: res?.error,
				});
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
				id="showcase-add-form">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="showcase-add-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Showcase Project
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
								onSubmit={handleSubmit(onSubmit)}> { }
                                <div>
                                    <div className="mb-3 block">
                                        <Label
                                            className="text-lg font-ibm-plex-serif text-slate-100"
                                            htmlFor="project-name"
                                            value="Name of Project"
                                        />
                                    </div>
                                    <TextInput
                                        autoComplete="off"
                                        className="placeholder:font-ibm-plex-serif"
                                        color={errors.project_name ? "failure" : ""}
                                        icon={BiCarousel}
                                        id="project-name"
                                        placeholder="Enter project name..."
                                        {...register("project_name", {
                                            required: "Name of project is required!"
                                        })}
                                        aria-invalid={
                                            errors.project_name ? 'true' : 'false'
                                        }
                                        helperText={
                                            <>
                                                <p className="font-barlow tracking-wide" role="alert">
                                                    {errors.project_name?.message}
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

export default ShowcaseAddForm;
