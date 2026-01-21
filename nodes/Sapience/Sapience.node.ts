import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { fetchUrlText } from './actions/FetchUrlText.operation';
import { getAgentsList } from './actions/GetAgentsList.operation';
import { agentResponse } from './actions/AgentResponse.operation';
import { convertVideoToTranscript } from './actions/ConvertVideoToTranscript.operation';
import { uploadFile } from './actions/UploadFile.operation';
import { listMeta } from './actions/ListMeta.operation';
import { createObject } from './actions/CreateObject.operation';
import { deleteFile } from './actions/DeleteFile.operation';

import { fetchUrlTextProperties } from './descriptions/FetchUrlText.description';
import { getAgentsListProperties } from './descriptions/GetAgentsList.description';
import { agentResponseProperties } from './descriptions/AgentResponse.description';
import { convertVideoToTranscriptProperties } from './descriptions/ConvertVideoToTranscript.description';
import { uploadFileProperties } from './descriptions/UploadFile.description';
import { listMetaProperties } from './descriptions/ListMeta.description';
import { createObjectProperties } from './descriptions/CreateObject.description';
import { deleteFileProperties } from './descriptions/DeleteFile.description';

import { getAccessToken } from './helpers/token';

export class Sapience implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sapience',
		name: 'sapience',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Sapience API integration',
		defaults: {
			name: 'Sapience',
		},
		inputs: ['main'],
		outputs: ['main'],
		icon: {
			light: 'file:sapience.svg',
			dark: 'file:sapience-white.svg',
		},

		credentials: [
			{
				name: 'sapienceApi',
				required: true,
			},
		],

		properties: [
			// =========================
			// RESOURCE
			// =========================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				default: 'utilities',
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'File', value: 'files' },
					{ name: 'Object', value: 'object' },
					{ name: 'Utility', value: 'utilities' },
				],
			},

			// =========================
			// UTILITIES OPERATIONS
			// =========================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'fetchUrlText',
				displayOptions: {
					show: { resource: ['utilities'] },
				},
				options: [
					{
						name: 'Fetch URL Text',
						value: 'fetchUrlText',
						action: 'Fetch url text',
					},
					{
						name: 'Convert Video To Transcript',
						value: 'convertVideoToTranscript',
						action: 'Convert video to transcript',
					},
				],
			},

			// =========================
			// AGENT OPERATIONS
			// =========================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'agentResponse',
				displayOptions: {
					show: { resource: ['agent'] },
				},
				options: [
					{
						name: 'Get Agents List',
						value: 'getAgentsList',
						action: 'Get agents list',
					},
					{
						name: 'Agent Response',
						value: 'agentResponse',
						action: 'Response',
					},
				],
			},

			// =========================
			// FILES OPERATIONS
			// =========================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'uploadFile',
				displayOptions: {
					show: { resource: ['files'] },
				},
				options: [
					{
						name: 'Upload',
						value: 'uploadFile',
						action: 'Upload',
					},
					{
						name: 'Delete',
						value: 'deleteFile',
						action: 'Delete file',
					},
				],
			},

			// =========================
			// OBJECT OPERATIONS
			// =========================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'listMeta',
				displayOptions: {
					show: { resource: ['object'] },
				},
				options: [
					{
						name: 'List Meta',
						value: 'listMeta',
						action: 'List meta',
					},
					{
						name: 'Create',
						value: 'createObject',
						action: 'Create',
					},
				],
			},

			// =========================
			// OPERATION FIELDS
			// =========================
			...fetchUrlTextProperties,
			...getAgentsListProperties,
			...agentResponseProperties,
			...convertVideoToTranscriptProperties,
			...uploadFileProperties,
			...listMetaProperties,
			...createObjectProperties,
			...deleteFileProperties,
		],
	};

	// =========================
	// LOAD OPTIONS
	// =========================
	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { accessToken, baseUrl } = await getAccessToken.call(this);

				const agentsResponse = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseUrl}/api/v2/agents/list`,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: 'application/json',
					},
					qs: {
						status_filter: 'active',
						force_sync: false,
					},
					json: true,
				})) as IDataObject;

				const agents = (agentsResponse.data as IDataObject[]) || [];

				return agents.map((agent) => ({
					name:
						(agent.name as string) ||
						(agent.unique_id as string) ||
						`Agent ${(agent.id as number | string).toString()}`,
					value:
						(agent.unique_id as string) ||
						(agent.id as number | string).toString(),
					description: (agent.description as string) || '',
				}));
			},

			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { accessToken, baseUrl } = await getAccessToken.call(this);

				const res = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseUrl}/api/v2/sapience/list-meta`,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: 'application/json',
					},
					qs: {
						metadata_type: 'project',
						limit: 200,
						include_deleted: false,
						include_counts: false,
					},
					json: true,
				})) as IDataObject;

				const data = (res.data as IDataObject[]) || [];

				return data.map((p) => ({
					name: (p.display_name as string) || (p.uid as string),
					value: p.uid as string,
					description: `Type: ${(p.metadata_type as string) || 'project'}`,
				}));
			},

			async getGoals(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { accessToken, baseUrl } = await getAccessToken.call(this);

				const res = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${baseUrl}/api/v2/sapience/list-meta`,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: 'application/json',
					},
					qs: {
						metadata_type: 'goal',
						limit: 200,
						include_deleted: false,
						include_counts: false,
					},
					json: true,
				})) as IDataObject;

				const data = (res.data as IDataObject[]) || [];

				return data.map((g) => ({
					name: (g.display_name as string) || (g.uid as string),
					value: g.uid as string,
					description: `Type: ${(g.metadata_type as string) || 'goal'}`,
				}));
			},
		},
	};

	// =========================
	// EXECUTION
	// =========================
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;

		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			let opResult: IDataObject[];

			switch (operation) {
				case 'fetchUrlText':
					opResult = await fetchUrlText.call(this, i);
					break;

				case 'convertVideoToTranscript':
					opResult = await convertVideoToTranscript.call(this, i);
					break;

				case 'getAgentsList':
					opResult = await getAgentsList.call(this, i);
					break;

				case 'agentResponse':
					opResult = await agentResponse.call(this, i);
					break;

				case 'uploadFile':
					opResult = await uploadFile.call(this, i);
					break;

				case 'listMeta':
					opResult = await listMeta.call(this, i);
					break;

				case 'createObject':
					opResult = await createObject.call(this, i);
					break;

				case 'deleteFile':
					opResult = await deleteFile.call(this, i);
					break;

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push(...opResult);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
