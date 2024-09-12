import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaAward } from 'react-icons/fa';
import { FcDiploma1 } from 'react-icons/fc';
import { IoIosLink } from 'react-icons/io';
import { LiaCalendar, LiaUniversitySolid } from 'react-icons/lia';
import { RiFullscreenExitLine, RiGraduationCapLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EducationAddForm: React.FC<FormProps> = ({
	visibility,
	setVisibility,
}) => {
	const [logoFile, setFile] = useState<File | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<InstituteAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<InstituteAddProps> = (data) => {
		setIsProcessing(true);

		const formdata = new FormData();
		const BearerToken = localStorage.getItem('token');

		if (!logoFile) {
			return;
		}

		if (!data.grad_date) {
			data.grad_date = 'undefined';
		}

		if (!data.awards) {
			data.awards = 'N/A';
		}

		formdata.append('file', logoFile);
		formdata.append('other', JSON.stringify(data));

		axios
			.post('/api/education/institute/add', formdata, {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data?.success);
				reset();
				setVisibility(false);

				setTimeout(() => {
					setIsProcessing(false);
					return navigate(0);
				}, 5500);
			})
			.catch((err: AxiosError) => {
				const res = err.response?.data as {
					errors: { [key: string]: string[] };
					error: string;
				};

				if (res.error) {
					toast.error(
						`External Error: "${res.error}". Try again later.`
					);
					return;
				}

				SetFormErrors<InstituteAddProps>(err, setError);
				setIsProcessing(false);
			});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleCancel = () => {
		reset();
		setVisibility(false);
	};

	return (
		<>
			<div
				className={`${visibility ? 'fixed' : 'hidden'} left-0 top-0 z-20 size-full overflow-y-auto bg-slate-950/70`}
				id="education-add-form-overlay">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="education-add-form-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Educational Institution
								</h1>
							</div>
							<div className="lg:place-self-end lg:self-start">
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
											htmlFor="institute-name"
											value="Educational Institution"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={LiaUniversitySolid}
										id="institute-name"
										placeholder="Enter Institution name"
										{...register('name', {
											required:
												'The name of the Institution is required!',
										})}
										aria-invalid={
											errors.name ? 'true' : 'false'
										}
										color={
											errors.name?.message
												? 'failure'
												: ''
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
								<div className="md:flex md:flex-row md:flex-wrap md:justify-evenly md:gap-4">
									<div>
										<div className="block mb-3">
											<Label
												className="text-lg font-ibm-plex-serif text-slate-100"
												htmlFor="start-date"
												value="Start Date (MM/YYYY)"
											/>
										</div>
										<TextInput
											autoComplete="off"
											className="placeholder:font-ibm-plex-serif"
											icon={LiaCalendar}
											id="start-date"
											placeholder="MM/YYYY"
											{...register('start_date', {
												required:
													'A start date is required!',
												pattern: {
													value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
													message:
														'Format must be MM/YYYY!',
												},
											})}
											aria-invalid={
												errors.start_date
													? 'true'
													: 'false'
											}
											color={
												errors.start_date?.message
													? 'failure'
													: ''
											}
											helperText={
												<>
													<p
														className="tracking-wide font-barlow"
														role="alert">
														{
															errors.start_date
																?.message
														}
													</p>
												</>
											}
										/>
									</div>
									<div>
										<div className="block mb-3">
											<Label
												className="text-lg font-ibm-plex-serif text-slate-100"
												htmlFor="grad-date"
												value="Graduation Date (MM/YYYY) (leave blank if still attending)"
											/>
										</div>
										<TextInput
											autoComplete="off"
											className="placeholder:font-ibm-plex-serif"
											icon={LiaCalendar}
											id="grad-date"
											placeholder="MM/YYYY"
											{...register('grad_date', {
												required: false,
												pattern: {
													value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
													message:
														'Format must be MM/YYYY!',
												},
												validate: {
													not_both: (value, values) =>
														(value !== '' &&
															values.expected_date ===
																'') ||
														(value === '' &&
															values.expected_date !==
																'') ||
														'Either expected or Graduation date field must be blank!',
													year_diff: (value, values) => 
														value !== "" && parseInt(value.split("/")[1]) - parseInt(values.start_date.split("/")[1]) >= 4 ||
														'Graduation Date must be at least 4 years apart!',
												}
											})}
											aria-invalid={
												errors.grad_date
													? 'true'
													: 'false'
											}
											color={
												errors.grad_date
													? 'failure'
													: ''
											}
											helperText={
												<>
													<p
														className="tracking-wide font-barlow"
														role="alert">
														{
															errors.grad_date
																?.message
														}
													</p>
												</>
											}
										/>
									</div>
									<div>
										<div className="block mb-3">
											<Label
												className="text-lg font-ibm-plex-serif text-slate-100"
												htmlFor="expected-date"
												value="Expected Graduation Date (MM/YYYY) (leave blank if already graduated)"
											/>
										</div>
										<TextInput
											autoComplete="off"
											className="placeholder:font-ibm-plex-serif"
											icon={LiaCalendar}
											id="expected-date"
											placeholder="MM/YYYY"
											{...register('expected_date', {
												required: false,
												pattern: {
													value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
													message:
														'Format must be MM/YYYY!',
												},
												validate: {
													not_both: (value, values) =>
													(value !== '' &&
														values.grad_date ===
															'') ||
													(value === '' &&
														values.grad_date !==
															'') ||
													'Either expected or Graduation date field must be blank!',
													year_diff: (value, values) =>
														value && value !== "" && parseInt(value.split("/")[1]) - parseInt(values.start_date.split("/")[1]) >= 4 ||
														'Expected Graduation Date must be at least 4 years old',
												}
											})}
											aria-invalid={
												errors.expected_date
													? 'true'
													: 'false'
											}
											color={
												errors.expected_date?.type
													? 'failure'
													: ''
											}
											helperText={
												<>
													<p
														className="tracking-wide font-barlow"
														role="alert">
														{
															errors.expected_date
																?.message
														}
													</p>
												</>
											}
										/>
									</div>
									<div>
										<div className="block mb-3">
											<Label
												className="text-lg font-ibm-plex-serif text-slate-100"
												htmlFor="type"
												value="Institution Type"
											/>
										</div>
										<TextInput
											autoComplete="off"
											className="placeholder:font-ibm-plex-serif"
											icon={LiaUniversitySolid}
											id="type"
											placeholder="e.g. University, High School, etc"
											{...register('institute_type', {
												required:
													'institution type is required!',
											})}
											aria-invalid={
												errors.institute_type
													? 'true'
													: 'false'
											}
											color={
												errors.institute_type
													? 'failure'
													: ''
											}
											helperText={
												<>
													<p
														className="tracking-wide font-barlow"
														role="alert">
														{
															errors
																.institute_type
																?.message
														}
													</p>
												</>
											}
										/>
									</div>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="awards"
											value="Honor & Awards (if applicable)"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={FaAward}
										id="awards"
										placeholder="Enter Honors & Awards..."
										{...register('awards', {
											pattern: {
												value: /^[a-zA-Z0-9 ]+([|][a-zA-Z0-9 ]+)*$/,
												message:
													'Input does not match the pattern: award | award',
											},
										})}
										color={errors.awards ? 'failure' : ''}
										aria-invalid={
											errors.awards ? 'true' : 'false'
										}
										helperText={
											errors.awards ? (
												<>
													<p
														className="tracking-wide font-barlow"
														role="alert">
														{errors.awards?.message}
													</p>
												</>
											) : (
												<>
													<p className="tracking-wide font-barlow text-slate-300">
														format response as:
														&quot;award | award
														...&quot;
													</p>
												</>
											)
										}
									/>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="major"
											value="Major (if applicable)"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={RiGraduationCapLine}
										id="major"
										placeholder="Enter full name of major"
										{...register('major')}
									/>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="degree"
											value="Degree"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={FcDiploma1}
										id="degree"
										placeholder="Enter full degree name"
										{...register('degree', {
											required: 'Degree is required',
										})}
										color={errors.degree ? 'failure' : ''}
										aria-invalid={
											errors.degree ? 'true' : 'false'
										}
										helperText={
											<>
												<p className="tracking-wide font-barlow">
													{errors.degree?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="logo"
											value="Institute Logo"
										/>
									</div>
									<input
										accept="image/*"
										id="logo"
										onChange={handleFileChange}
										type="file"
									/>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="url"
											value="Institution Website URL"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={IoIosLink}
										id="url"
										placeholder="Enter website url..."
										{...register('institute_url', {
											required:
												'Website URL is required!',
										})}
										aria-invalid={
											errors.institute_url
												? 'true'
												: 'false'
										}
										color={
											errors.institute_url
												? 'failure'
												: ''
										}
										helperText={
											<>
												<p
													className="tracking-wide font-barlow"
													role="alert">
													{
														errors.institute_url
															?.message
													}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="block mb-3">
										<Label
											className="text-lg font-ibm-plex-serif text-slate-100"
											htmlFor="short-desc"
											value="Short Description (minimum: 100 characters | maximum: 300 characters)"
										/>
									</div>
									<Textarea
										className="resize-none placeholder:font-ibm-plex-serif"
										id="short-desc"
										placeholder="Enter description..."
										rows={4}
										{...register('small_desc', {
											required:
												'Small description is required',
											minLength: {
												value: 100,
												message:
													'Description must be at minimum 100 characters!',
											},
											maxLength: {
												value: 300,
												message:
													'Description must be at maximum 300 characters!',
											},
										})}
										aria-invalid={
											errors.small_desc ? 'true' : 'false'
										}
										color={
											errors.small_desc ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="tracking-wide font-barlow"
													role="alert">
													{errors.small_desc?.message}
												</p>
											</>
										}
									/>
								</div>
								<div className="flex flex-row content-center justify-evenly">
									<div>
										<Button
											gradientMonochrome="cyan"
											isProcessing={isProcessing}
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

export default EducationAddForm;
