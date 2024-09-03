'use client';

import { useColorsCustom, useColorsCustomState } from '@udecode/plate-font';
import React from 'react';

import { buttonVariants } from './button';
import type { TColor } from './color-dropdown-menu';
import { ColorDropdownMenuItems } from './color-dropdown-menu-items';
import { ColorInput } from './color-input';
import { DropdownMenuItem } from './dropdown-menu';

type ColorsCustomProps = {
	color?: string;
	colors: TColor[];
	customColors: TColor[];
	updateColor: (color: string) => void;
	updateCustomColor: (color: string) => void;
};

export function ColorsCustom({
	color,
	colors,
	customColors,
	updateColor,
	updateCustomColor,
}: ColorsCustomProps) {
	const state = useColorsCustomState({
		color,
		colors,
		customColors,
		updateCustomColor,
	});
	const { inputProps, menuItemProps } = useColorsCustom(state);

	return (
		<div className="flex flex-col gap-4">
			<ColorInput {...inputProps}>
				<DropdownMenuItem
					className={buttonVariants({
						isMenu: true,
						variant: 'outline',
					})}
					{...menuItemProps}>
					CUSTOM
				</DropdownMenuItem>
			</ColorInput>

			<ColorDropdownMenuItems
				color={color}
				colors={state.computedColors}
				updateColor={updateColor}
			/>
		</div>
	);
}
