import AboutMe from '@/pages/About';
import TestSentry from './test';
import AdminDashboard from '@/pages/AdminDashboard';
import BlogPosts from '@/pages/Blogs';
import BlogAdd from '@/pages/BlogsAdd';
import Contact from '@/pages/Contact';
import EditBlog from '@/pages/EditBlog';
import Education from '@/pages/Education';
import Experience from '@/pages/Experience';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NewsletterSend from '@/pages/NewsletterCreate';
import NewsLetterUnsub from '@/pages/NewsletterUnsub';
import Projects from '@/pages/Projects';
import Showcase from '@/pages/Showcase';
import ViewBlog from '@/pages/ViewBlogs';
import Http404 from '@/pages/http/404';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
	return (
		<>
			<Router future={{ v7_startTransition: true }}>
				<Routes>
					<Route Component={Home} path="/" />
					<Route Component={TestSentry} path="/test" />
					<Route Component={Education} path="/education" />
					<Route Component={Experience} path="/experience" />
					<Route Component={Showcase} path="/showcase" />
					<Route Component={Projects} path="/projects" />
					<Route Component={BlogPosts} path="/blog" />
					<Route Component={BlogAdd} path="/blog/add" />
					<Route Component={ViewBlog} path="/blog/view" />
					<Route Component={EditBlog} path="/blog/edit/:blogId" />
					<Route Component={Contact} path="/contact" />
					<Route Component={AboutMe} path="/about" />
					<Route Component={Login} path="/login" />
					<Route
						Component={AdminDashboard}
						path="/admin/management"
					/>
					<Route
						Component={NewsletterSend}
						path="/admin/newsletter/create"
					/>
					<Route
						Component={NewsLetterUnsub}
						path="/newsletter/unsubscribe"
					/>
					<Route Component={Http404} path="/*" />
				</Routes>
			</Router>
		</>
	);
}

export default App;
