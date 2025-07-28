export class TableDto {
  readonly id: number;
  number: number;
  available: boolean;
  bookedBy?: string;

  constructor(data: Partial<TableDto>) {
    if (data.id == null || data.number == null) {
      throw new Error('TableDto requires id and number');
    }

    this.id = data.id;
    this.number = data.number;
    this.available = data.available ?? false;
    this.bookedBy = data.bookedBy;
  }

  get status(): string {
    return this.available ? 'Available' : 'Occupied';
  }
}
