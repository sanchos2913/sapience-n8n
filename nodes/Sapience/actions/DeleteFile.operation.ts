import {
IDataObject,
IExecuteFunctions,
NodeApiError,
NodeOperationError,
} from 'n8n-workflow';

import { getAccessToken } from '../helpers/token';

export async function deleteFile(
this: IExecuteFunctions,
index: number,
): Promise<IDataObject[]> {
const fileId = this.getNodeParameter('fileId', index) as string;

if (!fileId) {
    throw new NodeOperationError(
        this.getNode(),
        'File ID is required for deletion',
        { itemIndex: index }
    );
}

try {
    const { accessToken, baseUrl } = await getAccessToken.call(this);

    const response = await this.helpers.httpRequest({
        method: 'DELETE',
        url: `${baseUrl}/api/v2/files/v2/${fileId}`,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        },
        json: true,
    });

    // Handle successful deletion
    return [
        {
            success: true,
            deletedFileId: fileId,
            message: 'File deleted successfully',
            ...response,
        },
    ];

} catch (error) {
    // Enhanced error handling following N8N patterns
    if (this.continueOnFail()) {
        return [
            {
                success: false,
                error: error.message,
                deletedFileId: fileId,
                json: {},
            },
        ];
    }

    if (error.httpCode === 404) {
        throw new NodeApiError(
            this.getNode(),
            { message: `File with ID '${fileId}' not found` },
            { itemIndex: index }
        );
    }

    if (error.httpCode === 403) {
        throw new NodeApiError(
            this.getNode(),
            { message: `Insufficient permissions to delete file '${fileId}'` },
            { itemIndex: index }
        );
    }

    throw new NodeApiError(
        this.getNode(),
        error,
        { itemIndex: index }
    );
}

}


