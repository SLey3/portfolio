import { Editor } from '@/components/plate-ui/editor';
import useBlog from '@/utils/hooks/use-blog';
import plugins from '@/utils/plate/plugins';
import { CommentsProvider } from '@udecode/plate-comments';
import { Plate, Value } from '@udecode/plate-common';
import React, { Suspense } from 'react';

const BlogViewer: React.FC<BlogViewerProps> = ({ content }) => {
	const blog = useBlog<Value | null>(content);

	if (!blog) {
		return null;
	}

	return (
		<>
			<Suspense
				fallback={
					<>
						<p className="absolute left-1/2 top-1/2 translate-x-2 text-center align-middle font-cormorant-garamond text-8xl text-white">
							Loading Blog...
						</p>
					</>
				}>
				<Plate initialValue={blog} plugins={plugins} readOnly>
					<CommentsProvider>
						<Editor
							autoFocus
							className="bg-newspaper bg-repeat font-cormorant-garamond shadow-2xl shadow-gray-900 grayscale sepia"
							variant="ghost"
						/>
					</CommentsProvider>
				</Plate>
			</Suspense>
		</>
	);
};

export default BlogViewer;
