import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
import { TooltipProvider } from '@/components/plate-ui/tooltip';
import plugins from '@/utils/plate/plugins';
import { CommentsProvider } from '@udecode/plate-comments';
import { Plate, Value } from '@udecode/plate-common';
import { Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TextEditor: React.FC<TextEditorProps> = ({ setContent, editValues }) => {
	const initialValue = editValues || [
		{
			id: '1',
			type: 'p',
			children: [{ text: '' }],
		},
	];

	return (
		<Suspense
			fallback={
				<>
					<p className="text-center align-middle font-cormorant-garamond text-8xl text-slate-200">
						Loading Editor...
					</p>
				</>
			}>
			<TooltipProvider>
				<DndProvider backend={HTML5Backend}>
					<CommentsProvider
						users={{
							1: {
								id: '1',
								name: 'Sergio Ley Languren',
								avatarUrl:
									'https://avatars.githubusercontent.com/u/44455382?v=4&size=64',
							},
						}}
						myUserId="1">
						<Plate
							plugins={plugins}
							onChange={(newVal) => setContent(newVal)}
							initialValue={initialValue}>
							<FixedToolbar>
								<FixedToolbarButtons />
							</FixedToolbar>
							<Editor autoFocus variant="ghost" />

							<FloatingToolbar>
								<FloatingToolbarButtons />
							</FloatingToolbar>
							<CommentsPopover />
						</Plate>
					</CommentsProvider>
				</DndProvider>
			</TooltipProvider>
		</Suspense>
	);
};

export default TextEditor;
