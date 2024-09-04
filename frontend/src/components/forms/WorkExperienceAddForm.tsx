import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput, Textarea } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiSolidInstitution } from 'react-icons/bi';
import { RiFullscreenExitLine } from 'react-icons/ri';
import { VscCalendar, VscTypeHierarchySub } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const WorkExperienceAddForm: React.FC<FormProps> = ({
	visibility,
	setVisibility,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<ExperienceAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<ExperienceAddProps> = (data) => {
		const BearerToken = localStorage.getItem('token');
		axios
			.post('/api/experience/add', data, {
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
				SetFormErrors<ExperienceAddProps>(err, setError);
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
				id="work-experience-add-overlay">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="work-experience-add-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Work Experience
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
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="work-name"
											value="Name of Company/Organization"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										color={errors.name ? 'failure' : ''}
										icon={BiSolidInstitution}
										id="work-name"
										placeholder="Enter name..."
										{...register('name', {
											required:
												'Work Experience name is required!',
										})}
										aria-invalid={
											errors.name ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.name?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="work-type"
											value="Type of Work"
										/>
									</div>
									<TextInput
										autoCapitalize="on"
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										color={errors.type ? 'failure' : ''}
										icon={BiSolidInstitution}
										id="work-type"
										placeholder="Enter type..."
										{...register('type', {
											required: 'Work Type is required!',
										})}
										aria-invalid={
											errors.type ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.type?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="work-position"
											value="Position"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={VscTypeHierarchySub}
										id="work-position"
										placeholder="Enter position..."
										{...register('position', {
											required: 'Position is required!',
										})}
										color={errors.position ? 'failure' : ''}
										aria-invalid={
											errors.position ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.position?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="work-start"
											value="Start Date"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={VscCalendar}
										id="work-start"
										placeholder="MM/YYYY"
										{...register('start_date', {
											required: 'Start date is required!',
											pattern: {
												value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
												message:
													'Format must be MM/YYYY!',
											},
										})}
										aria-invalid={
											errors.start_date ? 'true' : 'false'
										}
										color={
											errors.start_date ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.start_date?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="work-end"
											value="End Date"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										color={errors.end_date ? 'failure' : ''}
										icon={VscCalendar}
										id="work-end"
										placeholder="MM/YYYY"
										{...register('end_date', {
											required: 'End date is required!',
											pattern: {
												value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
												message:
													'Format must be MM/YYYY',
											},
										})}
										aria-invalid={
											errors.end_date ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.end_date?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="desc"
											value="Description"
										/>
									</div>
									<Textarea
										className="placeholder:font-ibm-plex-serif resize-none"
										color={errors.desc ? 'failure' : ''}
										id="desc"
										placeholder="Enter description..."
										rows={4}
										{...register('desc', {
											required: 'Description is required',
											minLength: {
												value: 50,
												message:
													'Description must have a minimum of 50 characters!',
											},
											maxLength: {
												value: 2000,
												message:
													'Description must have a maximum of 2000 characters!',
											},
										})}
										aria-invalid={
											errors.desc ? 'true' : 'false'
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.desc?.message}
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

export default WorkExperienceAddForm;
