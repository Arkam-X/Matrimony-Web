// User and Authentication Types

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ProfileStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export enum MaritalStatus {
  NEVER_MARRIED = 'NEVER_MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
}

export enum WorkStatus {
  JOB = 'JOB',
  HOMEMAKER = 'HOMEMAKER',
  BUSINESS = 'BUSINESS',
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole.ADMIN;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  role: UserRole.USER;
  gender: UserGender;
  image?: string | null;
  name: string;
  surname: string;
  email: string;
  password: string;
  dob: Date;
  guardian1_name: string;
  guardian1_details: string;
  guardian1_mobile: string;
  guardian2_name: string;
  guardian2_details: string;
  guardian2_mobile: string;
  street: string;
  city: string;
  pincode: string;
  native_place: string;
  marital_status: MaritalStatus;
  color_complexion: string;
  religion_sect: string;
  education: string;
  deeni_education: string;
  height: string;
  weight: string;
  income?: string; // Male only
  work_status?: WorkStatus; // Female only
  description: string;
  status: ProfileStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status?: ProfileStatus;
  gender?: UserGender;
}
