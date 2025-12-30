import { INodeProperties } from 'n8n-workflow';

export const fetchUrlTextProperties: INodeProperties[] = [
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		default: '',
		required: true,
		noDataExpression: true,
		description: 'A single URL, or multiple URLs separated by commas (,) or semicolons (;)',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['fetchUrlText'],
			},
		},
	},
	{
		displayName: 'Engine',
		name: 'engine',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Trafilatura', value: 'trafilatura' },
			{ name: 'BeautifulSoup', value: 'beautifulsoup' },
		],
		default: 'trafilatura',
		description: 'The extraction engine to use',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['fetchUrlText'],
			},
		},
	},
	{
		displayName: 'Save as File Too',
		name: 'shouldSaveAsFileToo',
		type: 'boolean',
		noDataExpression: true,
		default: false,
		description: 'Whether the backend should also save the extracted text as a file',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['fetchUrlText'],
			},
		},
	},
];
