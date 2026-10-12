export async function loginUser(email, password) {
  // Critical business authentication flow
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Authentication failed');
  }

  const data = await response.json();
  sessionStorage.setItem('auth_token', data.token);
  return data;
}
