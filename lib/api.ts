const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Resource {
  id: string;
  id_crosslanguage: string;
  title: string;
  content: string;
  image_url?: string;
  category: {
    id: string;
    name: string;
  };
  language: {
    id: string;
    code: string;
    name: string;
  };
  source_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

// Fetch all resources for a language
export async function getResources(langCode: string): Promise<Resource[]> {
  const response = await fetch(`${API_URL}/api/v1/${langCode}/resources`);
  if (!response.ok) throw new Error('Failed to fetch resources');
  return response.json();
}

// Fetch a single resource
export async function getResource(langCode: string, id: string): Promise<Resource> {
  const response = await fetch(`${API_URL}/api/v1/${langCode}/resources/${id}`);
  if (!response.ok) throw new Error('Failed to fetch resource');
  return response.json();
}

// Fetch categories for a language
export async function getCategories(langCode: string): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/v1/${langCode}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

// Fetch all available languages
export async function getLanguages(): Promise<Language[]> {
  const response = await fetch(`${API_URL}/api/v1/languages`);
  if (!response.ok) throw new Error('Failed to fetch languages');
  return response.json();
}

// Login
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}
