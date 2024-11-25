import { SetFormErrors } from '@/utils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaIdCardClip } from 'react-icons/fa6';
import { GrOrganization } from 'react-icons/gr';
import { IoIosLink } from 'react-icons/io';
import { RiFullscreenExitLine } from 'react-icons/ri';
import { TbCertificate2 } from 'react-icons/tb';
import { VscCalendar } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CertLicenseAddForm: React.FC<FormProps> = ({
	visibility,
	setVisibility,
}) => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		reset,
	} = useForm<CertLicenseAddProps>({
		resetOptions: {
			keepValues: false,
			keepErrors: false,
		},
	});
	const navigate = useNavigate();

	const onSubmit: SubmitHandler<CertLicenseAddProps> = (data) => {
		const BearerToken = localStorage.getItem('token');

		axios
			.post('/api/cert/add', data, {
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
				SetFormErrors<CertLicenseAddProps>(err, setError);
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
				id="cert-add-form">
				<div
					className="bg-gradient-slate relative left-10 top-8 h-auto w-3/4 rounded-md px-5 py-2 md:left-20 lg:left-48 lg:px-0"
					id="cert-add-body">
					<div className="flex flex-col content-center gap-y-3">
						<div className="flex flex-row justify-around max-sm:flex-wrap md:gap-x-36">
							<div>
								<h1 className="mt-10 font-poppins text-2xl font-bold tracking-wider text-white max-sm:-translate-x-2 lg:text-4xl">
									Add New Certification or License
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
											htmlFor="name"
											value="Name of Certification/License"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										color={errors.name ? 'failure' : ''}
										icon={TbCertificate2}
										id="name"
										placeholder="Enter name..."
										{...register('name', {
											required:
												'Certification/License name is required!',
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
											htmlFor="issuing-org"
											value="Issuing Organization"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={GrOrganization}
										id="issuing-org"
										placeholder="Enter name of Organization..."
										{...register('issuing_org', {
											required:
												'Name of Issuing Organization required!',
										})}
										aria-invalid={
											errors.issuing_org
												? 'true'
												: 'false'
										}
										color={
											errors.issuing_org ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{
														errors.issuing_org
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
											htmlFor="issue-date"
											value="Issuing Date"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={VscCalendar}
										id="issue-date"
										placeholder="MM/YYYY"
										{...register('issue_date', {
											required:
												'Issuing date is required!',
											pattern: {
												value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
												message:
													'Format must be: MM/YYYY',
											},
										})}
										aria-invalid={
											errors.issue_date ? 'true' : 'false'
										}
										color={
											errors.issue_date ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.issue_date?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="issue-exp"
											value="Expiration Date"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={VscCalendar}
										id="issue-exp"
										placeholder="MM/YYYY"
										{...register('issue_exp', {
											pattern: {
												value: /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
												message:
													'Format must be: MM/YYYY',
											},
										})}
										aria-invalid={
											errors.issue_exp ? 'true' : 'false'
										}
										color={
											errors.issue_exp ? 'failure' : ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{errors.issue_exp?.message}
												</p>
											</>
										}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="cred-id"
											value="Credential ID"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={FaIdCardClip}
										id="cred-id"
										placeholder="Enter Credential ID..."
										{...register('credential_id')}
									/>
								</div>
								<div>
									<div className="mb-3 block">
										<Label
											className="font-ibm-plex-serif text-lg text-slate-100"
											htmlFor="cred-url"
											value="Credential URL"
										/>
									</div>
									<TextInput
										autoComplete="off"
										className="placeholder:font-ibm-plex-serif"
										icon={IoIosLink}
										id="cred-url"
										placeholder="Enter url..."
										{...register('credential_url', {
											required:
												'Credential URL is required!',
										})}
										aria-invalid={
											errors.credential_url
												? 'true'
												: 'false'
										}
										color={
											errors.credential_url
												? 'failure'
												: ''
										}
										helperText={
											<>
												<p
													className="font-barlow tracking-wide"
													role="alert">
													{
														errors.credential_url
															?.message
													}
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

export default CertLicenseAddForm;
