export class EntryRequestDto {
  fullName: string;
  phoneNumber: string;
  tableNumber: number;

  constructor(fullName: string, phoneNumber: string, tableNumber: number) {
    this.fullName = fullName,
    this.phoneNumber = phoneNumber,
    this.tableNumber = tableNumber
  }
}