import WebFooter from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, Label, TextInput } from 'flowbite-react';
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login: React.FC = () => {
	const [cookies, setCookie] = useCookies(['user']);
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
	} = useForm<LoginForm>();
	const navigate = useNavigate();

	useEffect(() => {
		if (cookies.user) {
			return navigate('/admin/management');
		}
	}, [cookies.user, navigate]);

	const onSubmit: SubmitHandler<LoginForm> = (data) =>
		axios
			.post('/api/admin/login', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res: AxiosResponse) => {
				setCookie('user', res.data?.user, { path: '/' });
				localStorage.setItem('token', res.data?.bearer);

				return navigate('/admin/management');
			})
			.catch(
				(err: AxiosError<{ error?: string; errors?: FormErrRes }>) => {
					if (err.response?.data?.error) {
						toast.error(err.response?.data?.error);
					}
					SetFormErrors(err, setError);
				}
			);

	return (
		<>
			<NavBar />
			<div className="container mx-auto">
				<div className="flex flex-col flex-wrap content-center gap-y-6 py-52">
					<div>
						<h1 className="font-poppins text-4xl font-semibold tracking-wide text-white">
							Administrator Login
						</h1>
					</div>
					<div>
						{/* prettier-ignore */}
						{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
						<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
							<div>
								<div className="mb-3 block">
									<Label
										className="font-ibm-plex-serif text-lg text-slate-100"
										htmlFor="email"
										value="Email"
									/>
								</div>
								<TextInput
									autoComplete="off"
									color={errors.email ? 'failure' : ''}
									icon={FaUser}
									id="email"
									placeholder="Enter email..."
									{...register('email', {
										required: 'Email is required!',
									})}
									aria-invalid={
										errors.email ? 'true' : 'false'
									}
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
										className="font-ibm-plex-serif text-lg text-slate-100"
										htmlFor="pwd"
										value="Password"
									/>
								</div>
								<TextInput
									autoComplete="off"
									color={errors.password ? 'failure' : ''}
									icon={RiLockPasswordFill}
									id="pwd"
									placeholder="Enter password..."
									type="password"
									{...register('password', {
										required: 'Password is required!',
									})}
									aria-invalid={
										errors.password ? 'true' : 'false'
									}
									helperText={
										<>
											<p
												className="font-barlow tracking-wide"
												role="alert">
												{errors.password?.message}
											</p>
										</>
									}
								/>
							</div>
							<div>
								<Button
									className="w-full"
									gradientDuoTone="cyanToBlue"
									pill
									size="lg"
									type="submit">
									Log In
								</Button>
							</div>
						</form>
					</div>
				</div>
			</div>
			<WebFooter />
			<ToastContainer
				autoClose={5000}
				closeButton
				closeOnClick={false}
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
		</>
	);
};

export default Login;
