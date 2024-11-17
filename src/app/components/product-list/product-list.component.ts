import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product.model';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  private productService = inject(ProductService);
  ngOnInit(): void {
    this.listProducts();
  }

  listProducts() {
    this.productService.getProductLust().subscribe((data) => {
      this.products = data;
    });
  }
}
