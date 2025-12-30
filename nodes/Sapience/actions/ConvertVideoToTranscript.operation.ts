import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

const VIDEO_TO_TEXT_PATH = '/api/v2/utilities/video-to-text';

export async function convertVideoToTranscript(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	// Імʼя binary property (зазвичай "data")
	const binaryPropertyName = this.getNodeParameter(
		'binaryPropertyName',
		i,
	) as string;

	// Переконуємось, що файл реально є
	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

	// Дістаємо сам файл у Buffer
	const videoBuffer = await this.helpers.getBinaryDataBuffer(
		i,
		binaryPropertyName,
	);

	// Query params
	const model = this.getNodeParameter('model', i, 'gpt-4o-transcribe') as string;
	const language = this.getNodeParameter('language', i, 'en') as string;

	/**
	 * ВАЖЛИВО:
	 * - formData працює у runtime
	 * - але у твоїх типах IHttpRequestOptions немає formData
	 * Тому робимо options як any (це стандартна практика для таких кейсів).
	 */
	const requestOptions: any = {
		method: 'POST',
		url: `${baseUrl}${VIDEO_TO_TEXT_PATH}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			// Content-Type не ставимо — boundary поставить n8n сам
		},
		qs: {
			model,
			language,
		},
		formData: {
			video_file: {
				value: videoBuffer,
				options: {
					filename: binaryData.fileName || 'video.mp4',
					contentType: binaryData.mimeType || 'application/octet-stream',
				},
			},
		},
		json: true,
	};

	const response = await this.helpers.httpRequest(requestOptions);

	return [response as IDataObject];
}
