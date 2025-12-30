import { INodeProperties } from 'n8n-workflow';

export const agentResponseProperties: INodeProperties[] = [
	{
		displayName: 'Agent Source',
		name: 'agentSource',
		type: 'options',
		options: [
			{
				name: 'From List',
				value: 'fromList',
				description: 'Choose an agent from the list',
			},
			{
				name: 'By ID',
				value: 'byId',
				description: 'Specify an agent ID manually',
			},
		],
		default: 'fromList',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
	},

	{
		displayName: 'Agent Name or ID',
		name: 'agentUid',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
				agentSource: ['fromList'],
			},
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	{
		displayName: 'Agent ID',
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
		description: 'Specify the agent ID manually',
	},

	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
		description: 'The user query to send to the agent',
	},

	{
		displayName: 'Conversation ID',
		name: 'conversationUid',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
		description: 'Optional conversation ID to continue an existing conversation',
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
		description: 'Optional conversation name for a new conversation',
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
		description: 'Response generation mode',
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
		description: 'Optional model override',
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
		description: 'Controls randomness of the response',
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
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['agentResponse'],
			},
		},
		description: 'How much reasoning effort the model should apply',
	},
];
