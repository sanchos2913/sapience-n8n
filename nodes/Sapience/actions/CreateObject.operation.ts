import { IExecuteFunctions, IDataObject, NodeApiError, NodeOperationError } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function createObject(this: IExecuteFunctions, i: number): Promise<IDataObject[]> {
	const { accessToken, baseUrl } = await getAccessToken.call(this);

	const metadataType = this.getNodeParameter('metadataType', i) as string;
	let schemaVersion = this.getNodeParameter('schemaVersion', i) as number;
	const scope = this.getNodeParameter('scope', i) as string;
	const displayName = this.getNodeParameter('displayName', i) as string;

	// Page requires schema v2
	if (metadataType === 'page' && schemaVersion < 2) {
		schemaVersion = 2;
	}

	const body: IDataObject = {
		uid: '',
		user_id: -1,
		org_id: -1,
		metadata_type: metadataType,
		schema_version: schemaVersion,
		scope,
		display_name: displayName,
	};

	// =========================
	// PAGE
	// =========================
	if (metadataType === 'page') {
		const parentProjectUid = this.getNodeParameter('parentProjectUid', i) as string;
		const mbaPageType = this.getNodeParameter('mbaPageType', i) as string;
		const contentType = this.getNodeParameter('contentType', i) as string;
		const pageDescription = this.getNodeParameter('pageDescription', i) as string;
		const pageContent = this.getNodeParameter('pageContent', i, '') as string;

		body.parent_uid = parentProjectUid;

		// root duplication (required by backend)
		body.mba_page_type = mbaPageType;
		body.content_type = contentType;
		body.description = pageDescription;
		if (pageContent) body.content = pageContent;

		body.page = {
			mba_page_type: mbaPageType,
			content_type: contentType,
			description: pageDescription,
			content: pageContent || null,
		};
	}

	// =========================
	// PROJECT
	// =========================
	if (metadataType === 'project') {
		const name = this.getNodeParameter('projectName', i) as string;
		const goal = this.getNodeParameter('projectGoal', i) as string;
		const ownerUsername = this.getNodeParameter('projectOwnerUsername', i) as string;

		body.name = name;
		body.goal = goal;
		body.owner_username = ownerUsername;

		body.project = {
			name,
			goal,
			owner_username: ownerUsername,
		};
	}

	// =========================
	// FOLDER
	// =========================
	if (metadataType === 'folder') {
		const folderName = this.getNodeParameter('folderName', i) as string;
		const folderPath = this.getNodeParameter('folderPath', i) as string;

		body.folder_name = folderName;
		body.path = folderPath;

		body.folder = {
			folder_name: folderName,
			path: folderPath,
		};
	}

	// =========================
	// TASK
	// =========================
	if (metadataType === 'task') {
		const creatorUsername = this.getNodeParameter('taskCreatorUsername', i) as string;

		// Project UID (required)
		const projectSource = this.getNodeParameter('taskProjectSource', i) as string;
		const projectUid =
			projectSource === 'fromList'
				? (this.getNodeParameter('taskProjectUid', i) as string)
				: (this.getNodeParameter('taskProjectUidManual', i) as string);

		// Parent UID (required) - can be project or goal
		const parentSource = this.getNodeParameter('taskParentSource', i) as string;
		let parentUid = '';
		if (parentSource === 'byId') {
			parentUid = this.getNodeParameter('taskParentUidManual', i) as string;
		} else {
			const parentType = this.getNodeParameter('taskParentType', i) as string;
			parentUid =
				parentType === 'project'
					? (this.getNodeParameter('taskParentProjectUid', i) as string)
					: (this.getNodeParameter('taskParentGoalUid', i) as string);
		}

		const priority = this.getNodeParameter('taskPriority', i, '') as string;

		// root duplication
		body.creator_username = creatorUsername;
		body.project_uid = projectUid;
		body.parent_uid = parentUid;
		if (priority) body.priority = priority;

		const task: IDataObject = {
			creator_username: creatorUsername,
			project_uid: projectUid,
			parent_uid: parentUid,
		};

		if (priority) task.priority = priority;

		body.task = task;
	}

	const requestOptions = {
		method: 'POST' as const,
		url: `${baseUrl}/api/v2/sapience/create`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body,
		json: true,
	};

	try {
		const response = await this.helpers.httpRequest(requestOptions);

		// With json:true, response is typically an object already
		if (typeof response === 'object' && response !== null) {
			return [response as IDataObject];
		}

		return [{ raw: response } as IDataObject];
	} catch (error: unknown) {
		// If you prefer NodeApiError and your typings allow it, use it.
		// Some n8n-workflow versions type NodeApiError more strictly.
		try {
			throw new NodeApiError(this.getNode(), error as never);
		} catch {
			// Fallback: always valid
			throw new NodeOperationError(this.getNode(), 'Create Object failed', {
				description: JSON.stringify({
					error,
					sentBody: body,
				}),
			});
		}
	}
}
