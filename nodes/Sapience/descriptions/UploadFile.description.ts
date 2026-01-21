import { INodeProperties } from 'n8n-workflow';

export const uploadFileProperties: INodeProperties[] = [
{
displayName: 'Binary Property',
name: 'binaryPropertyName',
type: 'string',
default: 'data',
required: true,
noDataExpression: false,
displayOptions: {
show: {
resource: ['files'],
operation: ['uploadFile'],
},
},
description: 'The name of the binary property that contains the file (usually "data")',
},
{
displayName: 'User Description',
name: 'userDescription',
type: 'string',
default: '',
required: true,
noDataExpression: false,
typeOptions: {
rows: 3,
},
displayOptions: {
show: {
resource: ['files'],
operation: ['uploadFile'],
},
},
description: 'A description of the file for the backend to store alongside it',
},
{
displayName: 'Should Parse File',
name: 'shouldParseFile',
type: 'boolean',
default: false,
noDataExpression: false,
displayOptions: {
show: {
resource: ['files'],
operation: ['uploadFile'],
},
},
description: 'Whether the backend should parse the file after uploading it',
},
{
displayName: 'Additional Fields',
name: 'additionalFields',
type: 'collection',
placeholder: 'Add Field',
default: {},
displayOptions: {
show: {
resource: ['files'],
operation: ['uploadFile'],
},
},
options: [
{
displayName: 'Parent UID',
name: 'parentUid',
type: 'string',
default: 'root',
description: 'The parent UID where the file should be uploaded. Defaults to "root" if not specified.',
},
],
},
];