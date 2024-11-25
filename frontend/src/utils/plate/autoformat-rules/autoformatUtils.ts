/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AutoformatBlockRule } from '@udecode/plate-autoformat';
import {
	CodeBlockPlugin,
	CodeLinePlugin,
} from '@udecode/plate-code-block/react';
import {
	type SlateEditor,
	getParentNode,
	isElement,
	isType,
} from '@udecode/plate-common';
import { toggleList, unwrapList } from '@udecode/plate-list';

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) =>
	unwrapList(editor);

export const format = (editor: SlateEditor, customFormatting: any) => {
	if (editor.selection) {
		const parentEntry = getParentNode(editor, editor.selection);
		if (!parentEntry) return;
		const [node] = parentEntry;
		if (
			isElement(node) &&
			!isType(editor, node, CodeBlockPlugin.key) &&
			!isType(editor, node, CodeLinePlugin.key)
		) {
			customFormatting();
		}
	}
};

export const formatList = (editor: SlateEditor, elementType: string) => {
	format(editor, () =>
		toggleList(editor, {
			type: elementType,
		})
	);
};

export const formatText = (editor: SlateEditor, text: string) => {
	format(editor, () => editor.insertText(text));
};
