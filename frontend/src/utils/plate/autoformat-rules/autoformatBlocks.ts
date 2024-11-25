import { AutoformatRule } from '@udecode/plate-autoformat';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { insertEmptyCodeBlock } from '@udecode/plate-code-block';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { insertNodes, setNodes } from '@udecode/plate-common';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';

import { preFormat } from './autoformatUtils';

export const autoformatBlocks: AutoformatRule[] = [
	{
		mode: 'block',
		type: HEADING_KEYS.h1,
		match: '# ',
		preFormat,
	},
	{
		mode: 'block',
		type: HEADING_KEYS.h2,
		match: '## ',
		preFormat,
	},
	{
		mode: 'block',
		type: HEADING_KEYS.h3,
		match: '### ',
		preFormat,
	},
	{
		mode: 'block',
		type: HEADING_KEYS.h4,
		match: '#### ',
		preFormat,
	},
	{
		mode: 'block',
		type: HEADING_KEYS.h5,
		match: '##### ',
		preFormat,
	},
	{
		mode: 'block',
		type: HEADING_KEYS.h6,
		match: '###### ',
		preFormat,
	},
	{
		mode: 'block',
		type: BlockquotePlugin.key,
		match: '> ',
		preFormat,
	},
	{
		mode: 'block',
		type: CodeBlockPlugin.key,
		match: '```',
		triggerAtBlockStart: false,
		preFormat,
		format: (editor) => {
			insertEmptyCodeBlock(editor, {
				defaultType: ParagraphPlugin.key,
				insertNodesOptions: { select: true },
			});
		},
	},
	{
		mode: 'block',
		type: HorizontalRulePlugin.key,
		match: ['---', '—-', '___ '],
		format: (editor) => {
			setNodes(editor, { type: HorizontalRulePlugin.key });
			insertNodes(editor, {
				type: ParagraphPlugin.key,
				children: [{ text: '' }],
			});
		},
	},
];
