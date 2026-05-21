import { API_BASE_URL } from './config';

const getApiOrigin = () => {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return window.location.origin;
  }
};

export const resolveAssetUrl = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  if (value.startsWith('/storage/')) {
    if (!/^https?:\/\//i.test(API_BASE_URL)) {
      return value;
    }

    return `${getApiOrigin()}${value}`;
  }

  return value;
};
