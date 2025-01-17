import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  name: string; 
  email: string;
  role: string[];
  exp?: number; // Token expiration timestamp
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const clearToken = () => {
  deleteFromLocalStorage('token');
};

export const getToken = (key: string): string | null => {
  const storedToken = getValuesFromLocalStorage(key);
  if (storedToken === null) {
    return null;
  }
  return storedToken as string | null;
};
export function deleteFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
export const storeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    storeValuesInLocalStorage('token', token);
    return decoded;
    // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return null;
  }
};

export function storeValuesInLocalStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getValuesFromLocalStorage(key: string): unknown {
  const value = localStorage.getItem(key);
  if (value === null) {
    return null;
  }
  return JSON.parse(value);
}
