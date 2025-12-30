import { INodeProperties } from 'n8n-workflow';

export const uploadFileProperties: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['files'],
				operation: ['uploadFile'],
			},
		},
		description: 'Name of the binary property containing the file (usually "data")',
	},
	{
		displayName: 'User Description',
		name: 'userDescription',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: {
				resource: ['files'],
				operation: ['uploadFile'],
			},
		},
	},
	{
		displayName: 'Should Parse File',
		name: 'shouldParseFile',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['files'],
				operation: ['uploadFile'],
			},
		},
	},
];
