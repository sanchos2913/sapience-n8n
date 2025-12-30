import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';
import FormData from 'form-data';

const FILE_UPLOAD_PATH = '/api/files/upload';

export async function uploadFile(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const userDescriptionRaw = this.getNodeParameter('userDescription', i) as string;
	const shouldParseFile = this.getNodeParameter('shouldParseFile', i) as boolean;

	const userDescription = (userDescriptionRaw ?? '').trim();
	if (!userDescription) {
		throw new Error('User Description is required and cannot be empty');
	}

	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
	const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	// Build multipart/form-data manually (most compatible)
	const form = new FormData();
	form.append('user_description', userDescription);
	form.append('should_parse_file', shouldParseFile ? 'true' : 'false');
	form.append('file', fileBuffer, {
		filename: binaryData.fileName || 'upload.pdf',
		contentType: binaryData.mimeType || 'application/octet-stream',
	});

	const requestOptions: any = {
		method: 'POST',
		url: `${baseUrl}${FILE_UPLOAD_PATH}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			...form.getHeaders(), // sets multipart boundary + content-type
		},
		body: form,
	};

	try {
		const response = await this.helpers.httpRequest(requestOptions);

		// Depending on n8n version, response might be object already or string
		if (typeof response === 'string') {
			try {
				return [JSON.parse(response) as IDataObject];
			} catch {
				return [{ raw: response } as IDataObject];
			}
		}

		return [response as IDataObject];
	} catch (err: any) {
		const status = err?.response?.status;
		const data = err?.response?.data;

		if (status) {
			throw new Error(
				`Upload failed (${status}). Response: ${JSON.stringify(data)}`,
			);
		}
		throw err;
	}
}
