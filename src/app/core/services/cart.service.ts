import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartKey = 'order-cart';

  private _cart = new BehaviorSubject<OrderItem[]>(this.loadCart());
  cart$ = this._cart.asObservable();

  private loadCart(): OrderItem[] {
    const data = localStorage.getItem(this.cartKey);
    const parsed = data ? JSON.parse(data) : [];
    return parsed.map((item: any) => new OrderItem(item));
  }

  saveCart(cart: OrderItem[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this._cart.next(cart);
  }

  getCart(): OrderItem[] {
    return this._cart.value;
  }

  addToCart(item: OrderItem) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing && !existing.confirmed) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.saveCart(cart);
  }

  updateQuantity(itemId: number, delta: number) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === itemId && i.confirmed === false);
    if (item) {
      item.quantity = Math.min(20, Math.max(1, item.quantity + delta));
      this.saveCart(cart);
    }
  }

  updateNote(id: number, note: string) {
    const cart = this.getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.notes = note;
      this.saveCart(cart);
      this._cart.next(cart);
    }
  }
  
  removeItem(itemId: number) {
    const updated = this.getCart().filter(i =>
      i.id !== itemId || i.confirmed === true
    );
    this.saveCart(updated);
  }
  
  cancelItem(index: number) {
    const cart = this.getCart();
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1); 
      this.saveCart(cart); 
    }
  }  
}
