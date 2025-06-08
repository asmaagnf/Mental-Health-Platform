import {jwtDecode} from 'jwt-decode';

export interface JwtPayload {
  patientId: string;
  [key: string]: any;
}

export const getPatientIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.id || null;
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};