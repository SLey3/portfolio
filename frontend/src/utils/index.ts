import type { AxiosError } from 'axios';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Safely retrieves the value of a specified property from an object.
 *
 * @template T - The type of the object.
 * @template K - The type of the key, which must be a key of T.
 * @param {T} obj - The object from which to retrieve the property.
 * @param {K} key - The key of the property to retrieve.
 * @returns {T[K] | null} - The value of the specified property, or null if the property does not exist.
 */
export function getattr<T extends object, K extends keyof T>(
	obj: T,
	key: K
): T[K] | null {
	return key in obj ? obj[key] : null;
}

/**
 * Sets form errors based on the Axios error response.
 *
 * @template T - The type of field values for the form.
 * @param {AxiosError} err - The Axios error object.
 * @param {UseFormSetError<T>} setError - The function to set form errors.
 */
export function SetFormErrors<T extends FieldValues>(
	err: AxiosError,
	setError: UseFormSetError<T>
) {
	const res = err.response?.data as FormErrRes;

	for (const key in res?.errors) {
		const err_msg = res?.errors[key][0];

		// @ts-expect-error | key attribute does contain the field name
		setError(key, { type: 'custom', message: err_msg });
	}
}

/**
 * Returns the appropriate highlight color class for an admin link based on the provided status code.
 *
 * The function converts the status code to a string and checks its first digit to determine the color.
 * - Status codes starting with "1" return a blue highlight.
 * - Status codes starting with "2" return a lime highlight.
 * - Status codes starting with "3" return an amber highlight.
 * - Status codes starting with "4" return a red highlight.
 * - Any other status codes return a violet highlight.
 *
 * @param status_code - The status code to determine the highlight color for.
 * @returns A string representing the CSS classes for the highlight color.
 */
export function getAdminLinkHighlightColor(status_code: number): string {
	switch (true) {
		case status_code >= 100 && status_code < 200:
			return 'bg-blue-600/30 text-blue-900';
		case status_code >= 200 && status_code < 300:
			return 'bg-lime-300/30 text-zinc-800';
		case status_code >= 300 && status_code < 400:
			return 'bg-amber-500/30 text-indigo-900';
		case status_code >= 400 && status_code < 500:
			return 'bg-red-400/30 text-red-900';
		default:
			return 'bg-violet-500/30 text-violet-900';
	}
}

/**
 * Serializes the given editor content into a JSON string.
 *
 * @param content - The editor content to serialize. It can be an object or a string.
 * @returns The serialized content as a JSON string. If an error occurs during serialization, an empty string is returned.
 */
export const serializeEditorContent = (content: object) => {
	try {
		return typeof content === 'string'
			? content
			: JSON.stringify(content).trim();
	} catch (error) {
		console.error('Error serializing editor content:', error);
		return '';
	}
};
