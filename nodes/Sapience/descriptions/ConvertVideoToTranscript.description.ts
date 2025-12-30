import { INodeProperties } from 'n8n-workflow';

export const convertVideoToTranscriptProperties: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description:
			'Name of the binary property that contains the video file (usually "data")',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['convertVideoToTranscript'],
			},
		},
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		default: 'gpt-4o-transcribe',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['convertVideoToTranscript'],
			},
		},
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'en',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['convertVideoToTranscript'],
			},
		},
	},
];
