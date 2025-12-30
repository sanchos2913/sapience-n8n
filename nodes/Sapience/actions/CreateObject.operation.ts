import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../helpers/token';

export async function createObject(
	this: IExecuteFunctions,
	i: number,
): Promise<IDataObject[]> {
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
		let projectUid = '';
		if (projectSource === 'fromList') {
			projectUid = this.getNodeParameter('taskProjectUid', i) as string;
		} else {
			projectUid = this.getNodeParameter('taskProjectUidManual', i) as string;
		}

		// Parent UID (required) - can be project or goal
		const parentSource = this.getNodeParameter('taskParentSource', i) as string;
		let parentUid = '';
		if (parentSource === 'byId') {
			parentUid = this.getNodeParameter('taskParentUidManual', i) as string;
		} else {
			const parentType = this.getNodeParameter('taskParentType', i) as string;
			if (parentType === 'project') {
				parentUid = this.getNodeParameter('taskParentProjectUid', i) as string;
			} else {
				parentUid = this.getNodeParameter('taskParentGoalUid', i) as string;
			}
		}

		const priority = this.getNodeParameter('taskPriority', i, '') as string;

		// root duplication
		body.creator_username = creatorUsername;
		body.project_uid = projectUid;
		body.parent_uid = parentUid;
		if (priority) body.priority = priority;

		body.task = {
			creator_username: creatorUsername,
			project_uid: projectUid,
			parent_uid: parentUid,
		};

		if (priority) {
			(body.task as IDataObject).priority = priority;
		}
	}

	const requestOptions: any = {
		method: 'POST',
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
		return [response as IDataObject];
	} catch (err: any) {
		const status = err?.response?.status;
		const data = err?.response?.data;

		throw new Error(
			`Create Object failed (${status}). Response: ${JSON.stringify(data)}. Sent body: ${JSON.stringify(body)}`,
		);
	}
}
