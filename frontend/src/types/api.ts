export interface APIErrorResponse {
  error?: string;
  message?: string;
}

export interface BlogApiResponse {
  content: any; // Update this type based on your editor's expected format
  title: string;
  id: string;
}