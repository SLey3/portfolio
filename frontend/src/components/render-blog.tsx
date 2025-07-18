import { useTextEditor } from '@/utils/plate/editor';
import { CommentProvider } from '@udecode/plate-comments/react';
import { Plate } from '@udecode/plate-common/react';
import React, { Suspense } from 'react';

import { Editor } from '@/components/plate-ui/editor';

const BlogViewer: React.FC<BlogViewerProps> = ({ content }) => {
	const editor = useTextEditor();
	editor.children = JSON.parse(content);

	if (!content) {
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
				<Plate editor={editor} readOnly>
					<CommentProvider>
						<Editor
							autoFocus
							className="bg-newspaper bg-repeat font-cormorant-garamond shadow-2xl shadow-gray-900 grayscale sepia"
							variant="ghost"
						/>
					</CommentProvider>
				</Plate>
			</Suspense>
		</>
	);
};

export default BlogViewer;
