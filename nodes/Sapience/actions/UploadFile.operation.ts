import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

const FILE_UPLOAD_PATH = '/api/files/upload';

export async function uploadFile(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const userDescriptionRaw = this.getNodeParameter('userDescription', i) as string;
	const shouldParseFile = this.getNodeParameter('shouldParseFile', i) as boolean;

	const userDescription = (userDescriptionRaw ?? '').trim();
	if (!userDescription) {
		throw new NodeOperationError(this.getNode(), 'User Description is required and cannot be empty');
	}

	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
	const fileBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	const fileName = binaryData.fileName ?? 'upload.bin';
	const mimeType = binaryData.mimeType ?? 'application/octet-stream';

	const requestOptions = {
		method: 'POST' as const,
		url: `${baseUrl}${FILE_UPLOAD_PATH}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
		formData: {
			user_description: userDescription,
			should_parse_file: shouldParseFile ? 'true' : 'false',
			file: {
				value: fileBuffer,
				options: {
					filename: fileName,
					contentType: mimeType,
				},
			},
		},
		json: true,
	};

	try {
		const response = await this.helpers.httpRequest(requestOptions);

		if (typeof response === 'object' && response !== null) {
			return [response as IDataObject];
		}

		return [{ raw: response } as IDataObject];
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new NodeOperationError(this.getNode(), error.message);
		}

		throw new NodeOperationError(this.getNode(), 'Upload failed', {
			description: JSON.stringify(error),
		});
	}
}
