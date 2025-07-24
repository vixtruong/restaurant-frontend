export class Table {
  readonly id: number;
  number: number;
  available: boolean;
  checkInTime: Date;
  checkOutIime: Date;

  constructor(data: Partial<Table>) {
    this.id = data.id!,
    this.number = data.number!,
    this.available = data.available ?? false,
    this.checkInTime = data.checkInTime!,
    this.checkOutIime = data.checkOutIime ?? new Date();
  }
}