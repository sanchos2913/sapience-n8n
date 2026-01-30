// nodes/Sapience/descriptions/ExecuteSystemAgent.description.ts
import { INodeProperties } from 'n8n-workflow';

export const executeSystemAgentProperties: INodeProperties[] = [
	{
		displayName: 'Agent Select Mode',
		name: 'agentSelectMode',
		type: 'options',
		noDataExpression: true,
		default: 'dropdown',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
			},
		},
		options: [
			{ name: 'Dropdown', value: 'dropdown' },
			{ name: 'Manual', value: 'manual' },
		],
		description: 'Choose system agent from dropdown or enter manually',
	},

	{
		displayName: 'System Agent',
		name: 'agentUidDropdown',
		type: 'options',
		noDataExpression: true,
		default: 'sys-agent-summarize',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
				agentSelectMode: ['dropdown'],
			},
		},
		options: [
			{
				name: 'Agent Builder Assistant (Gpt-5.1)',
				value: 'sys-agent-build-agent',
				description: 'Generates agent instructions + descriptions',
			},
			{
				name: 'Entity Extraction Agent (Gpt-4.1)',
				value: 'sys-agent-extract-entities',
				description: 'Extracts people, organizations, dates, etc',
			},
			{
				name: 'Summarization Agent (Gpt-4o)',
				value: 'sys-agent-summarize',
				description: 'Creates concise summaries (bullet/paragraph/executive)',
			},
			{
				name: 'Task Breakdown Agent (Gpt-4.1)',
				value: 'sys-agent-task-breakdown',
				description: 'Converts natural language into structured task objects',
			},
			{
				name: 'Translation Agent (Gpt-4o)',
				value: 'sys-agent-translate',
				description: 'Professional translation with nuance preservation',
			},
		],
		description: 'Select a pre-configured system agent',
	},

	{
		displayName: 'System Agent UID',
		name: 'agentUidManual',
		type: 'string',
		default: '',
		required: true,
		noDataExpression: false,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
				agentSelectMode: ['manual'],
			},
		},
		description: 'Enter a system agent UID, e.g. "sys-agent-translate"',
	},

	{
		displayName: 'User Query',
		name: 'userQuery',
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
				operation: ['executeSystemAgent'],
			},
		},
		description: 'Prompt/question to send to the system agent',
	},

	{
		displayName: 'Output Type',
		name: 'outputTypeBuildAgent',
		type: 'options',
		noDataExpression: true,
		default: 'agent_instructions',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
				agentSelectMode: ['dropdown'],
				agentUidDropdown: ['sys-agent-build-agent'],
			},
		},
		options: [{ name: 'Agent Instructions', value: 'agent_instructions' }],
		description: 'Automatically set for Agent Builder Assistant',
	},

	{
		displayName: 'Output Type',
		name: 'outputTypeTask',
		type: 'options',
		noDataExpression: true,
		default: 'task',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
				agentSelectMode: ['dropdown'],
				agentUidDropdown: ['sys-agent-task-breakdown'],
			},
		},
		options: [{ name: 'Task', value: 'task' }],
		description: 'Automatically set for Task Breakdown Agent',
	},

	{
		displayName: 'Output Type',
		name: 'outputTypeGeneral',
		type: 'options',
		noDataExpression: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
			},
			hide: {
				agentSelectMode: ['dropdown'],
				agentUidDropdown: ['sys-agent-task-breakdown', 'sys-agent-build-agent'],
			},
		},
		options: [
			{ name: 'Agent Instructions', value: 'agent_instructions' },
			{ name: 'Document Translation', value: 'document_translation' },
			{ name: 'Folder', value: 'folder' },
			{ name: 'Generic', value: 'generic' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Page', value: 'page' },
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
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['executeSystemAgent'],
			},
		},
		options: [
			{
				displayName: 'Context (JSON)',
				name: 'context',
				type: 'json',
				default: '{}',
				description:
					'Optional context object. Example: {"user_name":"Ken","project_name":"Birthday Party Planning"}.',
			},
		],
	},
];
