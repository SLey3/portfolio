import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
	fallbackUrl = '/',
	children,
}): React.ReactElement => {
	const [isLoading, setIsLoading] = useState(true);
	const [cookies] = useCookies(['user']);
	const navigate = useNavigate();

	useEffect(() => {
		if (!cookies.user) {
			return navigate(fallbackUrl);
		} else {
			setIsLoading(false);
		}
	}, [cookies.user, fallbackUrl, navigate]);

	// prevent visual glitch as much as possible when unauthorized user tries to access protected component
	if (isLoading) {
		return <></>;
	}

	return <>{children}</>;
};

export default ProtectedComponent;
