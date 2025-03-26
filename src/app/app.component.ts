import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet]
})
export class AppComponent {
  constructor(private primeng: PrimeNG) {}

    ngOnInit() {
      this.primeng.ripple.set(true);
    }

  title = 'restaurant-client';
}
