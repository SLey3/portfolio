import axios, { AxiosError } from 'axios';
import { Dropdown, Flowbite, Navbar } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import React from 'react';
import { useCookies } from 'react-cookie';
import { BiCarousel } from 'react-icons/bi';
import { FaPersonCircleExclamation } from 'react-icons/fa6';
import { GoProjectRoadmap } from 'react-icons/go';
import { useLocation, useNavigate } from 'react-router-dom';

const navbarAdjustments: CustomFlowbiteTheme = {
	navbar: {
		root: {
			base: 'bg-transparent px-2 py-2.5 sm:px-4',
		},
		link: {
			active: {
				on: 'text-center font-barlow bg-cyan-700 text-white dark:text-white md:bg-transparent md:text-cyan-700',
				off: 'text-center font-barlow border-b border-slate-100 text-slate-500 hover:bg-slate-50 md:border-0 md:hover:bg-transparent md:hover:text-cyan-700',
			},
		},
	},
	dropdown: {
		floating: {
			item: {
				base: 'flex w-full cursor-pointer items-center justify-start px-4 py-2 font-barlow text-sm text-slate-500 hover:bg-slate-100 hover:text-cyan-700 focus:bg-slate-100 focus:outline-none',
			},
		},
	},
};

const NavBar: React.FC = () => {
	const [cookies, _, removeCookie] = useCookies(['user']); // eslint-disable-line  @typescript-eslint/no-unused-vars
	const location = useLocation();
	const navigate = useNavigate();

	function handleLogout(e: React.MouseEvent) {
		e.preventDefault();
		const bearerToken = localStorage.getItem('token');

		// process logout request to the backend
		axios
			.post(
				'/api/admin/logout',
				{},
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`,
					},
				}
			)
			.then(() => {
				removeCookie('user');
				localStorage.removeItem('bearer');
				return navigate('/');
			})
			.catch((err: AxiosError) => {
				console.error(err.response?.data);
			});
	}

	return (
		<>
			<Flowbite theme={{ theme: navbarAdjustments }}>
				<Navbar fluid id="web-navbar">
					<Navbar.Brand>
						<span className="self-center whitespace-nowrap font-barlow text-xl text-slate-400">
							Sergio Ley Languren
						</span>
					</Navbar.Brand>
					<Navbar.Toggle />
					<Navbar.Collapse>
						<Navbar.Link
							active={location.pathname === '/'}
							disabled={location.pathname === '/'}
							href="/">
							Home
						</Navbar.Link>
						<Navbar.Link
							active={location.pathname === '/education'}
							disabled={location.pathname === '/education'}
							href="/education">
							Education
						</Navbar.Link>
						<Dropdown
							arrowIcon={false}
							inline
							label={
								<p
									className={`border-b border-gray-100 font-barlow ${['/experience', '/showcase', '/projects'].includes(location.pathname) ? 'text-cyan-700' : 'text-slate-500'} hover:text-cyan-700 max-sm:w-full max-sm:py-2 md:border-0`}>
									Experience
								</p>
							}>
							<Dropdown.Item
								disabled={location.pathname === '/experience'}
								href="/experience"
								icon={FaPersonCircleExclamation}>
								Experience
							</Dropdown.Item>
							<Dropdown.Item
								disabled={location.pathname === '/showcase'}
								href="/showcase"
								icon={BiCarousel}>
								Showcase
							</Dropdown.Item>
							<Dropdown.Item
								disabled={location.pathname === '/projects'}
								href="/projects"
								icon={GoProjectRoadmap}>
								Projects
							</Dropdown.Item>
						</Dropdown>
						<Navbar.Link
							disabled={location.pathname === '/blog'}
							href="/blog"
							active={
								location.pathname === '/blog' ||
								location.pathname === '/blog/view'
							}>
							Blog
						</Navbar.Link>
						<Navbar.Link
							active={location.pathname === '/contact'}
							disabled={location.pathname === '/contact'}
							href="/contact">
							Contact Me
						</Navbar.Link>
						<Navbar.Link
							active={location.pathname === '/about'}
							disabled={location.pathname === '/about'}
							href="/about">
							About Me
						</Navbar.Link>
						{!cookies.user ? (
							<Navbar.Link
								active={location.pathname === '/login'}
								disabled={location.pathname === '/login'}
								href="/login">
								Administrator Login
							</Navbar.Link>
						) : (
							<>
								<Navbar.Link
									href="/admin/management"
									active={
										location.pathname ===
										'/admin/management'
									}
									disabled={
										location.pathname ===
										'/admin/management'
									}>
									Administrator Dashboard
								</Navbar.Link>
								<Navbar.Link
									href="#"
									onClick={(e) => handleLogout(e)}>
									logout
								</Navbar.Link>
							</>
						)}
					</Navbar.Collapse>
				</Navbar>
			</Flowbite>
		</>
	);
};

export default NavBar;
