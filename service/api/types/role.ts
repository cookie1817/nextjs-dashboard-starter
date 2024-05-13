export enum RoleEnum {
  SYSTEM_ADMIN = 0,
  BUSINESS_OWNER = 1,
  USER=2,
}

export type Role = {
  id: number | string;
  name?: string;
};
