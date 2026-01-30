// actions/ExecuteSystemAgent.operation.ts
import { IDataObject, IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import type { IHttpRequestOptions } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function executeSystemAgent(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const agentSelectMode = this.getNodeParameter('agentSelectMode', i, 'dropdown') as string;

	const agentUid =
		agentSelectMode === 'manual'
			? (this.getNodeParameter('agentUidManual', i) as string)
			: (this.getNodeParameter('agentUidDropdown', i) as string);

	const userQuery = this.getNodeParameter('userQuery', i) as string;

	// Output type resolution order:
	// 1) Explicit user selection
	// 2) Auto for build-agent
	// 3) Auto for task-breakdown
	const outputTypeGeneral = this.getNodeParameter('outputTypeGeneral', i, '') as string;
	const outputTypeBuildAgent = this.getNodeParameter('outputTypeBuildAgent', i, '') as string;
	const outputTypeTask = this.getNodeParameter('outputTypeTask', i, '') as string;
	const outputType = outputTypeGeneral || outputTypeBuildAgent || outputTypeTask;

	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

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
		agent_uid: agentUid,
		user_query: userQuery,
	};

	// If outputType omitted/empty -> text mode
	if (outputType) {
		body.output_type = outputType;
	}

	// Send context only when it has keys
	if (Object.keys(context).length > 0) {
		body.context = context;
	}

	const requestOptions: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/api/v2/system-agents/execute`,
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
			`System agent execution failed (${status ?? 'unknown'}). ${errorDetails}`,
			{ itemIndex: i },
		);
	}
}
