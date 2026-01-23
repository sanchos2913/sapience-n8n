import {
IDataObject,
IExecuteFunctions,
NodeApiError,
NodeOperationError,
} from 'n8n-workflow';

import { getAccessToken } from '../helpers/token';

export async function changeScopeFile(
this: IExecuteFunctions,
index: number,
): Promise<IDataObject[]> {
const fileUid = this.getNodeParameter('fileUid', index) as string;
const scope = this.getNodeParameter('scope', index) as string;

if (!fileUid) {
throw new NodeOperationError(
this.getNode(),
'File UID is required for scope change',
{ itemIndex: index }
);
}

try {
const { accessToken, baseUrl } = await getAccessToken.call(this);

const response = await this.helpers.httpRequest({
  method: 'PATCH',
  url: `${baseUrl}/api/v2/files/${fileUid}/scope`,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: {
    scope,
  },
  json: true,
});

// Handle successful scope change
return [
  {
    success: true,
    fileUid: fileUid,
    newScope: scope,
    message: `File scope changed to ${scope} successfully`,
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
fileUid: fileUid,
json: {},
},
];
}

if (error.httpCode === 404) {
  throw new NodeApiError(
    this.getNode(),
    { message: `File with UID '${fileUid}' not found` },
    { itemIndex: index }
  );
}

if (error.httpCode === 403) {
  throw new NodeApiError(
    this.getNode(),
    { message: `Insufficient permissions to change scope for file '${fileUid}'. Only file owners can change scope.` },
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