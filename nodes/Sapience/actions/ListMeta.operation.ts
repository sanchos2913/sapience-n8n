import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function listMeta(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const metadataType = this.getNodeParameter('metadataType', i, 'all') as string;
	const limit = this.getNodeParameter('limit', i, 200) as number;
	const includeDeleted = this.getNodeParameter('includeDeleted', i, false) as boolean;
	const includeCounts = this.getNodeParameter('includeCounts', i, false) as boolean;

	const qs: IDataObject = {
		limit,
		include_deleted: includeDeleted,
		include_counts: includeCounts,
	};

	// Only send metadata_type if user didn't choose "all"
	if (metadataType !== 'all') {
		qs.metadata_type = metadataType;
	}

	const response = await this.helpers.httpRequest({
		method: 'GET',
		url: `${baseUrl}/api/v2/sapience/list-meta`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
		},
		qs,
		json: true,
	});

	return [response as IDataObject];
}
