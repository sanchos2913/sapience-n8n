import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function getAgentsList(
    this: IExecuteFunctions,
    i: number,
): Promise<IDataObject[]> {
    const { accessToken, baseUrl } = await getAccessToken.call(this);

    const statusFilter = this.getNodeParameter('statusFilter', i) as string;
    const forceSync = this.getNodeParameter('forceSync', i) as boolean;

    const agentsResponse = (await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/api/v2/agents/list`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
        qs: {
            status_filter: statusFilter,
            force_sync: forceSync,
        },
        json: true,
    })) as IDataObject;

    const agents = (agentsResponse.data as IDataObject[]) || [];

    // return each agent as its own item
    return agents;
}
