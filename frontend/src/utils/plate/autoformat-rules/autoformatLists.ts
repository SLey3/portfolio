import {
	formatList,
	preFormat,
} from '@/utils/plate/autoformat-rules/autoformatUtils';
import type { AutoformatRule } from '@udecode/plate-autoformat';
import { isBlock, setNodes } from '@udecode/plate-common';
import { TTodoListItemElement } from '@udecode/plate-list';
import {
	BulletedListPlugin,
	ListItemPlugin,
	NumberedListPlugin,
	TodoListPlugin,
} from '@udecode/plate-list/react';

export const autoformatLists: AutoformatRule[] = [
	{
		mode: 'block',
		type: ListItemPlugin.key,
		match: ['* ', '- '],
		preFormat,
		format: (editor) => formatList(editor, BulletedListPlugin.key),
	},
	{
		mode: 'block',
		type: ListItemPlugin.key,
		match: ['1. ', '1) '],
		preFormat,
		format: (editor) => formatList(editor, NumberedListPlugin.key),
	},
	{
		mode: 'block',
		type: TodoListPlugin.key,
		match: '[] ',
	},
	{
		mode: 'block',
		type: TodoListPlugin.key,
		match: '[x] ',
		format: (editor) =>
			setNodes<TTodoListItemElement>(
				editor,
				{ type: TodoListPlugin.key, checked: true },
				{
					match: (n) => isBlock(editor, n),
				}
			),
	},
];
