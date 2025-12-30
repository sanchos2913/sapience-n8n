import { INodeProperties } from 'n8n-workflow';

export const agentResponseProperties: INodeProperties[] = [
	{
		displayName: 'Agent Source',
		name: 'agentSource',
		type: 'options',
		options: [
			{ name: 'From List', value: 'fromList', description: 'Pick from list' },
			{ name: 'By ID', value: 'byId', description: 'Enter agent UID manually' },
		],
		default: 'fromList',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Agent',
		name: 'agentUid',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
				agentSource: ['fromList'],
			},
		},
		description: 'Select an agent from the list',
	},

	{
		displayName: 'Agent UID',
		name: 'agentUidManual',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
				agentSource: ['byId'],
			},
		},
		description: 'Enter the agent UID manually',
	},

	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
		description: 'User query to send to the agent',
	},

	{
		displayName: 'Conversation UID',
		name: 'conversationUid',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Conversation Name',
		name: 'conversationName',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Mode',
		name: 'mode',
		type: 'string',
		default: 'default',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Temperature',
		name: 'temperature',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 2,
			numberPrecision: 2,
		},
		default: 0.3,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Reasoning Effort',
		name: 'reasoningEffort',
		type: 'options',
		options: [
			{ name: 'Low', value: 'low' },
			{ name: 'Medium', value: 'medium' },
			{ name: 'High', value: 'high' },
		],
		default: 'low',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},
];
