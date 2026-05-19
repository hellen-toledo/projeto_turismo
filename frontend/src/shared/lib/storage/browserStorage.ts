const isBrowser = typeof window !== 'undefined';

export const getStoredString = (key: string): string | null => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(key);
};

export const setStoredString = (key: string, value: string) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, value);
};

export const removeStoredString = (key: string) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(key);
};
