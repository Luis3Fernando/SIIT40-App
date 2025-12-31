export type FailureType = 'CONNECTION_ERROR' | 'TIMEOUT' | 'NOT_FOUND' | 'SERVER_ERROR' | 'UNKNOWN_ERROR';

export interface AppFailure {
  type: FailureType;
  message: string; 
  statusCode?: number;
}

export const handleAxiosError = (error: any): AppFailure => {
  if (error.code === 'ECONNABORTED') {
    return { type: 'TIMEOUT', message: 'Request timeout' };
  }
  if (!error.response) {
    return { type: 'CONNECTION_ERROR', message: 'Network unreachable' };
  }
  return { 
    type: 'SERVER_ERROR', 
    message: error.response?.data || 'Internal Server Error',
    statusCode: error.response?.status 
  };
};