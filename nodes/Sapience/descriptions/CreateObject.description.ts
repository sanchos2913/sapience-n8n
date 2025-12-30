import { INodeProperties } from 'n8n-workflow';


export const createObjectProperties: INodeProperties[] = [
	// =========================
	// CORE
	// =========================
	{
		displayName: 'Metadata Type',
		name: 'metadataType',
		type: 'options',
		default: 'page',
		noDataExpression: true,
		// Alphabetized by name (required by lint)
		options: [
			{ name: 'Folder', value: 'folder' },
			{ name: 'Generic', value: 'generic' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Page', value: 'page' },
			{ name: 'Project', value: 'project' },
			{ name: 'Task', value: 'task' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'] },
		},
	},

	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'] },
		},
		description: 'The display name for the object',
	},

	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'user',
		noDataExpression: true,
		options: [
			{ name: 'Global', value: 'global' },
			{ name: 'Org', value: 'org' },
			{ name: 'Team', value: 'team' },
			{ name: 'User', value: 'user' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'] },
		},
		description: 'The scope for the object',
	},

	{
		displayName: 'Schema Version',
		name: 'schemaVersion',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1, maxValue: 10, numberPrecision: 0 },
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'] },
		},
		description: 'The schema version to use',
	},

	// =========================
	// PAGE
	// =========================
	{
		displayName: 'Parent Project Name or ID',
		name: 'parentProjectUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getProjects' },
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['page'],
			},
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	{
		displayName: 'MBA Page Type',
		name: 'mbaPageType',
		type: 'options',
		required: true,
		default: 'document',
		noDataExpression: true,
		options: [
			{ name: 'Document', value: 'document' },
			{ name: 'File', value: 'file' },
			{ name: 'Synthetic', value: 'synthetic' },
			{ name: 'URL', value: 'url' },
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['page'],
			},
		},
	},

	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		required: true,
		default: 'plain',
		noDataExpression: true,
		options: [
			{ name: 'HTML', value: 'html' },
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'Plain Text', value: 'plain' },
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['page'],
			},
		},
	},

	{
		displayName: 'Page Description',
		name: 'pageDescription',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['page'],
			},
		},
		description: 'A description of the page',
	},

	{
		displayName: 'Content',
		name: 'pageContent',
		type: 'string',
		typeOptions: { rows: 10 },
		default: '',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['page'],
				mbaPageType: ['document'],
			},
		},
		description: 'The content for the page',
	},

	// =========================
	// PROJECT (required)
	// =========================
	{
		displayName: 'Project Name',
		name: 'projectName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['project'] },
		},
		description: 'The name of the project',
	},

	{
		displayName: 'Project Goal',
		name: 'projectGoal',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['project'] },
		},
		description: 'The goal for the project',
	},

	{
		displayName: 'Owner Username',
		name: 'projectOwnerUsername',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['project'] },
		},
		description: 'The username of the project owner',
	},

	// =========================
	// FOLDER (required)
	// =========================
	{
		displayName: 'Folder Name',
		name: 'folderName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['folder'] },
		},
	},

	{
		displayName: 'Path',
		name: 'folderPath',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['folder'] },
		},
		description: 'The folder path',
	},

	// =========================
	// TASK (required)
	// =========================
	{
		displayName: 'Creator Username',
		name: 'taskCreatorUsername',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'The username of the task creator',
	},

	{
		displayName: 'Project Source',
		name: 'taskProjectSource',
		type: 'options',
		default: 'fromList',
		noDataExpression: true,
		options: [
			{ name: 'By ID', value: 'byId' },
			{ name: 'From List', value: 'fromList' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'How to specify the project',
	},

	{
		displayName: 'Project Name or ID',
		name: 'taskProjectUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getProjects' },
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskProjectSource: ['fromList'],
			},
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	{
		displayName: 'Project ID',
		name: 'taskProjectUidManual',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskProjectSource: ['byId'],
			},
		},
		description: 'Specify the project ID manually',
	},

	{
		displayName: 'Parent Source',
		name: 'taskParentSource',
		type: 'options',
		default: 'fromList',
		noDataExpression: true,
		options: [
			{ name: 'By ID', value: 'byId' },
			{
				name: 'From List (Project or Goal)',
				value: 'fromList',
			},
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'How to specify the parent',
	},

	{
		displayName: 'Parent Type',
		name: 'taskParentType',
		type: 'options',
		default: 'project',
		noDataExpression: true,
		options: [
			{ name: 'Goal', value: 'goal' },
			{ name: 'Project', value: 'project' },
		],
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['fromList'],
			},
		},
	},

	{
		displayName: 'Parent Project Name or ID',
		name: 'taskParentProjectUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getProjects' },
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['fromList'],
				taskParentType: ['project'],
			},
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	{
		displayName: 'Parent Goal Name or ID',
		name: 'taskParentGoalUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getGoals' },
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['fromList'],
				taskParentType: ['goal'],
			},
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},

	{
		displayName: 'Parent ID',
		name: 'taskParentUidManual',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['byId'],
			},
		},
		description: 'Specify the parent ID manually',
	},

	{
		displayName: 'Priority',
		name: 'taskPriority',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'Optional priority value',
	},
];
