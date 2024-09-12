import type { AxiosError } from 'axios';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

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
