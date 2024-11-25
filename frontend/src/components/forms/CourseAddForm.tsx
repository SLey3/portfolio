import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput, Textarea } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoIosLink } from 'react-icons/io';
import { LiaUniversitySolid } from 'react-icons/lia';
import { MdOutlineClass } from 'react-icons/md';
import { RiFullscreenExitLine } from 'react-icons/ri';
import { SiGoogleclassroom } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseAddForm: React.FC<FormProps> = ({ visibility, setVisibility }) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<CourseAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<CourseAddProps> = (data) => {
		const BearerToken = localStorage.getItem('token');
		axios
			.post('/api/education/courses/add', data, {
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
				SetFormErrors<CourseAddProps>(err, setError);
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
				id="course-add-form-overlay">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="course-add-form-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Course
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
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="course-name"
											value="Name of Course"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={MdOutlineClass}
										id="course-name"
										placeholder="Enter name..."
										{...register('course_name', {
											required:
												'Course name is required!',
										})}
										aria-invalid={
											errors.course_name
												? 'true'
												: 'false'
										}
										color={
											errors.course_name ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{
														errors.course_name
															?.message
													}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="course-id"
											value="Course ID"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={SiGoogleclassroom}
										id="course-id"
										placeholder="IDX-XXXX"
										{...register('course_id', {
											required: 'Course ID is required!',
										})}
										aria-invalid={
											errors.course_id ? 'true' : 'false'
										}
										color={
											errors.course_id ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.course_id?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="course-url"
											value="Course Url"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={IoIosLink}
										id="course-url"
										placeholder="Enter url..."
										{...register('course_url', {
											required: 'Course Url is required!',
										})}
										aria-invalid={
											errors.course_url ? 'true' : 'false'
										}
										color={
											errors.course_url ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.course_url?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="associated-institute"
											value="Course Institution"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={LiaUniversitySolid}
										id="associated-institute"
										placeholder="Enter name of Institution..."
										{...register('associated_institute', {
											required:
												'Institution name is required!',
										})}
										aria-invalid={
											errors.associated_institute
												? 'true'
												: 'false'
										}
										color={
											errors.associated_institute
												? 'failure'
												: ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{
														errors
															.associated_institute
															?.message
													}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-200"
											htmlFor="desc"
											value="Course Description (minimum: 100 characters | maximum: 500 characters)"
										/>
									</div>
									<Textarea
										className="resize-none placeholder:font-ibm-plex-serif"
										id="desc"
										placeholder="Enter description..."
										rows={4}
										{...register('desc', {
											required:
												'Description is required!',
											minLength: {
												value: 100,
												message:
													'Description must have a minimum of 100 characters!',
											},
											maxLength: {
												value: 500,
												message:
													'Description must have a maximum of 500 characters!',
											},
										})}
										color={errors.desc ? 'failure' : ''}
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

export default CourseAddForm;
