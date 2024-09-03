import AboutMe from '@/pages/About';
import BlogPosts from '@/pages/Blogs';
import BlogAdd from '@/pages/BlogsAdd';
import Contact from '@/pages/Contact';
import EditBlog from '@/pages/EditBlog';
import Education from '@/pages/Education';
import Experience from '@/pages/Experience';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Projects from '@/pages/Projects';
import Showcase from '@/pages/Showcase';
import ViewBlog from '@/pages/ViewBlogs';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
	return (
		<>
			<Router future={{ v7_startTransition: true }}>
				<Routes>
					<Route Component={Home} path="/" />
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
				</Routes>
			</Router>
		</>
	);
}

export default App;
