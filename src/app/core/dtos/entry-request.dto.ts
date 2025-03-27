export class EntryRequestDto {
  fullName: string;
  phoneNumber: string;

  constructor(fullName: string, phoneNumber: string) {
    this.fullName = fullName,
    this.phoneNumber = phoneNumber
  }
}