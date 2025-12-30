import { INodeProperties } from 'n8n-workflow';

export const listMetaProperties: INodeProperties[] = [
	{
		displayName: 'Metadata Type',
		name: 'metadataType',
		type: 'options',
		default: 'all',
		noDataExpression: true,
		// Alphabetized by name
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Folder', value: 'folder' },
			{ name: 'Generic', value: 'generic' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Page', value: 'page' },
			{ name: 'Project', value: 'project' },
			{ name: 'Task', value: 'task' },
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Filter returned objects by metadata type',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
			numberPrecision: 0,
		},
		default: 50,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Include Deleted',
		name: 'includeDeleted',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Whether to include soft-deleted objects',
	},
	{
		displayName: 'Include Counts',
		name: 'includeCounts',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Whether to include descendant counts for projects',
	},
];
