import { INodeProperties } from 'n8n-workflow';

export const convertVideoToTranscriptProperties: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		noDataExpression: true,
		description: 'The name of the binary property that contains the video file (usually "data")',
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
		noDataExpression: true,
		description: 'The transcription model to use',
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
		noDataExpression: true,
		description: 'The language code for the transcription (for example, "en")',
		displayOptions: {
			show: {
				resource: ['utilities'],
				operation: ['convertVideoToTranscript'],
			},
		},
	},
];
