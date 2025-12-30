import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class SapienceApi implements ICredentialType {
	name = 'sapienceApi';
	displayName = 'Sapience API';
	documentationUrl = 'https://docs.your-sapience-domain.com'; // optional
	icon: Icon = {
		light: 'file:sapience-white.svg',
		dark: 'file:sapience.svg', // or file:sapience.dark.svg if you have a dark variant
	};
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://dev.mainbeachadvisors.com',
			required: true,
			description: 'Base URL of the Sapience API (no trailing slash)',
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
			description: 'OAuth2 grant type (usually "password")',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: '',
			description: 'Optional OAuth scope',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'Optional OAuth client_id',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Optional OAuth client_secret',
		},
	];


	test = {
	request: {
		method: 'GET' as const,
		url: '={{ $credentials.baseUrl }}/api/v2/system/api/health',
		headers: {
			accept: 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	},
};


}
