import './instrument';
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
