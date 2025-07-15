export interface UserInfo {
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  type?: 'general_user' | 'company_admin' | 'company_employee' | 'admin';
  credits?: number;
}

export function getUserInfo(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return null;
    
    const parsed = JSON.parse(userInfo);
    return parsed.isLoggedIn ? parsed : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
}

export function isLoggedIn(): boolean {
  const userInfo = getUserInfo();
  return userInfo?.isLoggedIn === true;
}

export function getUserId(): string | null {
  const userInfo = getUserInfo();
  return userInfo?.email || null;
} 