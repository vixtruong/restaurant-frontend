import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { PaymentService } from '../../../../core/services/payment.service';
import { MessageService } from 'primeng/api';
import { PaymentDto } from '../../../../core/dtos/payment.dto';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-revenue-export',
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, ButtonModule, DatePickerModule, ToastModule],
  providers: [MessageService],
  templateUrl: './revenue-export.component.html',
  styleUrls: ['./revenue-export.component.css']
})

export class RevenueExportComponent {
  paymentService = inject(PaymentService);
  messageService = inject(MessageService);

  fromToForm: FormGroup;

  payments: PaymentDto[] = [];

  constructor(private fb: FormBuilder) {
    this.fromToForm = fb.group(
      {
        from: [new Date(), Validators.required],
        to: [new Date(), Validators.required],
      },
      { validators: this.dateRangeValidator } 
    );
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const from = control.get('from')?.value;
    const to = control.get('to')?.value;

    console.log(from, to);

    if (from && to && to < from) {
      return { dateRangeInvalid: 'The "to" date must be later than the "from" date.' };
    }

    return null;
  }

  submit() {
    if (this.fromToForm.valid) {
      const { from, to } = this.fromToForm.value;

      // Chuyển ngày sang chuỗi ISO 8601 (YYYY-MM-DD)
      const fromDate = new Date(from).toISOString();
      const toDate = new Date(to).toISOString();

      this.paymentService.getPaymentsFromTo(fromDate, toDate).subscribe({
        next: data => {
          this.payments = data.map(item => new PaymentDto(item));

          this.exportUsefulDataToExcel();

          this.messageService.add({
            severity: 'success',
            summary: 'Export successfully.',
            detail: 'Revenue statistic has been exported completely.',
            life: 3000
          });
          console.log(this.payments);
        },
        error: err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error fetching data',
            detail: 'There was an error fetching payments.',
            life: 3000
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid form',
        detail: 'The "to" date must be later than the "from" date.',
        life: 3000
      });
    }
  }

  exportUsefulDataToExcel() {
    const usefulData = this.getUsefulPayments();

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(usefulData);

    const wb: XLSX.WorkBook = { Sheets: { 'Payments': ws }, SheetNames: ['Payments'] };
    XLSX.writeFile(wb, 'Payments_Export.xlsx');
  }

  getUsefulPayments() {
    return this.payments.map(payment => PaymentDto.getPaymentInfo(payment));
  }
}
