export interface Role {
  id: number;
  role: string;
  slug: string;
  description_key: string;
  is_active: boolean;
}

export const ROLES: Role[] = [
  {
    id: 1,
    role: 'administrator',
    slug: 'administrator',
    description_key: 'roles.administrator.description',
    is_active: true,
  },
  {
    id: 2,
    role: 'manager',
    slug: 'manager',
    description_key: 'roles.manager.description',
    is_active: true,
  },
  {
    id: 3,
    role: 'employee',
    slug: 'employee',
    description_key: 'roles.employee.description',
    is_active: true,
  },
];
