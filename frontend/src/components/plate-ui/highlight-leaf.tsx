import { cn, withRef } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate-common';

export const HighlightLeaf = withRef<typeof PlateLeaf>(
	({ children, className, ...props }, ref) => (
		<PlateLeaf
			asChild
			className={cn('bg-slate-900/20 text-inherit', className)}
			ref={ref}
			{...props}>
			<mark>{children}</mark>
		</PlateLeaf>
	)
);
