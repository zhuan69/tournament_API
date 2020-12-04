export interface ClientRegister {
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  password: string;
  age: number;
  team?: string;
}

enum Role {
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
