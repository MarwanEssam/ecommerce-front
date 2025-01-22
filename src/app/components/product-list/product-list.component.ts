import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product.model';
import { TableModule } from 'primeng/table';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [TableModule, CurrencyPipe, RouterLink, NgbPagination],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  private cartService = inject(CartService);
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = '';
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  private handleSearchProducts() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;
    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(
      `keyword = ${theKeyword}, thePageNumber = ${this.thePageNumber}`,
    );
    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        theKeyword,
      )
      .subscribe(this.processResult());
  }
  handleListProducts() {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`,
    );
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId,
      )
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
}
