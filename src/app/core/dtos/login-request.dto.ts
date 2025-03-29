export class LoginRequestDto {
  email: string;
  password: string;

  constructor(data: Partial<LoginRequestDto>) {
    this.email = data.email ?? "",
    this.password = data.password ?? ""
  }
}