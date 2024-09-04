import { Icons } from '@/components/icons';
import { withRef } from '@udecode/cn';
import { useIndentButton } from '@udecode/plate-indent';
import React from 'react';

import { ToolbarButton } from './toolbar';

export const IndentToolbarButton = withRef<typeof ToolbarButton>(
	(rest, ref) => {
		const { props } = useIndentButton();

		return (
			<ToolbarButton ref={ref} tooltip="Indent" {...props} {...rest}>
				<Icons.indent />
			</ToolbarButton>
		);
	}
);
