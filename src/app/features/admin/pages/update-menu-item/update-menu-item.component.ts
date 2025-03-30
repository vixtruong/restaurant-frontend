import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { MenuItem } from '../../../../core/models/menu-item.model';
import { MenuItemService } from '../../../../core/services/menu-item.service';
import { MenuCategory } from '../../../../shared/constants/menu.constants';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';

@Component({
  selector: 'app-update-menu-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, DropdownModule, InputTextModule, FloatLabelModule, TextareaModule, FileUploadModule, SelectModule, ToastModule, ImageModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './update-menu-item.component.html',
  styleUrl: './update-menu-item.component.css'
})
export class UpdateMenuItemComponent implements OnInit {
  private menuItemService = inject(MenuItemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cloudinaryService = inject(CloudinaryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private fb: FormBuilder;
  
  menuItem!: MenuItem;
  loading = true;
  
  menuItemFormGroup!: FormGroup;
  isUploadImage: boolean = false;
  categories = Object.entries(MenuCategory).map(([_, value]) => ({ name: value, value })).slice(1);
  itemId!: number;

  constructor(fb: FormBuilder) {
    this.fb = fb;
  }

  ngOnInit() {
    const stateItem  = history.state.item as MenuItem;

    if (stateItem) {
      this.initForm(stateItem);
      this.menuItem = stateItem;
      this.loading = false;
      this.itemId = stateItem.id;

      console.log('Truyền qua router:', stateItem.name);
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (!id || isNaN(id)) {
        console.error('Không có ID trong route!');
        this.router.navigate(['/admin/menu']);
        return;
      }

      this.menuItemService.getMenuItemById(id).subscribe({
        next: (data) => {
          this.menuItem = new MenuItem(data);
          this.loading = false;
          this.itemId = this.menuItem.id;

          this.initForm(this.menuItem);
          console.log('Load từ API:', this.menuItem);
        },
        error: (err) => {
          console.error('Lỗi khi lấy món ăn:', err);
          this.router.navigate(['/admin/menu-items/manage']);
        }
      });
    }
  }

  initForm(item: MenuItem) {
    const categoryValue = this.categories.find(c => c.value === item.category) || null;
  
    console.log(categoryValue);
    this.menuItemFormGroup = this.fb.group({
      name: [item.name, Validators.required],
      category: [categoryValue, Validators.required],
      price: [item.price, [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: [item.description, Validators.required],
      imgFile: [item.imgUrl, Validators.required]
    });
  }
  
  onUploadFile(event: any) {
    const file = event.files?.[0];
    if (!file) return;

    this.cloudinaryService.uploadImage(file).subscribe({
      next: res => {
        const imageUrl = res.secure_url;
        this.menuItemFormGroup.patchValue({ imgFile: imageUrl });
        this.isUploadImage = true;
        this.messageService.add({ severity: 'success', summary: 'Upload successfully', detail: 'Food image has been updated.' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Upload fail', detail: 'Can not load image.' });
      }
    });
  }

  confirmSubmit() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update this food item?',
      header: 'Confirm update menu item',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Update',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-warn',
      accept: () => {
        this.onSubmitUpdate();
      }
    });
  }

  onSubmitUpdate() {
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

    const updatedItem = new MenuItem({
      id: this.itemId,
      name: name,
      category: category,
      price: parseInt(price),
      description: description,
      imgUrl: imgFile
    });
  
    const noChange =
      updatedItem.name === this.menuItem.name &&
      updatedItem.category === this.menuItem.category &&
      updatedItem.price === this.menuItem.price &&
      updatedItem.description === this.menuItem.description &&
      updatedItem.imgUrl === this.menuItem.imgUrl;
  
    if (noChange) {
      this.messageService.add({
        severity: 'info',
        summary: 'Không có thay đổi',
        detail: 'Không có thông tin nào được thay đổi.',
        life: 3000
      });
      return;
    }

    this.menuItemService.updateMenuItem(this.itemId, updatedItem).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Update successfully.',
          detail: `${updatedItem.name} is updated successfully!`,
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate([`/admin/menu-items`]);
        }, 1500);        
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Update failed!',
          detail: `${updatedItem.name} is updated failed.`,
          life: 3000
        });
        console.log(err);
      },
      complete: () => console.log('Add new menu item completely.')
    });
  }

  preventNonNumericInput(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
