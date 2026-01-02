import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import FormData from 'form-data';
import { getAccessToken } from '../helpers/token';

function safeStringify(value: unknown): string {
	try {
		if (typeof value === 'string') return value;
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

export async function convertVideoToTranscript(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const items = this.getInputData() as INodeExecutionData[];
	const item = items[itemIndex];

	// ✅ FIX: read the parameter name you actually defined in properties
	const binaryProperty =
		(this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';

	const model = (this.getNodeParameter('model', itemIndex, 'gpt-4o-transcribe') as string) || 'gpt-4o-transcribe';
	const language = (this.getNodeParameter('language', itemIndex, 'en') as string) || 'en';

	const bin = item.binary?.[binaryProperty];
	if (!bin) {
		const available = Object.keys(item.binary ?? {}).join(', ');
		throw new Error(
			`No binary property "${binaryProperty}" found on item ${itemIndex}. ` +
				`Available binary properties: [${available || 'none'}].`,
		);
	}

	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);
	const fileName = bin.fileName ?? 'video.mp4';
	const mimeType = bin.mimeType ?? 'video/mp4';

	// ✅ Build real multipart payload
	const form = new FormData();
	form.append('video_file', buffer, {
		filename: fileName,
		contentType: mimeType,
		knownLength: buffer.length, // helps some servers/proxies
	});

	const url = `${baseUrl.replace(/\/$/, '')}/api/v2/utilities/video-to-text`;

	const options = {
		method: 'POST',
		url,
		// n8n client usually supports `qs` for querystring; if yours prefers `params`, swap it.
		qs: { model, language },

		// ✅ IMPORTANT: send the form stream as the body
		body: form,

		// ✅ IMPORTANT: include boundary headers from form-data
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			...form.getHeaders(),
		},

		// ❌ Do NOT set json:true here; it can interfere with multipart in some setups
		// json: true,
	};

	try {
		const response = await this.helpers.httpRequest(options as any);
		// If the API returns JSON, n8n often already parses it; if not, handle parsing:
		if (typeof response === 'string') {
			try {
				return [JSON.parse(response) as IDataObject];
			} catch {
				return [{ raw: response } as IDataObject];
			}
		}
		return [response as IDataObject];
	} catch (error: any) {
		const status = error?.response?.statusCode ?? error?.statusCode ?? error?.response?.status ?? 'unknown';
		const body = error?.response?.body ?? error?.response?.data ?? error?.body ?? error?.message ?? error;

		throw new Error(
			`Sapience video-to-text failed (status ${status}). ` +
				`binaryProperty="${binaryProperty}", filename="${fileName}", mimeType="${mimeType}", ` +
				`model="${model}", language="${language}". ` +
				`Response: ${safeStringify(body)}`,
		);
	}
}
