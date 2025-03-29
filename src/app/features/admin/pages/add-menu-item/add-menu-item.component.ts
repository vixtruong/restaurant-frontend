import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';

import { MessageService } from 'primeng/api';

import { MenuCategory } from '../../../../shared/constants/menu.constants';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';
import { MenuItemService } from '../../../../core/services/menu-item.service';
import { MenuItem } from '../../../../core/models/menu-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-menu-item',
  imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextModule, FloatLabelModule, TextareaModule, FileUploadModule, SelectModule, ReactiveFormsModule, ToastModule, ImageModule],
  providers: [MessageService],
  templateUrl: './add-menu-item.component.html',
  styleUrl: './add-menu-item.component.css'
})
export class AddMenuItemComponent {
  private cloudinaryService = inject(CloudinaryService);
  private menuItemService = inject(MenuItemService);
  private router = inject(Router);

  menuItemFormGroup: FormGroup;
  isUploadImage: boolean = false;

  categories = Object.entries(MenuCategory).map(([key, value]) => ({
    name: value,
    value: value,
  })).slice(1);

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.menuItemFormGroup = fb.group({
      name: ['', Validators.required],
      category: [null, Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: ['', Validators.required],
      imgFile: [null, Validators.required],
    });
  }

  selectedCategory: string | null = null;

  preventNonNumericInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onUploadFile(event: any) {
    const file = event.files?.[0];
    if (!file) return;
  
    this.cloudinaryService.uploadImage(file).subscribe({
      next: res => {
        this.isUploadImage = true;
  
        const imageUrl = res.secure_url;
        this.menuItemFormGroup.patchValue({ imgFile: imageUrl });
  
        console.log(imageUrl);
  
        this.messageService.add({
          severity: res.reused ? 'info' : 'success',
          summary: res.reused ? 'Image Already Exists' : 'Upload Successful',
          detail: res.reused
            ? 'The image already exists on Cloudinary and was reused.'
            : 'The image has been successfully uploaded to Cloudinary.',
          life: 3000
        });
      },
      error: err => {
        console.error('Upload error:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: 'Image upload failed. Please try again.',
          life: 3000
        });
      }
    });
  }
  
  onSubmitCreate() {
    if (this.menuItemFormGroup.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Form chưa hợp lệ',
        detail: 'Vui lòng điền đầy đủ thông tin trước khi gửi.',
        life: 3000
      });
  
      this.menuItemFormGroup.markAllAsTouched();
      return;
    }

    const { name, category, price, description, imgFile } = this.menuItemFormGroup.value;

    const menuItem = new MenuItem( {id: 0, name: name, category: category, price: parseInt(price), description: description, imgUrl: imgFile} );

    this.menuItemService.createMenuItem(menuItem).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Create successfully.',
          detail: `${menuItem.name} is added successfully!`,
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate([`/admin/menu-items/manage`]);
        }, 1500);        
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Create failed!',
          detail: `${menuItem.name} is added failed.`,
          life: 3000
        });
        console.log(err);
      },
      complete: () => console.log('Add new menu item completely.')
    });
  }
}
