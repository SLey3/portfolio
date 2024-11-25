import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TextEditor from '@/components/editor';
import ProtectedComponent from '@/components/protected';
import useAuthToken from '@/utils/hooks/use-auth-token';
import { useTextEditor } from '@/utils/plate/editor';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogAdd: React.FC = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDraft, setIsDraft] = useState(false);
	const navigate = useNavigate();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<BlogAddFormProps>();
	const BearerToken = useAuthToken();
	const editor = useTextEditor();

	const onSubmit: SubmitHandler<BlogAddFormProps> = (data) => {
		setIsProcessing(true);
		const formdata = new FormData();

		formdata.append('title', data.title);
		formdata.append('content', JSON.stringify(editor.children));
		formdata.append('desc', data.desc);
		formdata.append('is_draft', `${isDraft}`);

		axios
			.post('/api/blog/add', formdata, {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data?.success);
				setIsProcessing(false);

				setTimeout(() => {
					return navigate('/blog');
				}, 2000);
			})
			.catch((err: AxiosError) => {
				toast.error(JSON.stringify(err.response?.data));
				console.error(err.response?.data);
				setIsProcessing(false);
			});
	};

	return (
		<>
			<ProtectedComponent fallbackUrl="/blog">
				<NavBar />
				<Header desc="Blog Post Creation Page" title="Add Blog Post" />
				{/* prettier-ignore */}
				<form onSubmit={handleSubmit(onSubmit)}> { }
					<div className="container mx-auto space-y-5 py-5">
						<div>
							<div className="mb-3 block">
								<Label
									className="font-cormorant-garamond text-lg text-slate-100"
									htmlFor="title"
									value="Title"
								/>
							</div>
							<TextInput
								autoComplete="off"
								className="placeholder:font-cormorant-garamond"
								id="title"
								placeholder="Enter title..."
								{...register("title", {
									required: 'Title is required!',
								})}
								aria-invalid={errors.title ? 'true' : 'false'}
								color={errors.title ? 'failure' : ''}
								helperText={
									<>
										<p
											className="font-barlow tracking-wide"
											role="alert">
											{errors.title?.message}
										</p>
									</>
								}
							/>
						</div>
						<div>
							<div className="mb-3 block">
								<Label
									className="font-cormorant-garamond text-lg text-slate-100"
									htmlFor="desc"
									value="Short Description (maximum 1000 characters)"
								/>
							</div>
							<Textarea
								autoComplete="off"
								className="placeholder:font-cormorant-garamond resize-none"
								id="desc"
								placeholder="Enter Description..."
								rows={2}
								{...register('desc', {
									required: 'Description is required!',
									maxLength: {
										value: 1000,
										message: 'Description must be a maximum of 1000 characters!',
									}
								})}
								aria-invalid={errors.desc ? 'true' : 'false'}
								color={errors.desc ? 'failure' : ''}
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
					</div>
					<TextEditor editor={editor} />
					<div className="flex flex-col justify-center gap-10 py-10 md:flex-row md:flex-wrap md:justify-evenly">
						<div>
							<Button
								gradientDuoTone="cyanToBlue"
								isProcessing={isProcessing ? true : false}
								pill
								size="sm"
								type="submit">
								Upload Blog
							</Button>
						</div>
						<div>
							<Button
								gradientDuoTone="cyanToBlue"
								isProcessing={isProcessing ? true : false}
								onClick={() => setIsDraft(true)}
								outline
								pill
								size="sm"
								type="submit">
								Save as Draft
							</Button>
						</div>
						<div>
							<Button
								as={Link}
								color="gray"
								pill
								size="sm"
								to="/blog">
								Cancel
							</Button>
						</div>
					</div>
				</form>
				<WebFooter />
				<ToastContainer
					autoClose={1500}
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
			</ProtectedComponent>
		</>
	);
};

export default BlogAdd;
