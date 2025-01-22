import { Component, inject, OnInit, signal } from '@angular/core';
import { CartItem } from '../../common/cart-item.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent implements OnInit {
  cartItems = signal<CartItem[]>([]);
  totalPrice = signal<number>(0);
  totalQuantity = signal<number>(0);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems.set(this.cartService.cartItems());

    this.cartService.totalPrice.subscribe((data) => this.totalPrice.set(data));

    this.cartService.totalQuantity.subscribe((data) =>
      this.totalQuantity.set(data),
    );

    this.cartService.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem);
    this.listCartDetails();
    console.log(this.cartItems());
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }
}
