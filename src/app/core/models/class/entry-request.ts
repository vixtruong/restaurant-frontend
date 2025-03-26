export class EntryRequest {
  fullName: string;
  phoneNumber: string;

  constructor(fullName: string, phoneNumber: string) {
    this.fullName = fullName,
    this.phoneNumber = phoneNumber
  }
}