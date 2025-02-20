import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TextEditor from '@/components/editor';
import ProtectedComponent from '@/components/protected';
import useAuthToken from '@/utils/hooks/use-auth-token';
import { useTextEditor } from '@/utils/plate/editor';
import axios, { AxiosError } from 'axios';
import { Button, Checkbox, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import {
	Link,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatEditorContent, serializeEditorContent } from '@/utils/editorUtils';
import { getErrorMessage } from '@/utils/errorUtils';
import { APIErrorResponse, BlogApiResponse } from '@/types/api';

const EditBlog: React.FC = () => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [blogInfo, setBlogInfo] = useState<BlogList | null>(null);
	const {
		register,
		formState: { errors },
		handleSubmit,
		control,
	} = useForm<BlogEditProps>();
	const { blogId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const BearerToken = useAuthToken();
	const editor = useTextEditor();

	useEffect(() => {
		if (!editor || !blogId || !BearerToken) return;

		axios.get<BlogApiResponse>(`/api/blog/singular?id=${blogId}&edit=true`, {
			headers: { Authorization: BearerToken }
		})
			.then((res) => {
				setBlogInfo(res.data);
				const formattedContent = formatEditorContent(res.data.content);
				editor.children = formattedContent;
				toast.success('Blog loaded successfully');
			})
			.catch((err: AxiosError<APIErrorResponse>) => {
				const errorMsg = getErrorMessage(err);
				toast.error(errorMsg);
				console.error('Error loading blog:', err.response?.data || err);
			});
	}, [editor, BearerToken, blogId]);

	const onSubmit: SubmitHandler<BlogEditProps> = (data) => {
		setIsProcessing(true);
		try {
			const formattedContent = serializeEditorContent(editor.children);
			
			const payload = {
				...data,
				content: formattedContent,
			};

			axios.put(`/api/blog/edit?id=${blogId}`, payload, {
				headers: { Authorization: BearerToken },
			})
				.then((response) => {
					toast.success('Blog updated successfully');
					setIsProcessing(false);
					navigate('/blog');
				})
				.catch((err: AxiosError<APIErrorResponse>) => {
					const errorMsg = getErrorMessage(err);
					toast.error(errorMsg);
					console.error('Error updating blog:', err.response?.data || err);
					setIsProcessing(false);
				});
		} catch (error) {
			toast.error('Failed to prepare blog content for submission');
			console.error('Error preparing blog content:', error);
		}
	};

	return (
		<>
			<NavBar />
			<ProtectedComponent fallbackUrl={`/blog/view?id=${blogId}`}>
				<Header
					desc={`Selected Blog: "${blogInfo?.title}" | Draft Status: ${blogInfo?.is_draft}`}
					title="Edit Blog"
				/>
				{/* prettier-ignore */}
				{}
				<form onSubmit={handleSubmit(onSubmit)}>
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
								placeholder={blogInfo?.title}
								{...register('title')}
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
								className="resize-none placeholder:font-cormorant-garamond"
								id="desc"
								placeholder={blogInfo?.desc}
								rows={4}
								{...register('desc', {
									required: false,
									maxLength: {
										value: 1000,
										message:
											'Description must be a maximum of 1000 characters!',
									},
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
					{blogInfo ? (
						<TextEditor
							editor={editor}
							footerText={`editing blog: ${blogInfo.title}`}
						/>
					) : null}
					<div className="px-3 py-5">
						<Controller
							control={control}
							defaultValue={blogInfo?.is_draft ? false : true}
							name="is_draft"
							render={({ field: { onChange, value } }) => (
								<Checkbox
									checked={value}
									id="is-draft"
									onChange={onChange}
								/>
							)}
						/>
						<Label
							className="px-3 font-barlow text-white"
							htmlFor="is-draft">
							Save as Draft?
						</Label>
					</div>
					<div className="flex flex-col justify-center gap-10 py-10 md:flex-row md:flex-wrap md:justify-evenly">
						<div>
							<Button
								gradientDuoTone="cyanToBlue"
								isProcessing={isProcessing ? true : false}
								pill
								size="sm"
								type="submit">
								Confirm Edit
							</Button>
						</div>
						<div>
							<Button
								as={Link}
								color="gray"
								pill
								size="sm"
								to={
									searchParams.get('f_a') === 'true'
										? '/admin/management'
										: `/blog/view?id=${blogInfo?.id}`
								}>
								Cancel
							</Button>
						</div>
					</div>
				</form>
			</ProtectedComponent>
			<WebFooter />
			<ToastContainer
				autoClose={5000}
				closeButton
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

export default EditBlog;
