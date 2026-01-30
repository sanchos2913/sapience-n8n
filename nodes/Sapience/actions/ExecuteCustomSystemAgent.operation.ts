import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import type { IHttpRequestOptions } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function executeCustomSystemAgent(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const model = this.getNodeParameter('customModel', i) as string;
	const systemInstructions = this.getNodeParameter('customSystemInstructions', i) as string;
	const userQuery = this.getNodeParameter('customUserQuery', i) as string;

	const temperature = this.getNodeParameter('customTemperature', i, 0.3) as number;
	const outputType = this.getNodeParameter('customOutputType', i, '') as string;

	const additionalFields = this.getNodeParameter('customAdditionalFields', i, {}) as IDataObject;

	// n8n "json" parameter can come through as string or object depending on editor/runtime
	const contextParam = additionalFields.context as unknown;

	let context: IDataObject = {};
	if (typeof contextParam === 'string') {
		const trimmed = contextParam.trim();
		if (trimmed) {
			try {
				context = JSON.parse(trimmed) as IDataObject;
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid Context (JSON). Please provide a valid JSON object.',
					{ itemIndex: i },
				);
			}
		}
	} else if (contextParam && typeof contextParam === 'object') {
		context = contextParam as IDataObject;
	}

	const body: IDataObject = {
		model,
		system_instructions: systemInstructions,
		user_query: userQuery,
		temperature,
	};

	if (outputType) {
		body.output_type = outputType;
	}

	if (Object.keys(context).length > 0) {
		body.context = context;
	}

	const requestOptions: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/api/v2/system-agents/execute-custom`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(requestOptions)) as IDataObject;
		return [response];
	} catch (error: unknown) {
		const err = error as {
			cause?: { response?: { statusCode?: number; body?: string } };
			response?: { statusCode?: number; body?: string | IDataObject };
			statusCode?: number;
			message?: string;
		};

		const status =
			err?.cause?.response?.statusCode ??
			err?.response?.statusCode ??
			err?.statusCode;

		const responseBody = err?.cause?.response?.body ?? err?.response?.body;
		const errorMessage = err?.message;

		let errorDetails = '';
		if (responseBody) {
			errorDetails =
				typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);
		} else if (errorMessage) {
			errorDetails = errorMessage;
		}

		throw new NodeOperationError(
			this.getNode(),
			`Custom system agent execution failed (${status ?? 'unknown'}). ${errorDetails}`,
			{ itemIndex: i },
		);
	}
}
