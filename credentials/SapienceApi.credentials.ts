import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SapienceApi implements ICredentialType {
	name = 'sapienceApi';
	displayName = 'Sapience API';

	// optional: if you have docs somewhere
	// documentationUrl = 'https://dev.mainbeachadvisors.com/api/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://dev.mainbeachadvisors.com',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'string',
			default: 'password',
			description: 'grant_type for /api/user/token, usually "password"',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
