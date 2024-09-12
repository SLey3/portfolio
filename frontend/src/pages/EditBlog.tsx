import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import TextEditor from '@/components/editor';
import ProtectedComponent from '@/components/protected';
import { SetFormErrors } from '@/utils';
import type { Value } from '@udecode/plate-common';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { Button, Checkbox, Label, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBlog: React.FC = () => {
	const [blogInfo, setBlogInfo] = useState<BlogList | null>(null);
	const [blogContent, setBlogContent] = useState<Value>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<BlogEditProps>({
		defaultValues: {
			title: blogInfo?.title,
			desc: blogInfo?.desc,
			is_draft: blogInfo?.is_draft,
		},
	});
	const { blogId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const BearerToken = localStorage.getItem('token');
		axios
			.get('/api/blog/singular', {
				params: {
					id: blogId,
					edit: true,
				},
				headers: {
					Authorization: `Bearer ${BearerToken}`,
				},
			})
			.then((res: AxiosResponse) => {
				setBlogInfo(res.data);
				toast.info('blog data loaded!');
			})
			.catch((err: AxiosError) => {
				const res = err.response?.data as {
					error: string;
				};
				toast.error(res.error);
				console.error(err.response?.data);
			});
	}, [blogId]);

	const onSubmit: SubmitHandler<BlogEditProps> = (data) => {
		if (!blogInfo) {
			return;
		}

		setIsProcessing(true);
		const formdata = new FormData();
		const mod_content = JSON.stringify(blogContent).trim();
		const cur_content = JSON.stringify(blogInfo?.content).trim();
		const fields = ['id'];
		const BearerToken = localStorage.getItem('token');

		console.log(mod_content);

		if (data.title !== blogInfo?.title && data.title) {
			formdata.append('title', data.title);
		}

		if (data.desc !== blogInfo?.desc && data.desc) {
			formdata.append('desc', data.desc);
		}

		if (data.is_draft !== blogInfo?.is_draft) {
			formdata.append('is_draft', `${data.is_draft}`);
		}

		if (mod_content !== cur_content) {
			formdata.append('content', mod_content);

			// TODO: revise this for a better detection if an image got removed and/or added
			if (mod_content.match(/,"type":"img",/)) {
				formdata.append('has_img', 'True');
			} else {
				if (cur_content.match(/,"type":"img",/)) {
					console.log('current blog had img when mod_blog did not');
					formdata.append('img_del', 'True');
					formdata.append('cur_data', cur_content);
				}
			}
		}

		if (formdata.entries().next().done) {
			setTimeout(() => {
				setIsProcessing(false);
				return;
			}, 1000);
		}

		fields.push(...formdata.keys());

		formdata.append('fields', JSON.stringify(fields));
		formdata.append('id', blogInfo.id.toString());

		axios
			.put('/api/blog/edit', formdata, {
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
				}, 5500);
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === 500) {
					toast.error(
						'(backend failure) Something went wrong. Check Backend logs.'
					);
					return;
				}

				SetFormErrors<BlogEditProps>(err, setError);
				setIsProcessing(false);
			});
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
				{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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
							editValues={blogInfo.content}
							setContent={setBlogContent}
						/>
					) : null}
					<div className="px-3 py-5">
						<Checkbox
							defaultChecked={blogInfo?.is_draft}
							id="is-draft"
							{...register('is_draft')}
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
								to={`/blog/view?id=${blogInfo?.id}`}>
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
