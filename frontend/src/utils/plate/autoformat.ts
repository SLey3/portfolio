import {
	type AutoformatRule,
	autoformatArrow,
	autoformatLegal,
	autoformatLegalHtml,
	autoformatMath,
	autoformatPunctuation,
	autoformatSmartQuotes,
} from '@udecode/plate-autoformat';

import { autoformatBlocks } from './autoformat-rules/autoformatBlocks';
import { autoformatIndentLists } from './autoformat-rules/autoformatIndentLists';
import { autoformatMarks } from './autoformat-rules/autoformatMarks';

export const autoformatRules: AutoformatRule[] = [
	...autoformatBlocks,
	...autoformatIndentLists,
	...autoformatMarks,
	...autoformatSmartQuotes,
	...autoformatPunctuation,
	...autoformatLegal,
	...autoformatLegalHtml,
	...autoformatArrow,
	...autoformatMath,
];
