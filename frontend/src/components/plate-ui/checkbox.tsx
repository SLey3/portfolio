import { Icons } from '@/components/icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn, withRef } from '@udecode/cn';

export const Checkbox = withRef<typeof CheckboxPrimitive.Root>(
	({ className, ...props }, ref) => (
		<CheckboxPrimitive.Root
			className={cn(
				'peer size-4 shrink-0 rounded-sm border border-slate-200 bg-white ring-offset-white hover:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50',
				className
			)}
			ref={ref}
			{...props}>
			<CheckboxPrimitive.Indicator
				className={cn('flex items-center justify-center text-current')}>
				<Icons.check className="size-4" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
);
