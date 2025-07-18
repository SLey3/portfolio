import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Label, Select, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MdAlternateEmail, MdSend } from 'react-icons/md';
import { ToastContainer, Zoom, toast } from 'react-toastify';

import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Section from '@/components/section';

const Contact: React.FC = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		control,
	} = useForm<ContactForm>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});

	const onSubmit: SubmitHandler<ContactForm> = (data) => {
		axios
			.post('/api/contact/send', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res: AxiosResponse) => {
				setIsProcessing(true);
				toast.success(res.data?.success);
				reset();
				setIsProcessing(false);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
				toast.error('Something went wrong with the request');
			});
	};

	return (
		<>
			<NavBar />
			<Header
				desc="Want to reach out to me? Fill out the following form to contact me!"
				title="Contact Me"
			/>
			<Section col header={false} with_hr>
				{/* prettier-ignore */}
				<form
					className="space-y-4 pl-10 text-black"
					onSubmit={handleSubmit(onSubmit)}> { }
					<div>
						<div className="mb-3 block">
							<Label
								className="text-lg text-slate-100"
								color={errors.name ? 'failure' : ''}
								htmlFor="name">
								Name <span className="text-red-500">*</span>
							</Label>
						</div>
						<TextInput
							id="name"
							placeholder="Enter name..."
							{...register('name', {
								required: 'Name is required!',
							})}
							aria-invalid={errors.name ? 'true' : 'false'}
							color={errors.name ? 'failure' : ''}
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
								className="text-lg text-slate-100"
								color={errors.email ? 'failure' : ''}
								htmlFor="email">
								Email <span className="text-red-500">*</span>
							</Label>
						</div>
						<TextInput
							icon={MdAlternateEmail}
							id="email"
							placeholder="name@example.com"
							{...register('email', {
								required: 'Email is required!',
								pattern: {
									value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: 'Not a valid email!',
								},
							})}
							aria-invalid={errors.email ? 'true' : 'false'}
							color={errors.email ? 'failure' : ''}
							helperText={
								<>
									<p
										className="font-barlow tracking-wide"
										role="alert">
										{errors.email?.message}
									</p>
								</>
							}
						/>
					</div>
					<div>
						<div className="mb-3 block">
							<Label
								className="text-lg text-slate-100"
								htmlFor="contact-type"
								value="Who are you?"
							/>
						</div>
						<Controller
							control={control}
							defaultValue="default"
							name="contact_type"
							render={({
								field: { value, onChange, ...field },
							}) => {
								return (
									<Select
										onChange={onChange}
										value={value}
										{...field}>
										<option value="default">
											Select one of the options (optional)
										</option>
										<option value="visitor">Visitor</option>
										<option value="recruiter">
											Recruiter
										</option>
									</Select>
								);
							}}
						/>
					</div>
					<div>
						<div className="mb-3 block">
							<Label
								className="text-lg text-slate-100"
								htmlFor="msg-subject">
								Subject <span className="text-red-500">*</span>
							</Label>
						</div>
						<TextInput
							autoComplete="off"
							id="msg-subject"
							placeholder="Subject"
							{...register('msg_subject', {
								required: 'Subject is required!',
							})}
							aria-invalid={errors.msg_subject ? 'true' : 'false'}
							color={errors.msg_subject ? 'failure' : ''}
							helperText={
								<>
									<p
										className="font-barlow tracking-wide"
										role="alert">
										{errors.msg_subject?.message}
									</p>
								</>
							}
						/>
					</div>
					<div>
						<div className="mb-3 block">
							<Label
								className="text-lg text-slate-100"
								color={errors.msg_body ? 'failure' : ''}
								htmlFor="msg-body">
								Message <span className="text-red-500">*</span>
							</Label>
						</div>
						<Textarea
							autoComplete="off"
							className="resize-none"
							id="msg-body"
							placeholder="Enter message..."
							rows={12}
							{...register('msg_body', {
								required: 'Message is required!',
							})}
							aria-invalid={errors.msg_body ? 'true' : 'false'}
							color={errors.msg_body ? 'failure' : ''}
							helperText={
								<>
									<p
										className="font-barlow tracking-wide"
										role="alert">
										{errors.msg_body?.message}
									</p>
								</>
							}
						/>
					</div>
					<div className="flex flex-row content-center gap-x-6 pl-2">
						<div>
							<Button
								gradientDuoTone="cyanToBlue"
								isProcessing={isProcessing}
								size="lg"
								type="submit">
								Send
								<MdSend className="ml-2 size-5" />
							</Button>
						</div>
						<div>
							<Button onClick={() => reset()} outline>
								Reset Form
							</Button>
						</div>
					</div>
				</form>
				<div className="pl-10 pt-10">
					<p className="font-ibm-plex-serif italic tracking-tight text-slate-100">
						For larger inquires, feel free contact me at:{' '}
						<a
							className="text-sky-300 underline decoration-sky-300 underline-offset-1"
							href="mailto:contact@sleylanguren.com">
							contact@sleylanguren.com
						</a>
					</p>
				</div>
			</Section>
			<WebFooter />
			<ToastContainer
				autoClose={1000}
				closeButton={false}
				closeOnClick
				draggable={false}
				hideProgressBar={false}
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

export default Contact;
