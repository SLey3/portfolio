import { CommentsPopover } from '@/components/plate-ui/comments-popover';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons';
import { TooltipProvider } from '@/components/plate-ui/tooltip';
import { CommentProvider } from '@udecode/plate-comments/react';
import { Plate } from '@udecode/plate-common/react';
import { Suspense, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TextEditor: React.FC<TextEditorProps> = ({ editor, footerText }) => {
	const editorRef = useRef(null);

	return (
		<Suspense
			fallback={
				<>
					<p className="text-center align-middle font-cormorant-garamond text-8xl text-slate-200">
						Loading Editor...
					</p>
				</>
			}>
			<DndProvider backend={HTML5Backend}>
				<TooltipProvider>
					<CommentProvider>
						<Plate editor={editor}>
							<FixedToolbar>
								<FixedToolbarButtons />
							</FixedToolbar>
							<Editor autoFocus ref={editorRef} variant="ghost" />

							<FloatingToolbar>
								<FloatingToolbarButtons />
							</FloatingToolbar>
							<CommentsPopover />
							{footerText ? (
								<p className="pl-2 pt-px font-poppins text-sm text-muted-foreground">
									{footerText}
								</p>
							) : null}
						</Plate>
					</CommentProvider>
				</TooltipProvider>
			</DndProvider>
		</Suspense>
	);
};

export default TextEditor;
