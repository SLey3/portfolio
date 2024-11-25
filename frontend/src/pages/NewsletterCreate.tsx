import Header from '@/components/Header';
import TextEditor from '@/components/editor';
import ProtectedComponent from '@/components/protected';
import useAuthToken from '@/utils/hooks/use-auth-token';
import { useTempEditor } from '@/utils/hooks/use-temp-editor';
import { useTextEditor } from '@/utils/plate/editor';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
	Button,
	type CustomFlowbiteTheme,
	FloatingLabel,
	Flowbite,
	Label,
	Modal,
} from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaFirstdraft } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsletterCreateTheme: CustomFlowbiteTheme = {
	floatingLabel: {
		input: {
			default: {
				outlined: {
					sm: 'peer block w-full appearance-none rounded-lg border bg-transparent px-2.5 pb-2.5 pt-4 text-xs focus:outline-none focus:ring-0 border-gray-600 text-white focus:border-blue-500',
				},
			},
		},
		label: {
			default: {
				outlined: {
					sm: 'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-slate-700 px-2 text-xs text-slate-200 transition-transform duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500',
				},
			},
		},
	},
	modal: {
		root: {
			show: {
				on: 'flex bg-gray-900 bg-opacity-80',
			},
		},
		content: {
			inner: 'relative flex max-h-[90dvh] flex-col rounded-lg bg-gray-700 shadow',
		},
		header: {
			base: 'flex items-start justify-between rounded-t border-b p-5 border-gray-600',
			title: 'text-xl font-medium text-white',
			close: {
				base: 'ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-600 hover:text-white',
			},
		},
		footer: {
			base: 'flex items-center space-x-2 rounded-b border-gray-600 p-6',
		},
	},
};

const NewsletterSend: React.FC = () => {
	const [submitAsDraft, setSubmitAsDraft] = useState(false);
	const [draftTitle, setDraftTitle] = useState<undefined | string>(undefined);
	const [openDraft, setOpenDraft] = useState(false);
	const navigate = useNavigate();
	const {
		register,
		formState: { errors },
		handleSubmit,
	} = useForm<NewsLetterCreateForm>();

	const BearerToken = useAuthToken();

	const editor = useTextEditor();
	const tmpEditor = useTempEditor();

	useEffect(() => {
		axios
			.get('/api/newsletter/draft', {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
				},
			})
			.then((res: AxiosResponse) => {
				if (res.status === 204) {
					return;
				}

				setOpenDraft(true);
				editor.children = JSON.parse(res.data.content);
				setDraftTitle(res.data.title);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	}, [editor, BearerToken]);

	const serializeEditorContent = () => {
		return tmpEditor.api.htmlReact.serialize({
			nodes: editor.children,
			dndWrapper: (props) => (
				<DndProvider backend={HTML5Backend} {...props} />
			),
		});
	};

	const onSubmit: SubmitHandler<NewsLetterCreateForm> = ({ title }, e) => {
		e?.preventDefault();
		console.log('submitting: ', editor.children);
		if (
			editor.children.length === 1 &&
			editor.children[0].id === '1' &&
			editor.children[0].type === 'p' &&
			editor.children[0].children.length === 1 &&
			editor.children[0].children[0].text === ''
		) {
			console.log('empty editor');
			return;
		}

		if (submitAsDraft) {
			const payload = {
				content: JSON.stringify(editor.children),
				title: title,
			};

			axios
				.post('/api/newsletter/draft', payload, {
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				})
				.then(() => {
					toast.success('Saved Newsletter as Draft! \u{1F389}');

					setTimeout(() => {
						return navigate('/admin/management');
					}, 5500);
				})
				.catch((err: AxiosError) => {
					toast.error('An error occurred. Please try again Later');
					console.error(err.response?.data);
				});
		} else {
			console.log('sending newsletter. converting content to html');

			const html = serializeEditorContent();

			console.log('html: ', html);

			const payload = {
				content: html,
				title: title,
			};

			axios
				.post('/api/newsletter/send', payload, {
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				})
				.then(() => {
					toast.success('Newsletter sent out! \u{1F389}');

					setTimeout(() => {
						return navigate('/admin/management');
					}, 5000);
				})
				.catch((err: AxiosError) => {
					toast.error(
						'Something went wrong when sending the newsletter'
					);
					console.error(err.response?.data);
				});
		}
	};

	const handleDraftModalNoCleanOpt = () => {
		axios
			.delete('/api/newsletter/draft', {
				headers: {
					Authorization: `Bearer ${BearerToken}`,
				},
			})
			.then(() => {
				toast.success('Draft successfully deleted! \u{1F389}');
				if (setOpenDraft) {
					setOpenDraft(false);
				}
				toast.info('Reloading for clean slate!', {
					closeButton: false,
					closeOnClick: false,
				});

				setTimeout(() => {
					return navigate(0);
				}, 5000);
			})
			.catch((err: AxiosError) => {
				toast.error('Something went wrong. Please try again later.');
				console.error(err.response?.data);
				if (setOpenDraft) {
					setOpenDraft(false);
				}
			});
	};

	return (
		<>
			<ProtectedComponent>
				<Flowbite theme={{ theme: NewsletterCreateTheme }}>
					<div className="p-5">
						<Button
							as={Link}
							gradientMonochrome="cyan"
							pill
							to="/admin/management">
							Back
						</Button>
					</div>
					<Header
						desc="Space to create editor or continue the draft of one"
						title="Create & Send Newsletter"
					/>
					{}
					<form
						className="container mx-auto pb-10"
						id="form-container"
						onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col content-center gap-y-5">
							<div>
								<FloatingLabel
									color={errors.title ? 'error' : 'default'}
									label="Newsletter Title"
									placeholder={draftTitle ? draftTitle : ''}
									sizing="sm"
									variant="outlined"
									{...register('title', {
										required: draftTitle ? false : true,
									})}
								/>
							</div>
							<div>
								<div className="block pb-3">
									<Label
										className="font-barlow text-2xl font-semibold tracking-tight text-slate-200"
										value="Newsletter Body"
									/>
								</div>
								<TextEditor
									editor={editor}
									footerText="Subscriber's will receive this newsletter"
								/>
							</div>
							<div className="flex flex-col content-center gap-6 md:flex-row md:justify-evenly">
								<div>
									<Button
										gradientDuoTone="purpleToBlue"
										pill
										type="submit">
										<FiSend className="mr-2 size-5" /> Send
									</Button>
								</div>
								<div>
									<Button
										gradientDuoTone="cyanToBlue"
										onClick={() => setSubmitAsDraft(true)}
										pill
										type="submit">
										<FaFirstdraft className="ml-2 size-5" />{' '}
										Save as Draft
									</Button>
								</div>
								<div>
									<Button
										as={Link}
										color="dark"
										outline
										pill
										to="/admin/management">
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</form>
					<Modal show={openDraft}>
						<Modal.Header>Open Draft?</Modal.Header>
						<Modal.Body>
							<p className="font-barlow tracking-tight text-slate-100">
								A current draft has been detected. Would you
								like to Open it, start clean, or return back to
								Admin Dashboard?
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button
								onClick={() => {
									if (setOpenDraft) {
										setOpenDraft(false);
									}
								}}>
								Yes
							</Button>
							<Button
								color="gray"
								onClick={() => handleDraftModalNoCleanOpt()}>
								No, Start Clean
							</Button>
							<Button
								as={Link}
								color="gray"
								outline
								to="/admin/management"
								onClick={() => {
									if (setOpenDraft) {
										setOpenDraft(false);
									}
								}}>
								Return to Admin Dashboard
							</Button>
						</Modal.Footer>
					</Modal>
					<ToastContainer
						autoClose={5000}
						closeButton
						closeOnClick
						draggable={false}
						hideProgressBar={false}
						limit={2}
						newestOnTop
						pauseOnFocusLoss={false}
						pauseOnHover={false}
						position="bottom-right"
						rtl={false}
						theme="dark"
						transition={Zoom}
					/>
				</Flowbite>
			</ProtectedComponent>
		</>
	);
};

export default NewsletterSend;
