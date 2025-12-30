import { INodeProperties } from 'n8n-workflow';

export const fetchUrlTextProperties: INodeProperties[] = [
	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		default: '',
		required: true,
		description:
			'Single URL, or multiple URLs separated by comma (,) or semicolon (;)',
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
		options: [
			{ name: 'Trafilatura', value: 'trafilatura' },
			{ name: 'BeautifulSoup', value: 'beautifulsoup' },
		],
		default: 'trafilatura',
		description: 'Extraction engine to use',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['fetchUrlText'],
			},
		},
	},
	{
		displayName: 'Save As File Too',
		name: 'shouldSaveAsFileToo',
		type: 'boolean',
		default: false,
		description: 'Whether the backend should also save the text as a file',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['fetchUrlText'],
			},
		},
	},
];
