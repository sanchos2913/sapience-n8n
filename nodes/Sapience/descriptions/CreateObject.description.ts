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
		options: [
			{ name: 'Page', value: 'page' },
			{ name: 'Project', value: 'project' },
			{ name: 'Folder', value: 'folder' },
			{ name: 'Task', value: 'task' },
			{ name: 'Goal', value: 'goal' },
			{ name: 'Generic', value: 'generic' },
		],
		displayOptions: { show: { resource: ['object'], operation: ['createObject'] } },
	},

	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['object'], operation: ['createObject'] } },
	},

	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'user',
		options: [
			{ name: 'User', value: 'user' },
			{ name: 'Team', value: 'team' },
			{ name: 'Org', value: 'org' },
			{ name: 'Global', value: 'global' },
		],
		displayOptions: { show: { resource: ['object'], operation: ['createObject'] } },
	},

	{
		displayName: 'Schema Version',
		name: 'schemaVersion',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1, maxValue: 10, numberPrecision: 0 },
		displayOptions: { show: { resource: ['object'], operation: ['createObject'] } },
	},

	// =========================
	// PAGE
	// =========================
	{
		displayName: 'Parent Project',
		name: 'parentProjectUid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['page'] },
		},
		required: true,
	},

	{
		displayName: 'MBA Page Type',
		name: 'mbaPageType',
		type: 'options',
		required: true,
		default: 'document',
		options: [
			{ name: 'Document', value: 'document' },
			{ name: 'URL', value: 'url' },
			{ name: 'File', value: 'file' },
			{ name: 'Synthetic', value: 'synthetic' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['page'] },
		},
	},

	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		required: true,
		default: 'plain',
		options: [
			{ name: 'Plain Text', value: 'plain' },
			{ name: 'Markdown', value: 'markdown' },
			{ name: 'HTML', value: 'html' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['page'] },
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
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['page'] },
		},
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
		description: 'Required: project.name',
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
		description: 'Required: project.goal',
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
		description: 'Required: project.owner_username',
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
		description: 'Required: folder.folder_name',
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
		description: 'Required: folder.path (copy format from an existing folder if unsure)',
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
		description: 'Required: task.creator_username',
	},

	{
		displayName: 'Project Source',
		name: 'taskProjectSource',
		type: 'options',
		default: 'fromList',
		options: [
			{ name: 'From List', value: 'fromList' },
			{ name: 'By ID', value: 'byId' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'Required: task.project_uid',
	},

	{
		displayName: 'Project',
		name: 'taskProjectUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskProjectSource: ['fromList'],
			},
		},
	},

	{
		displayName: 'Project UID',
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
	},

	{
		displayName: 'Parent Source',
		name: 'taskParentSource',
		type: 'options',
		default: 'fromList',
		options: [
			{ name: 'From List (Project or Goal)', value: 'fromList' },
			{ name: 'By ID', value: 'byId' },
		],
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'Required: task.parent_uid (project uid or goal uid)',
	},

	{
		displayName: 'Parent Type',
		name: 'taskParentType',
		type: 'options',
		default: 'project',
		options: [
			{ name: 'Project', value: 'project' },
			{ name: 'Goal', value: 'goal' },
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
		displayName: 'Parent Project',
		name: 'taskParentProjectUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['fromList'],
				taskParentType: ['project'],
			},
		},
	},

	{
		displayName: 'Parent Goal',
		name: 'taskParentGoalUid',
		type: 'options',
		default: '',
		required: true,
		typeOptions: { loadOptionsMethod: 'getGoals' },
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['createObject'],
				metadataType: ['task'],
				taskParentSource: ['fromList'],
				taskParentType: ['goal'],
			},
		},
	},

	{
		displayName: 'Parent UID',
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
	},

	{
		displayName: 'Priority',
		name: 'taskPriority',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['object'], operation: ['createObject'], metadataType: ['task'] },
		},
		description: 'Optional. Only include if your API supports it.',
	},
];
