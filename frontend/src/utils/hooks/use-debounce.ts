import { useEffect, useState } from 'react';

/**
 * Custom hook that debounces a value by a specified delay.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds to debounce the value.
 * @returns {T} - The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
