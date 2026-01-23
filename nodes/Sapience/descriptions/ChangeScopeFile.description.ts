import { INodeProperties } from 'n8n-workflow';

export const changeScopeFileProperties: INodeProperties[] = [
// File UID parameter
{
displayName: 'File UID',
name: 'fileUid',
type: 'string',
required: true,
default: '',
placeholder: 'file-j5kk6mcAYcTEpYM',
description: 'The unique identifier of the file to change scope',
displayOptions: {
show: {
resource: ['files'],
operation: ['changeScopeFile'],
},
},
},

// Scope selection parameter
{
displayName: 'Scope',
name: 'scope',
type: 'options',
required: true,
default: 'user',
options: [
{
name: 'User',
value: 'user',
description: 'File visible only to owner (default)',
},
{
name: 'Organization',
value: 'org',
description: 'File visible to all organization members',
},
],
description: 'The scope for the file - user or organization level',
displayOptions: {
show: {
resource: ['files'],
operation: ['changeScopeFile'],
},
},
},

// Optional confirmation parameter
{
displayName: 'Confirm Scope Change',
name: 'confirmScopeChange',
type: 'boolean',
default: false,
description: 'Whether to confirm the scope change action',
displayOptions: {
show: {
resource: ['files'],
operation: ['changeScopeFile'],
},
},
},
];