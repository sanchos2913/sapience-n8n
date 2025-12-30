import {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

type Context = IExecuteFunctions | ILoadOptionsFunctions;

export async function getAccessToken(
	this: Context,
): Promise<{ accessToken: string; baseUrl: string }> {
	const creds = (await this.getCredentials('sapienceApi')) as IDataObject;

	const baseUrl =
		(creds.baseUrl as string) || 'https://dev.mainbeachadvisors.com';
	const username = creds.username as string;
	const password = creds.password as string;
	const grantType = (creds.grantType as string) || 'password';
	const scope = (creds.scope as string) || '';
	const clientId = (creds.clientId as string) || '';
	const clientSecret = (creds.clientSecret as string) || '';

	const formParts: string[] = [];
	const add = (key: string, value: string) => {
		if (value !== '') {
			formParts.push(
				encodeURIComponent(key) + '=' + encodeURIComponent(value),
			);
		}
	};

	add('username', username);
	add('password', password);
	add('grant_type', grantType);
	add('scope', scope);
	add('client_id', clientId);
	add('client_secret', clientSecret);

	const tokenBodyString = formParts.join('&');

	const tokenResponse = (await this.helpers.httpRequest({
		method: 'POST',
		url: `${baseUrl}/api/user/token`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: tokenBodyString,
		json: true,
	})) as IDataObject;

	const accessToken = tokenResponse.access_token as string | undefined;

	if (!accessToken) {
		throw new Error(
			'Sapience token endpoint did not return access_token. Response: ' +
				JSON.stringify(tokenResponse),
		);
	}

	return { accessToken, baseUrl };
}