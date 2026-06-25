import { apiRequest } from './httpClient'
import type {
  CreateProjectRequest,
  ProjectDto,
  ProjectListQuery,
  ProjectListResponse,
  UpdateProjectRequest,
} from '../types/project'

export function getProjects(accessToken: string, query?: ProjectListQuery) {
  return apiRequest<ProjectListResponse>(buildProjectsPath(query), {
    token: accessToken,
  })
}

export function getProject(accessToken: string, projectId: string) {
  return apiRequest<ProjectDto>(`/projects/${projectId}`, {
    token: accessToken,
  })
}

export function createProject(
  accessToken: string,
  request: CreateProjectRequest,
) {
  return apiRequest<ProjectDto>('/projects', {
    method: 'POST',
    body: request,
    token: accessToken,
  })
}

export function updateProject(
  accessToken: string,
  projectId: string,
  request: UpdateProjectRequest,
) {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: 'PUT',
    body: request,
    token: accessToken,
  })
}

export function deleteProject(accessToken: string, projectId: string) {
  return apiRequest<void>(`/projects/${projectId}`, {
    method: 'DELETE',
    token: accessToken,
  })
}

function buildProjectsPath(query?: ProjectListQuery) {
  if (!query) {
    return '/projects'
  }

  const params = new URLSearchParams()

  if (query.query) {
    params.set('query', query.query)
  }

  if (query.page !== undefined) {
    params.set('page', query.page.toString())
  }

  if (query.pageSize !== undefined) {
    params.set('pageSize', query.pageSize.toString())
  }

  if (query.sort) {
    params.set('sort', query.sort)
  }

  const queryString = params.toString()
  return queryString ? `/projects?${queryString}` : '/projects'
}
