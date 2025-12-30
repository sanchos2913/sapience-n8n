import { INodeProperties } from 'n8n-workflow';

export const getAgentsListProperties: INodeProperties[] = [
	{
		displayName: 'Status Filter',
		name: 'statusFilter',
		type: 'string',
		default: 'active',
		description: 'status_filter query param, default "active"',
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
		description:
			'If true, pull from vendor before loading from DB (force_sync query param)',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['getAgentsList'],
			},
		},
	},
];
