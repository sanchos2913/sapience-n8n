import { INodeProperties } from 'n8n-workflow';

export const deleteFileProperties: INodeProperties[] = [
// File ID parameter
{
displayName: 'File ID',
name: 'fileId',
type: 'string',
required: true,
default: '',
placeholder: 'file-j5kk6mcAYcTEpYM',
description: 'The unique identifier of the file to delete',
displayOptions: {
show: {
resource: ['files'],
operation: ['deleteFile'],
},
},
},

// Optional confirmation parameter
{
    displayName: 'Confirm Deletion',
    name: 'confirmDeletion',
    type: 'boolean',
    default: false,
    description: 'Whether to confirm the deletion action',
    displayOptions: {
        show: {
            resource: ['files'],
            operation: ['deleteFile'],
        },
    },
},

];