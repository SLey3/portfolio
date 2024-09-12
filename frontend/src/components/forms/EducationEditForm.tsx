import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
	Button,
	HR,
	Label,
	TextInput,
	Textarea,
} from 'flowbite-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaAward } from 'react-icons/fa';
import { FcDiploma1 } from 'react-icons/fc';
import { IoIosLink } from 'react-icons/io';
import { LiaCalendar, LiaUniversitySolid } from 'react-icons/lia';
import { RiFullscreenExitLine, RiGraduationCapLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EducationEditForm: React.FC<EditFormProps<InstituteProps>> = ({
	visibility,
	setVisibility,
	formInfo,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<InstituteEditProps>({
		defaultValues: {
			name: formInfo.name,
			start_date: formInfo.start_date,
			grad_date: formInfo.grad_date,
			expected_date: formInfo.expected_date,
			institute_type: formInfo.institute_type,
			awards: formInfo.awards,
			major: formInfo.major,
			degree: formInfo.degree,
			logo_url: formInfo.logo_url,
			institute_url: formInfo.institute_url,
			small_desc: formInfo.small_desc,
		},
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<InstituteEditProps> = (data) => {
		const formdata = new FormData();
		const BearerToken = localStorage.getItem('token');
		const parsed_data = new Map();
		const edited_fields = ['id'];

		parsed_data.set('id', formInfo.id.toString());

		if (data.name) {
			formdata.append('name', data.name);
		}

		if (data.start_date) {
			formdata.append('start_date', data.start_date);
		}

		if (data.grad_date) {
			formdata.append('grad_date', data.grad_date);
		}

		if (data.expected_date) {
			formdata.append('expected_date', data.expected_date);
		}

		if (data.institute_type) {
			formdata.append('institute_type', data.institute_type);
		}

		if (data.awards) {
			formdata.append(
				'awards',
				Array.isArray(data.awards) ? data.awards.join(',') : data.awards
			);
		}

		if (data.major) {
			formdata.append('major', data.major);
		}

		if (data.degree) {
			formdata.append('degree', data.degree);
		}

		if (file) {
			formdata.append('file', file);
			edited_fields.push('logo_url');
		}

		if (data.institute_url) {
			formdata.append('institute_url', data.institute_url);
		}

		if (data.small_desc) {
			formdata.append('small_desc', data.small_desc);
		}

		if (formdata.entries().next().done) {
			return;
		}

		edited_fields.push(...formdata.keys());
		const filtered_fields = edited_fields.filter((val) => val !== 'file');

		for (const pair of formdata.entries()) {
			if (filtered_fields.includes(pair[0])) {
				parsed_data.set(pair[0], pair[1]);
			}
		}

		const obj = Object.fromEntries(parsed_data);

		formdata.append('fields', JSON.stringify(filtered_fields));
		formdata.append('other', JSON.stringify(obj));

		axios
			.put('/api/education/institute/edit', formdata, {
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
					return navigate(0);
				}, 5500);
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 500) {
					toast.error(
						'Something went wrong with the API. Check backend logs. (Status Code 500)'
					);
				}
				SetFormErrors<InstituteEditProps>(err, setError);
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

	const awards = String(formInfo.awards).replace(/,/g, '|');

	return (
		<>
			<div
				className={`${visibility ? 'fixed' : 'hidden'} left-0 top-0 z-20 size-full overflow-y-auto bg-slate-950/70`}
				id="education-edit-form-overlay">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="education-edit-form-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Edit Institute: {formInfo.name}
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
										placeholder={formInfo.name}
										{...register('name')}
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
											placeholder={formInfo.start_date}
											{...register('start_date', {
												required: false,
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
											placeholder={formInfo.grad_date}
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
														value && values.start_date && parseInt(value.split("/")[1]) - parseInt(values.start_date.split("/")[1]) >= 4 ||
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
											placeholder={formInfo.expected_date}
											{...register('expected_date', {
												required: false,
												pattern: {
													value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
													message:
														'Format must be MM/YYYY!',
												},
												validate: (value, values) =>
													(value === '' &&
														values.grad_date ===
															'') ||
													(value !== '' &&
														values.grad_date ===
															'') ||
													(value === '' &&
														values.grad_date !==
															'') ||
													'Either expected or Graduation date field must be blank!',
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
											placeholder={
												formInfo.institute_type
											}
											{...register('institute_type')}
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
										placeholder={awards}
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
										placeholder={formInfo.major}
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
										placeholder={formInfo.degree}
										{...register('degree')}
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
										placeholder={formInfo.institute_url}
										{...register('institute_url')}
										aria-invalid={
											errors.institute_url ? 'true' : 'false'
										}
										color={
											errors.institute_url ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="tracking-wide font-barlow"
													role="alert">
													{errors.institute_url?.message}
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
										placeholder={formInfo.small_desc}
										rows={4}
										{...register('small_desc', {
											required: false,
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

export default EducationEditForm;
