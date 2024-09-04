'use client';

import { Icons } from '@/components/icons';
import { cn } from '@udecode/cn';
import {
	CommentResolveButton as CommentResolveButtonPrimitive,
	useComment,
} from '@udecode/plate-comments';
import React from 'react';

import { buttonVariants } from './button';

export function CommentResolveButton() {
	const comment = useComment()!;

	return (
		<CommentResolveButtonPrimitive
			className={cn(
				buttonVariants({ variant: 'ghost' }),
				'h-6 p-1 text-slate-500 dark:text-slate-400'
			)}>
			{comment.isResolved ? (
				<Icons.refresh className="size-4" />
			) : (
				<Icons.check className="size-4" />
			)}
		</CommentResolveButtonPrimitive>
	);
}
