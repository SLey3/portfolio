import { withProps } from '@udecode/cn';
import { AlignPlugin } from '@udecode/plate-alignment/react';
import { AutoformatPlugin } from '@udecode/plate-autoformat/react';
import {
	BasicMarksPlugin,
	BoldPlugin,
	CodePlugin,
	ItalicPlugin,
	StrikethroughPlugin,
	SubscriptPlugin,
	SuperscriptPlugin,
	UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { CaptionPlugin } from '@udecode/plate-caption/react';
import {
	CodeBlockPlugin,
	CodeLinePlugin,
	CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import {
	ParagraphPlugin,
	PlateLeaf,
	usePlateEditor,
} from '@udecode/plate-common/react';
import { CsvPlugin } from '@udecode/plate-csv';
import { DndPlugin } from '@udecode/plate-dnd';
import { DocxPlugin } from '@udecode/plate-docx';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
	FontBackgroundColorPlugin,
	FontColorPlugin,
	FontSizePlugin,
} from '@udecode/plate-font/react';
import { HEADING_KEYS, HEADING_LEVELS } from '@udecode/plate-heading';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { HtmlReactPlugin } from '@udecode/plate-html/react';
import { IndentListPlugin } from '@udecode/plate-indent-list/react';
import { IndentPlugin } from '@udecode/plate-indent/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { KbdPlugin } from '@udecode/plate-kbd/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LineHeightPlugin } from '@udecode/plate-line-height/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
	BulletedListPlugin,
	ListItemContentPlugin,
	ListItemPlugin,
	ListPlugin,
	NumberedListPlugin,
	TodoListPlugin,
} from '@udecode/plate-list/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { ImagePlugin, MediaEmbedPlugin } from '@udecode/plate-media/react';
import {
	MentionInputPlugin,
	MentionPlugin,
} from '@udecode/plate-mention/react';
import { NodeIdPlugin } from '@udecode/plate-node-id';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { DeletePlugin } from '@udecode/plate-select';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import { TabbablePlugin } from '@udecode/plate-tabbable/react';
import {
	TableCellHeaderPlugin,
	TableCellPlugin,
	TablePlugin,
	TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { BlockquoteElement } from '@/components/plate-ui/blockquote-element';
import { Prism } from '@/components/plate-ui/code-block-combobox';
import { CodeBlockElement } from '@/components/plate-ui/code-block-element';
import { CodeLeaf } from '@/components/plate-ui/code-leaf';
import { CodeLineElement } from '@/components/plate-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/plate-ui/code-syntax-leaf';
import { ColumnElement } from '@/components/plate-ui/column-element';
import { ColumnGroupElement } from '@/components/plate-ui/column-group-element';
import { CommentLeaf } from '@/components/plate-ui/comment-leaf';
import { HeadingElement } from '@/components/plate-ui/heading-element';
import { HighlightLeaf } from '@/components/plate-ui/highlight-leaf';
import { HrElement } from '@/components/plate-ui/hr-element';
import { ImageElement } from '@/components/plate-ui/image-element';
import { KbdLeaf } from '@/components/plate-ui/kbd-leaf';
import { LinkElement } from '@/components/plate-ui/link-element';
import { LinkFloatingToolbar } from '@/components/plate-ui/link-floating-toolbar';
import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { MentionElement } from '@/components/plate-ui/mention-element';
import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
import { ParagraphElement } from '@/components/plate-ui/paragraph-element';
import { withPlaceholders } from '@/components/plate-ui/placeholder';
import {
	TableCellElement,
	TableCellHeaderElement,
} from '@/components/plate-ui/table-cell-element';
import { TableElement } from '@/components/plate-ui/table-element';
import { TableRowElement } from '@/components/plate-ui/table-row-element';
import { TodoListElement } from '@/components/plate-ui/todo-list-element';
import { ToggleElement } from '@/components/plate-ui/toggle-element';
import { withDraggables } from '@/components/plate-ui/with-draggables';

import { autoformatRules } from './autoformat';

/**
 * Custom hook to initialize and configure a text editor with various plugins and functionalities.
 *
 * @param {string} BearerToken - The authorization token for API requests.
 * @param {boolean} [blog=false] - Flag to indicate if the editor is for a blog post.
 * @param {string | undefined} [blogID=undefined] - The ID of the blog post to edit.
 * @param {boolean} [modal=false] - Flag to indicate if the editor is used within a modal.
 *
 * @returns {object} - An object containing the configured editor instance and additional state variables.
 * @returns {object} editor - The configured editor instance.
 * @returns {boolean} [openDraft] - State indicating if a draft is open (only when `modal` is true).
 * @returns {function} [setOpenDraft] - Function to set the `openDraft` state (only when `modal` is true).
 * @returns {string | undefined} [draftTitle] - The title of the draft (only when `modal` is true).
 * @returns {BlogList | null} [blogInfo] - Information about the blog post (only when `blog` is true).
 */
export const useTextEditor = () => {
	const initialValue = [
		{
			id: '1',
			type: 'p',
			children: [{ text: '' }],
		},
	];

	const editor = usePlateEditor({
		plugins: [
			AutoformatPlugin.configure({
				options: {
					rules: autoformatRules,
				},
			}),
			ParagraphPlugin,
			HeadingPlugin,
			HtmlReactPlugin,
			BlockquotePlugin,
			CodeBlockPlugin.configure({
				options: {
					prism: Prism,
				},
			}),
			CodeLinePlugin,
			CodeSyntaxPlugin,
			HorizontalRulePlugin,
			LinkPlugin.configure({
				render: {
					afterEditable: () => <LinkFloatingToolbar />,
				},
			}),
			ImagePlugin,
			TogglePlugin,
			ColumnPlugin,
			ColumnItemPlugin,
			MediaEmbedPlugin,
			CaptionPlugin.configure({
				options: {
					plugins: [
						{ key: MediaEmbedPlugin.key },
						{ key: ImagePlugin.key },
					],
				},
			}),
			MentionPlugin,
			MentionInputPlugin,
			TablePlugin,
			TableCellPlugin,
			TableCellHeaderPlugin,
			TodoListPlugin,
			SuggestionPlugin,
			ListPlugin,
			BulletedListPlugin,
			NumberedListPlugin,
			ListItemPlugin,
			ListItemContentPlugin,
			BasicMarksPlugin,
			FontColorPlugin,
			FontBackgroundColorPlugin,
			FontSizePlugin,
			HighlightPlugin,
			KbdPlugin,
			AlignPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						HEADING_KEYS.h1,
						HEADING_KEYS.h2,
						HEADING_KEYS.h3,
					],
				},
			}),
			IndentPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						HEADING_KEYS.h1,
						HEADING_KEYS.h2,
						HEADING_KEYS.h3,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
					],
				},
			}),
			IndentListPlugin.configure({
				inject: {
					targetPlugins: [
						ParagraphPlugin.key,
						HEADING_KEYS.h1,
						HEADING_KEYS.h2,
						HEADING_KEYS.h3,
						BlockquotePlugin.key,
						CodeBlockPlugin.key,
					],
				},
			}),
			LineHeightPlugin.configure({
				inject: {
					nodeProps: {
						defaultNodeValue: 1.5,
						validNodeValues: [1, 1.2, 1.5, 2, 3],
					},
					targetPlugins: [
						HEADING_KEYS.h1,
						HEADING_KEYS.h2,
						HEADING_KEYS.h3,
						ParagraphPlugin.key,
					],
				},
			}),
			BlockSelectionPlugin,
			DndPlugin.configure({
				options: {
					enableScroller: true,
				},
			}),
			EmojiPlugin,
			ExitBreakPlugin.configure({
				options: {
					rules: [
						{
							hotkey: 'mod+enter',
						},
						{
							hotkey: 'mod+shift+enter',
							before: true,
						},
						{
							hotkey: 'enter',
							query: {
								start: true,
								end: true,
								allow: HEADING_LEVELS,
							},
							relative: true,
							level: 1,
						},
					],
				},
			}),
			NodeIdPlugin,
			ResetNodePlugin,
			DeletePlugin,
			SoftBreakPlugin.configure({
				options: {
					rules: [
						{ hotkey: 'shift+enter' },
						{
							hotkey: 'enter',
							query: {
								allow: [
									CodeBlockPlugin.key,
									BlockquotePlugin.key,
									TablePlugin.key,
								],
							},
						},
					],
				},
			}),
			TabbablePlugin,
			TrailingBlockPlugin.configure({
				options: { type: ParagraphPlugin.key },
			}),
			CommentsPlugin,
			DocxPlugin,
			CsvPlugin,
			MarkdownPlugin,
			JuicePlugin,
		],
		override: {
			components: withDraggables(
				withPlaceholders({
					[BlockquotePlugin.key]: BlockquoteElement,
					[CodeBlockPlugin.key]: CodeBlockElement,
					[CodeLinePlugin.key]: CodeLineElement,
					[CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
					[HorizontalRulePlugin.key]: HrElement,
					[ImagePlugin.key]: ImageElement,
					[LinkPlugin.key]: LinkElement,
					[TogglePlugin.key]: ToggleElement,
					[ColumnPlugin.key]: ColumnGroupElement,
					[ColumnItemPlugin.key]: ColumnElement,
					[HEADING_KEYS.h1]: withProps(HeadingElement, {
						variant: 'h1',
					}),
					[HEADING_KEYS.h2]: withProps(HeadingElement, {
						variant: 'h2',
					}),
					[HEADING_KEYS.h3]: withProps(HeadingElement, {
						variant: 'h3',
					}),
					[HEADING_KEYS.h4]: withProps(HeadingElement, {
						variant: 'h4',
					}),
					[HEADING_KEYS.h5]: withProps(HeadingElement, {
						variant: 'h5',
					}),
					[HEADING_KEYS.h6]: withProps(HeadingElement, {
						variant: 'h6',
					}),
					[MediaEmbedPlugin.key]: MediaEmbedElement,
					[MentionPlugin.key]: MentionElement,
					[MentionInputPlugin.key]: MentionInputElement,
					[ParagraphPlugin.key]: ParagraphElement,
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
					[CommentsPlugin.key]: CommentLeaf,
					[HighlightPlugin.key]: HighlightLeaf,
					[ItalicPlugin.key]: withProps(PlateLeaf, {
						as: 'span',
						className: 'italic',
					}),
					[KbdPlugin.key]: KbdLeaf,
					[StrikethroughPlugin.key]: withProps(PlateLeaf, {
						as: 's',
					}),
					[SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
					[SuperscriptPlugin.key]: withProps(PlateLeaf, {
						as: 'sup',
					}),
					[UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
				})
			),
		},
		value: initialValue,
	});

	return editor;
};
