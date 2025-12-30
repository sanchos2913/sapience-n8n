import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function agentResponse(
    this: IExecuteFunctions,
    i: number,
): Promise<IDataObject[]> {
    const { accessToken, baseUrl } = await getAccessToken.call(this);

    const agentSource = this.getNodeParameter('agentSource', i) as string;

    let agentUid: string;
    if (agentSource === 'fromList') {
        agentUid = this.getNodeParameter('agentUid', i) as string;
    } else {
        agentUid = this.getNodeParameter('agentUidManual', i) as string;
    }

    const query = this.getNodeParameter('query', i) as string;
    const conversationUid = this.getNodeParameter(
        'conversationUid',
        i,
        '',
    ) as string;
    const conversationName = this.getNodeParameter(
        'conversationName',
        i,
        '',
    ) as string;
    const mode = this.getNodeParameter('mode', i, 'default') as string;

    const model = this.getNodeParameter('model', i, '') as string;
    const temperature = this.getNodeParameter(
        'temperature',
        i,
        0.3,
    ) as number;
    const reasoningEffort = this.getNodeParameter(
        'reasoningEffort',
        i,
        'low',
    ) as string;

    // All params go into query string (GET)
    const qs: IDataObject = {
        agent_uid: agentUid,
        query,
        mode,
        temperature,
        reasoning_effort: reasoningEffort,
    };

    if (conversationUid) {
        qs.conversation_uid = conversationUid;
    }
    if (conversationName) {
        qs.conversation_name = conversationName;
    }
    if (model) {
        qs.model = model;
    }

    const response = await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/api/v2/agents/agent-response-no-stream`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
        qs,
        json: true,
    });

    return [response as IDataObject];
}
