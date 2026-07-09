/**
 * Web application configuration settings.
 */

// Safely extract NEXT_PUBLIC_API_URL and handle cases where it is undefined, empty, or stringified as 'undefined'
const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url === 'undefined') {
    return '';
  }
  return url;
};

export const API_URL = getApiUrl();
