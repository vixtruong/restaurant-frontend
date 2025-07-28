export class Table {
  readonly id: number;
  number: number;
  available: boolean;

  constructor(data: Partial<Table>) {
    this.id = data.id!,
    this.number = data.number!,
    this.available = data.available ?? false
  }
}