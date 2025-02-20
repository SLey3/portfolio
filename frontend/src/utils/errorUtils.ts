import { AxiosError } from 'axios';
import { APIErrorResponse } from '../types/api';

export const getErrorMessage = (error: AxiosError<APIErrorResponse>): string => {
  const responseData = error.response?.data;
  
  if (responseData?.error) {
    return responseData.error;
  }
  
  if (responseData?.message) {
    return responseData.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};