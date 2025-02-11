import { Injectable, signal } from '@angular/core';
import { CartItem } from '../common/cart-item.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  totalPrice = new BehaviorSubject<number>(0);
  totalQuantity = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(cartItem: CartItem) {
    const prevCartItems = this.cartItems();
    let existingCartItem: CartItem | undefined = undefined;
    if (this.cartItems().length > 0) {
      existingCartItem = this.cartItems().find((c) => c.id == cartItem.id);
    }
    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.set([...prevCartItems, cartItem]);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItems of this.cartItems()) {
      totalPriceValue += currentCartItems.quantity * currentCartItems.unitPrice;
      totalQuantityValue += currentCartItems.quantity;
    }
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems()) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`,
      );
    }
    console.log(
      `Total price:  ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`,
    );
    console.log('-------');
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    console.log(cartItem.quantity);
    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const newCart = this.cartItems().filter((c) => c.id != cartItem.id);
    this.cartItems.set([...newCart]);
    console.log('INSIDE REMOVE: ', this.cartItems());
    this.computeCartTotals();
  }
}
