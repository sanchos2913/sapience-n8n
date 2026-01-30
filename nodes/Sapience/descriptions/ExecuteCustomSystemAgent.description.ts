// nodes/Sapience/descriptions/ExecuteCustomSystemAgent.description.ts
import { INodeProperties } from 'n8n-workflow';

export const executeCustomSystemAgentProperties: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'customModel',
		type: 'options',
		noDataExpression: true,
		default: 'gpt-4o',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		options: [
			{ name: 'gpt-4o', value: 'gpt-4o' },
			{ name: 'gpt-4.1', value: 'gpt-4.1' },
			{ name: 'o3-mini', value: 'o3-mini' },
			{ name: 'gpt-5.2', value: 'gpt-5.2' },
		],
		description: 'OpenAI model to use',
	},
	{
		displayName: 'System Instructions',
		name: 'customSystemInstructions',
		type: 'string',
		default: '',
		required: true,
		noDataExpression: false,
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		description: 'Complete system prompt for the agent',
	},
	{
		displayName: 'User Query',
		name: 'customUserQuery',
		type: 'string',
		default: '',
		required: true,
		noDataExpression: false,
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		description: 'The user\'s input/question',
	},
	{
		displayName: 'Temperature',
		name: 'customTemperature',
		type: 'number',
		default: 0.3,
		typeOptions: {
			minValue: 0,
			maxValue: 2,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		description: '0.0-2.0 (ignored for reasoning models like o3)',
	},
	{
		displayName: 'Output Type',
		name: 'customOutputType',
		type: 'options',
		noDataExpression: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		options: [
			{ name: 'Agent Instructions', value: 'agent_instructions' },
			{ name: 'Document Translation', value: 'document_translation' },
			{ name: 'Generic', value: 'generic' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Project', value: 'project' },
			{ name: 'Task', value: 'task' },
			{
				name: 'Text (Default)',
				value: '',
				description: 'Omit output_type for plain text output',
			},
		],
		description: 'Structured output type; leave empty for plain text output',
	},
	{
		displayName: 'Additional Fields',
		name: 'customAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeCustomSystemAgent'],
			},
		},
		options: [
			{
				displayName: 'Context (JSON)',
				name: 'context',
				type: 'json',
				default: '{}',
				description:
					'Optional context object. Example: {"company_name":"SuperStore","customer_name":"Maria"}.',
			},
		],
	},
];
