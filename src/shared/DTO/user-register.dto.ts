export interface ClientRegister {
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  oldPassword?: string;
  password: string;
  birthday: string;
  phone: number;
  team?: string;
}

export enum Role {
  admin = 'Admin',
  headman = 'Headman',
  comitte = 'Comitte',
}

export interface AdminRegister {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  region?: { district: string; subDistrict: string };
  role: Role;
}
