import { INodeProperties } from 'n8n-workflow';

export const getAgentsListProperties: INodeProperties[] = [
	{
		displayName: 'Status Filter',
		name: 'statusFilter',
		type: 'string',
		default: 'active',
		noDataExpression: true,
		description: 'Optional status filter (status_filter query parameter)',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentsList'],
			},
		},
	},
	{
		displayName: 'Force Sync',
		name: 'forceSync',
		type: 'boolean',
		default: false,
		noDataExpression: true,
		description: 'Whether to fetch from the vendor before reading from the database (force_sync)',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentsList'],
			},
		},
	},
];
