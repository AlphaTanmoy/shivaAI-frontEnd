export type LoginUserType = 'ADMIN' | 'CUSTOMER';

export interface LoginRequest {
  emailId: string;
  password: string;
  clientDevicePlatform: string;
  deviceUserAgent: string;
  uniqueIdentifierId: string;
  fcmId: string;
  userType: LoginUserType;
}
