import { IExecuteFunctions, IDataObject, NodeOperationError } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

const VIDEO_TO_TEXT_PATH = '/api/v2/utilities/video-to-text';

export async function convertVideoToTranscript(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

	// Ensure binary exists
	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

	// Get file buffer
	const videoBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

	// Query params
	const model = this.getNodeParameter('model', i, 'gpt-4o-transcribe') as string;
	const language = this.getNodeParameter('language', i, 'en') as string;

	const fileName = binaryData.fileName ?? 'video.mp4';
	const mimeType = binaryData.mimeType ?? 'application/octet-stream';

	const requestOptions = {
		method: 'POST' as const,
		url: `${baseUrl}${VIDEO_TO_TEXT_PATH}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
		qs: {
			model,
			language,
		},
		// n8n-native multipart upload
		formData: {
			video_file: {
				value: videoBuffer,
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

		throw new NodeOperationError(this.getNode(), 'Video to text transcription failed', {
			description: JSON.stringify(error),
		});
	}
}
