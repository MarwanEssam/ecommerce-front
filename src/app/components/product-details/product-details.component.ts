import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../common/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { producerNotifyConsumers } from '@angular/core/primitives/signals';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  private handleProductDetails() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe((data) => {
      this.product = data;
    });
  }

  protected readonly producerNotifyConsumers = producerNotifyConsumers;

  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }
}
