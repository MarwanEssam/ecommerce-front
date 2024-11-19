import { Component, inject, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/productCategory.model';
import { ProductService } from '../../services/product.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css',
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[] = [];
  productService = inject(ProductService);
  ngOnInit(): void {
    this.listProductCategories();
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe((data) => {
      console.log('productCategories', JSON.stringify(data));
      this.productCategories = data;
    });
  }
}
