// TODO: Revise and potentially remove this hooks when CDN is fully set up as this may not be necessary anymore
import { MakeBlogImgUrls, RemoveBlogUrls } from '@/utils';
import { Value } from '@udecode/plate-common';
import { useCallback, useEffect, useState } from 'react';

export default function useBlog<T>(content: T): T | null {
	const [blog, setBlog] = useState<T | null>(null);
	const [isSet, setIsSet] = useState(false);

	useEffect(() => {
		const processContent = async () => {
			if (!blog && !isSet && content) {
				const processed = await MakeBlogImgUrls(content as Value);
				setBlog(processed as T);
				setIsSet(true);
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		processContent();

		return () => {
			if (blog) {
				RemoveBlogUrls(blog as Value);
				setIsSet(false);
			}
		};
	}, [content, blog, isSet]);

	if (!blog) {
		return null;
	}

	return blog;
}

export function useBlogWithCallback<T>(content: T): T | null {
	const [blog, setBlog] = useState<T>(content);
	const [isSet, setIsSet] = useState(false);

	const getBlog = useCallback(() => {
		const processContent = async () => {
			if (content && !isSet) {
				const processed = await MakeBlogImgUrls(content as Value);
				setBlog(processed as T);
				setIsSet(true);
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		processContent();

		return () => {
			if (blog) {
				RemoveBlogUrls(blog as Value);
				setIsSet(false);
			}
		};
	}, [content, blog, isSet]);

	if (!content) {
		return null;
	}

	getBlog();

	return blog;
}
