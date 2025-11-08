export interface ServerSummary {
    id: number
    status: 'running' | 'stopped'
    name: string
    description: string
    imageUrl: string
}