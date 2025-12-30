import { INodeProperties } from 'n8n-workflow';

export const listMetaProperties: INodeProperties[] = [
	{
		displayName: 'Metadata Type',
		name: 'metadataType',
		type: 'options',
		default: 'all',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Folder', value: 'folder' },
			{ name: 'Page', value: 'page' },
			{ name: 'Project', value: 'project' },
			{ name: 'Task', value: 'task' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Generic', value: 'generic' },
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Filter returned objects by metadata type (or choose All)',
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
		default: 200,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Maximum number of objects to return',
	},
	{
		displayName: 'Include Deleted',
		name: 'includeDeleted',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Include soft-deleted objects',
	},
	{
		displayName: 'Include Counts',
		name: 'includeCounts',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['listMeta'],
			},
		},
		description: 'Include descendant counts for projects',
	},
];
