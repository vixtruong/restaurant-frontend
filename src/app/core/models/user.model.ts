export class User {
  readonly id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  roleName?: string;
  roleId?: number;
  joinTime: Date;

  constructor(data: Partial<User>) {
    this.id = data.id!;
    this.email = data.email!;
    this.fullName = data.fullName!;
    this.phoneNumber = data.phoneNumber!;
    this.roleName = data.roleName!;
    this.joinTime = data.joinTime!;
    this.roleId = data.roleId;
  }
}