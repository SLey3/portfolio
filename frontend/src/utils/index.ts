import type { Value } from '@udecode/plate-common';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Asynchronously makes blog image URLs.
 * @todo Once CDN is up and running this function may not be necessary anymore
 *
 * @param contents - The array of values to process.
 * @returns A promise that resolves to the modified contents array.
 */
export async function MakeBlogImgUrls(contents: Value): Promise<Value> {
	const promises = contents.map(async (row) => {
		if (row.type === 'img') {
			const img_fp = row.url;
			row.original_url = img_fp;

			try {
				const res: AxiosResponse = await axios.post(
					'/api/image',
					{ fp: img_fp },
					{
						headers: {
							'Content-Type': 'application/json',
						},
						responseType: 'blob',
					}
				);
				row.url = URL.createObjectURL(res.data);
			} catch (err) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				console.error((err as any).response?.data);
			}
		}
	});

	await Promise.all(promises);
	return contents;
}

/**
 * Removes blog URLs from the given contents.
 * @todo Once CDN is up and running this function may not be necessary anymore
 *
 * @param contents - The contents to remove blog URLs from.
 * @param revokeUrl - Optional parameter to indicate whether to revoke the URL or not. Default is true.
 * @returns The contents with blog URLs removed.
 */
export function RemoveBlogUrls(
	contents: Value,
	revokeUrl: boolean = true
): Value {
	for (const row of contents) {
		if (row.type === 'img') {
			if (revokeUrl) {
				URL.revokeObjectURL(row.url as string);
			}

			if (row.original_url) {
				row.url = row.original_url;
			}

			if (row.original_url) {
				delete row.original_url;
			}
		}
	}

	return contents;
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
 * Returns the URL for the specified image asset.
 *
 * @param img_name - The name of the image file.
 * @returns The URL of the image asset.
 */
export function GetAssetsUrl(img_name: string): string {
	return `http://${window.location.host}/src/assets/${img_name}`;
}
