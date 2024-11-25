import { useEffect, useState } from 'react';

export default function useAuthToken() {
	const [token, setToken] = useState<string | null>();

	useEffect(() => {
		setToken(localStorage.getItem('token'));
	}, []);

	return token;
}
