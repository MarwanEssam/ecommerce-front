import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css',
})
export class CartStatusComponent implements OnInit {
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.updateCartStatus();
  }

  private updateCartStatus() {
    this.cartService.totalPrice.subscribe((data) => this.totalPrice.set(data));
    this.cartService.totalQuantity.subscribe((data) =>
      this.totalQuantity.set(data),
    );
  }
}
