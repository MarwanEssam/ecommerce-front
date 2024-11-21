import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  router = inject(Router);
  doSearch(value: string) {
    console.log(value);
    this.router.navigateByUrl(`/search/${value}`);
  }
}
