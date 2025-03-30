import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CloudinaryService {
  private cloudName = 'diito9afa';
  private uploadPreset = 'restaurant';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(url, formData);
  }
}
