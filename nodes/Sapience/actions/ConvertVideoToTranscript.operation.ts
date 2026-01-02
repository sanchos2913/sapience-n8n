import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

function safeStringify(value: unknown): string {
	try {
		if (typeof value === 'string') return value;
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

function getErrorStatus(err: unknown): string | number {
	if (typeof err !== 'object' || err === null) return 'unknown';
	const e = err as Record<string, unknown>;

	const response = e.response;
	if (typeof response === 'object' && response !== null) {
		const r = response as Record<string, unknown>;
		const sc = r.statusCode ?? r.status;
		if (typeof sc === 'number' || typeof sc === 'string') return sc;
	}

	const scTop = e.statusCode;
	if (typeof scTop === 'number' || typeof scTop === 'string') return scTop;

	return 'unknown';
}

function getErrorBody(err: unknown): unknown {
	if (typeof err !== 'object' || err === null) return err;
	const e = err as Record<string, unknown>;

	const response = e.response;
	if (typeof response === 'object' && response !== null) {
		const r = response as Record<string, unknown>;
		return r.body ?? r.data ?? r;
	}

	return e.body ?? e.message ?? err;
}

/**
 * POST /api/v2/utilities/video-to-text
 * multipart/form-data:
 *   - video_file (binary)
 * query:
 *   - model (default gpt-4o-transcribe)
 *   - language (default en)
 *
 * Uses runtime FormData & Blob (no dependencies).
 */
export async function convertVideoToTranscript(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const items = this.getInputData() as INodeExecutionData[];
	const item = items[itemIndex];

	const binaryProperty = (this.getNodeParameter('binaryProperty', itemIndex, 'data') as string) || 'data';
	const model = (this.getNodeParameter('model', itemIndex, 'gpt-4o-transcribe') as string) || 'gpt-4o-transcribe';
	const language = (this.getNodeParameter('language', itemIndex, 'en') as string) || 'en';

	const bin = item.binary?.[binaryProperty];
	if (!bin) {
		const available = Object.keys(item.binary ?? {}).join(', ');
		throw new Error(
			`No binary property "${binaryProperty}" found on item ${itemIndex}. ` +
				`Available binary properties: [${available || 'none'}]. ` +
				`Make sure the previous node outputs binary (Read Binary File / HTTP Request with Download=true).`,
		);
	}

	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryProperty);
	const fileName = bin.fileName ?? 'video.mp4';
	const mimeType = bin.mimeType ?? 'video/mp4';

	// Guard: if FormData/Blob not available in runtime, fail loudly.
	// (No globalThis usage, per community node lint rules.)
	if (typeof FormData === 'undefined' || typeof Blob === 'undefined') {
		throw new Error(
			'FormData/Blob are not available in this runtime. Ensure your n8n runs on Node.js 20+.',
		);
	}

	// Build real multipart body
	const form = new FormData();

	// ✅ Convert Buffer -> Uint8Array for TS compatibility with BlobPart
	const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });

	// Field name MUST match the API spec:
	form.append('video_file', blob, fileName);

	const options = {
		method: 'POST',
		url: `${baseUrl.replace(/\/$/, '')}/api/v2/utilities/video-to-text`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			// Do NOT set Content-Type manually (boundary is required)
		},
		qs: { model, language },
		body: form,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(
			options as unknown as IHttpRequestOptions,
		)) as IDataObject;

		return [response];
	} catch (err: unknown) {
		const status = getErrorStatus(err);
		const body = getErrorBody(err);

		throw new Error(
			`Sapience video-to-text failed (status ${status}). ` +
				`binaryProperty="${binaryProperty}", filename="${fileName}", mimeType="${mimeType}", ` +
				`model="${model}", language="${language}". ` +
				`Response: ${safeStringify(body)}`,
		);
	}
}
