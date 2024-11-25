import WebFooter from '@/components/Footer';
import NavBar from '@/components/NavBar';
import BlogViewer from '@/components/render-blog';
import useAuthToken from '@/utils/hooks/use-auth-token';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewBlog: React.FC = () => {
	const [blog, setBlog] = useState<BlogList | null>(null);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [cookies] = useCookies(['user']);
	const BearerToken = useAuthToken();

	useEffect(() => {
		axios
			.get('/api/blog/singular', {
				params: {
					id: searchParams.get('id'),
				},
			})
			.then((res: AxiosResponse) => {
				setBlog(res.data);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	}, [searchParams]);

	useEffect(() => {
		const editDiv = document.getElementById('edit');
		const deleteDiv = document.getElementById('delete');
		const footer = document.getElementById('web-footer');
		const navbar = document.getElementById('web-navbar');

		if (editDiv && deleteDiv && footer && navbar) {
			const footerHeight = footer.offsetHeight;
			const navbarHeight = navbar.offsetHeight;

			const body_height =
				window.innerHeight - (footerHeight + navbarHeight);
			const calculated_height = `${body_height / 3}px`;

			editDiv.style.top = calculated_height;
			deleteDiv.style.top = calculated_height;
		}
	}, []);

	const handleBlogDelete = useCallback(
		(blogId: number) => {
			axios
				.delete('/api/blog/delete', {
					data: {
						id: blogId,
					},
					headers: {
						Authorization: `Bearer ${BearerToken}`,
						'Content-Type': 'application/json',
					},
				})
				.then((res: AxiosResponse) => {
					toast.success(res.data?.success);

					setTimeout(() => {
						return navigate('/blog');
					}, 5500);
				})
				.catch((err: AxiosError) => {
					toast.error(
						'Error occured during deletion process. Try again later'
					);
					console.error(err.response?.data);
				});
		},
		[navigate, BearerToken]
	);

	return (
		<>
			<NavBar />
			<br />
			<div className="container mx-auto max-w-64 select-none md:max-w-lg lg:max-w-2xl xl:max-w-5xl">
				{blog?.content ? <BlogViewer content={blog?.content} /> : null}
			</div>
			{cookies.user ? (
				<div className="py-10 max-sm:flex max-sm:flex-row max-sm:justify-center max-sm:gap-x-8 md:py-0">
					<div className="md:fixed md:left-[5.9%]" id="edit">
						<Link to={`/blog/edit/${blog?.id}`}>
							<FaPencilAlt
								aria-label="Edit Blog"
								className="cursor-pointer text-xl text-white hover:text-amber-300 md:text-3xl"
							/>
						</Link>
					</div>
					<div className="md:fixed md:right-[5.9%]" id="delete">
						<FaTrashAlt
							aria-label="Delete Blog"
							className="cursor-pointer text-xl text-white hover:text-red-300 md:text-3xl"
							onDoubleClick={() =>
								handleBlogDelete(blog?.id as number)
							}
						/>
					</div>
				</div>
			) : null}
			<br />
			<WebFooter />
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
				position="bottom-right"
				rtl={false}
				theme="dark"
				transition={Zoom}
			/>
		</>
	);
};

export default ViewBlog;
