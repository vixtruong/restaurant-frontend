import { Component } from '@angular/core';
import { PrimeNG } from 'primeng/config';
import { HomeComponent } from "./features/customer/home/home.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [HomeComponent]
})
export class AppComponent {
  constructor(private primeng: PrimeNG) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
    }

  title = 'restaurant-client';
}
