import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, HR } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { CiSquarePlus } from 'react-icons/ci';
import { Link } from 'react-router-dom';

import WebFooter from '@/components/Footer';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';

const BlogPosts: React.FC = () => {
	const [content, setContent] = useState<BlogList[] | null>(null);
	const [blogLimit, setBlogLimit] = useState(5);
	const [blogCount, setBlogCount] = useState(null);
	const [cookies] = useCookies(['user']);

	useEffect(() => {
		axios
			.get('/api/blog', {
				params: {
					tp: blogLimit,
				},
			})
			.then((res: AxiosResponse) => {
				setContent(res.data?.blogs);
				setBlogCount(res.data?.blog_count);
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	}, [blogLimit]);

	return (
		<>
			<NavBar />
			<Header
				desc="Blogging about updates, news, information on my projects or anything of importance"
				title="Blogs"
			/>
			<div className="space-y-10 pb-10">
				{cookies.user ? (
					<Button
						as={Link}
						gradientMonochrome="cyan"
						outline
						pill
						size="lg"
						to="/blog/add">
						Add Blog <CiSquarePlus className="size-6" />
					</Button>
				) : null}
				<div className="flex flex-col content-center">
					{content
						? content.map((blog) => {
								return (
									<div
										className="pl-1 md:pl-10"
										key={blog.id}>
										<div className="flex size-full flex-col flex-wrap gap-y-2 rounded-lg pl-10 hover:border-2 hover:border-slate-200 hover:bg-slate-100/5 md:size-8/12 xl:size-1/2">
											<div className="font-poppins text-2xl font-bold text-white max-sm:max-w-60 md:px-5 md:pt-5">
												{blog.title}
											</div>
											<div className="text wrap font-ibm-plex-serif text-xs tracking-tight text-slate-300 md:pl-5">
												{blog.created_at}
											</div>
											<div className="line-clamp-5 text-wrap font-cormorant-garamond text-sm font-extralight leading-7 tracking-wide text-slate-100 max-sm:max-w-56 md:line-clamp-3 md:pl-5 md:pr-10">
												{blog.desc}
											</div>
											<div className="pb-5 max-sm:max-w-56 md:pl-5 md:pr-10">
												<Link
													className="font-mono text-sm text-slate-100 after:content-link hover:text-cyan-300"
													to={`/blog/view?id=${blog.id}`}>
													Open Blog
												</Link>
											</div>
										</div>
										<HR.Trimmed className="relative md:right-10 md:ps-96 lg:right-44 xl:right-96" />
									</div>
								);
							})
						: null}
					{blogCount !== null &&
					(blogLimit === blogCount || blogCount < blogLimit) ? (
						<>
							<Button
								className="max-w-prose md:translate-x-10"
								color="gray"
								onClick={() => setBlogLimit(5)}
								outline
								pill
								size="md">
								Reset List
							</Button>
						</>
					) : (
						<>
							<Button
								className="max-w-prose md:translate-x-10"
								gradientMonochrome="cyan"
								onClick={() => setBlogLimit((l) => l + 5)}
								pill
								size="md">
								More
							</Button>
						</>
					)}
				</div>
			</div>
			<WebFooter />
		</>
	);
};

export default BlogPosts;
