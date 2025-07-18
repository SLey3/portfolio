import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '@/components/Header';

const NewsLetterUnsub: React.FC = () => {
	const [response, setResponse] = useState(
		'Processing unsubscription request...'
	);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		if (!searchParams.get('t')) {
			toast.warning(
				'Unsubscription token is required for request to proceed'
			);
			setResponse('Process Failed.');
			return;
		}

		axios
			.delete('/api/newsletter/unsubscribe', {
				params: {
					t: searchParams.get('t'),
				},
			})
			.then((res: AxiosResponse) => {
				toast.success(res.data.success);
				setResponse('Request fulfilled. You may close this tab now.');
			})
			.catch((err: AxiosError<NewsLetterUnSubReqError>) => {
				if (err.response?.data.error) {
					toast.error(err.response?.data.error);
					setResponse('Request ended with error!');
					return;
				} else if (err.response?.data.expired) {
					toast.error(err.response?.data.expired);
					setResponse(
						'Request ended with error due to expired or non valid token'
					);
					return;
				} else {
					toast.error('Unknown issue occurred with request.');
					setResponse(
						'Request ended with unknown error. Please try again later!'
					);
					console.error(err.response?.data);
				}
			});
	}, [searchParams]);

	return (
		<>
			<Header
				desc="Unsubscribe from Newsletter"
				title="Request For Unsubscription"
			/>
			<div className="container mx-auto">
				<div className="text-wrap py-52 font-poppins text-6xl leading-relaxed tracking-wide text-white">
					{response.slice(0, -3)}
					<span
						className={
							response.slice(-3) === '...'
								? 'animate-pulse delay-150'
								: ''
						}>
						{response.slice(-3)}
					</span>
				</div>
			</div>
			<ToastContainer
				autoClose={5000}
				closeButton={false}
				closeOnClick={false}
				draggable={false}
				hideProgressBar={false}
				limit={1}
				newestOnTop={false}
				pauseOnFocusLoss={false}
				pauseOnHover={false}
				position="bottom-center"
				rtl={false}
				theme="dark"
				transition={Zoom}
			/>
		</>
	);
};

export default NewsLetterUnsub;
