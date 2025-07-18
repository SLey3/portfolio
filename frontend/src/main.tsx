// prettier-ignore
import './instrument'; // as per Sentry docs this must come first

import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import './index.css';

// creating root
ReactDOM.createRoot(document.getElementById('web-content')!).render(
	<CookiesProvider>
		<App />
	</CookiesProvider>
);
