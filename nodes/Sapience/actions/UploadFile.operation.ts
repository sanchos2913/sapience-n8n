import {
IExecuteFunctions,
IDataObject,
NodeOperationError,
} from 'n8n-workflow';
import type { IHttpRequestOptions } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function uploadFile(
this: IExecuteFunctions,
i: number,
): Promise<IDataObject[]> {
const { accessToken, baseUrl } = await getAccessToken.call(this);

const binaryPropertyName = this.getNodeParameter(
    'binaryPropertyName',
    i,
    'data',
) as string;
const userDescription = this.getNodeParameter('userDescription', i) as string;
const shouldParseFile = this.getNodeParameter(
    'shouldParseFile',
    i,
    false,
) as boolean;

// Get parent_uid from additional fields, default to 'root'
const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
const parentUid = (additionalFields.parentUid as string) || 'root';

const items = this.getInputData();
const binary = items[i].binary?.[binaryPropertyName];

if (!binary) {
    throw new NodeOperationError(
        this.getNode(),
        `No binary data found. Expected binary property "${binaryPropertyName}".`,
        { itemIndex: i },
    );
}

const binaryData = await this.helpers.getBinaryDataBuffer(
    i,
    binaryPropertyName,
);

const fileName = (binary.fileName as string) ?? 'upload.bin';
const mimeType = (binary.mimeType as string) ?? 'application/octet-stream';

// Prepare the multipart form data in the format n8n's httpRequest expects
const boundary = `----FormBoundary${Math.random().toString(36).substring(2)}`;

const formParts: Buffer[] = [];

// Add parent_uid field
formParts.push(
    Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="parent_uid"\r\n\r\n` +
        `${parentUid}\r\n`
    )
);

// Add user_description field
formParts.push(
    Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="user_description"\r\n\r\n` +
        `${userDescription}\r\n`
    )
);

// Add should_parse_file field
formParts.push(
    Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="should_parse_file"\r\n\r\n` +
        `${String(shouldParseFile)}\r\n`
    )
);

// Add file field
formParts.push(
    Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
        `Content-Type: ${mimeType}\r\n\r\n`
    )
);
formParts.push(binaryData);
formParts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

const body = Buffer.concat(formParts);

const requestOptions: IHttpRequestOptions = {
    method: 'POST',
    url: `${baseUrl}/api/files/upload`,
    headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': String(body.length),
    },
    body,
    returnFullResponse: false,
};

try {
    const response = await this.helpers.httpRequest(requestOptions);
    
    // Parse response if it's a string
    let parsedResponse: IDataObject;
    if (typeof response === 'string') {
        try {
            parsedResponse = JSON.parse(response) as IDataObject;
        } catch {
            parsedResponse = { response } as IDataObject;
        }
    } else {
        parsedResponse = response as IDataObject;
    }
    
    return [parsedResponse];
} catch (error: unknown) {
    const err = error as { 
        cause?: {
            response?: {
                statusCode?: number;
                body?: string;
            };
        };
        response?: { 
            statusCode?: number;
            statusMessage?: string;
            body?: string | IDataObject;
        };
        statusCode?: number;
        message?: string;
    };
    
    const status = err?.cause?.response?.statusCode ?? 
                  err?.response?.statusCode ?? 
                  err?.statusCode;
    const responseBody = err?.cause?.response?.body ?? 
                       err?.response?.body;
    const errorMessage = err?.message;

    let errorDetails = '';
    if (responseBody) {
        errorDetails = typeof responseBody === 'string' 
            ? responseBody 
            : JSON.stringify(responseBody);
    } else if (errorMessage) {
        errorDetails = errorMessage;
    }

    throw new NodeOperationError(
        this.getNode(),
        `Upload failed (${status ?? 'unknown'}). ${errorDetails}`,
        { itemIndex: i },
    );
}

}