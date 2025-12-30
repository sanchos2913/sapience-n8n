import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function fetchUrlText(
    this: IExecuteFunctions,
    i: number,
): Promise<IDataObject[]> {
    const { accessToken, baseUrl } = await getAccessToken.call(this);

    const urls = this.getNodeParameter('urls', i) as string;
    const engine = this.getNodeParameter('engine', i) as string;
    const shouldSaveAsFileToo = this.getNodeParameter(
        'shouldSaveAsFileToo',
        i,
    ) as boolean;

    const body: IDataObject = {
        urls,
        engine,
        should_save_as_file_too: shouldSaveAsFileToo,
    };

    const response = await this.helpers.httpRequest({
        method: 'POST',
        url: `${baseUrl}/api/v2/utilities/fetch-url-text`,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body,
        json: true,
    });

    return [response as IDataObject];
}