import { withProps } from '@udecode/cn';
import {
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import {
	ParagraphPlugin,
	PlateLeaf,
	createPlateEditor,
} from '@udecode/plate-common/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { HtmlReactPlugin } from '@udecode/plate-html/react';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { TodoListPlugin } from '@udecode/plate-list/react';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from '@udecode/plate-table/react';

import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { Prism } from '@/components/plate-ui/code-block-combobox';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { LinkElement } from '@/components/plate-ui/link-element';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import {
	TableCellElement,
	TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TodoListElement } from '@/components/plate-ui/todo-list-element';

/**
 * Custom hook to create a temporary Plate editor instance with a set of predefined plugins and component overrides.
 *
 * @returns {PlateEditor} A configured Plate editor instance.
 */
export const useTempEditor = () => {
	const tmp = createPlateEditor({
		plugins: [
			HtmlReactPlugin,
			ParagraphPlugin,
			HeadingPlugin,
			BlockquotePlugin,
			CodeBlockPlugin.configure({
				options: {
					prism: Prism,
				},
			}),
			CodeLinePlugin,
			CodeSyntaxPlugin,
			LinkPlugin,
			ImagePlugin,
			ColumnPlugin,
			ColumnItemPlugin,
			MediaEmbedPlugin,
			CaptionPlugin,
		],
		override: {
			components: {
				[ParagraphPlugin.key]: ParagraphElement,
				[BlockquotePlugin.key]: BlockquoteElement,
				[CodeBlockPlugin.key]: CodeBlockElement,
				[CodeLinePlugin.key]: CodeLineElement,
				[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
				[HorizontalRulePlugin.key]: HrElement,
				[ImagePlugin.key]: ImageElement,
				[LinkPlugin.key]: LinkElement,
				[ColumnPlugin.key]: ColumnGroupElement,
				[ColumnItemPlugin.key]: ColumnElement,
				[HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
				[HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
				[HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
				[HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
				[HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
				[HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
				[MediaEmbedPlugin.key]: MediaEmbedElement,
				[TablePlugin.key]: TableElement,
				[TableRowPlugin.key]: TableRowElement,
				[TableCellPlugin.key]: TableCellElement,
				[TableCellHeaderPlugin.key]: TableCellHeaderElement,
				[TodoListPlugin.key]: TodoListElement,
				[BoldPlugin.key]: withProps(PlateLeaf, {
					as: 'span',
					className: 'font-bold',
				}),
				[CodePlugin.key]: CodeLeaf,
				[HighlightPlugin.key]: HighlightLeaf,
				[ItalicPlugin.key]: withProps(PlateLeaf, {
					as: 'span',
					className: 'italic',
				}),
				[KbdPlugin.key]: KbdLeaf,
				[StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
				[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
				[SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
				[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
			},
		},
	});

	return tmp;
};
