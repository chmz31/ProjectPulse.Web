export type ProjectDto = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export type CreateProjectRequest = {
  name: string
  description?: string | null
}

export type UpdateProjectRequest = {
  name: string
  description?: string | null
}

export type ProjectSort = 'name' | '-name' | 'createdAt' | '-createdAt'

export type ProjectListQuery = {
  query?: string
  page?: number
  pageSize?: number
  sort?: ProjectSort
}

export type ProjectListResponse = ProjectDto[]

export type ProjectPagination = {
  totalCount: number
  page: number
  pageSize: number
}
