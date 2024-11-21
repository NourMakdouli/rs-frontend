import { Component, OnInit } from '@angular/core';
import { Blog } from 'src/app/core/models/blog';
import { BlogService } from 'src/app/core/services/blog.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit{
  stores:Blog[ ]=[];
  visibleStores:Blog[]=[];
  storesFound:number=0;
  numberOfStoresToShow=8;



  constructor( private storeService: BlogService){

  }
  ngOnInit(): void {
    this.getAllProducts();
      
  }


  showMoreProducts() {
    this.numberOfStoresToShow += 8;
    this.visibleStores = this.stores.slice(0, this.numberOfStoresToShow);
  }

  getAllProducts() {
    this.storeService.getBlogs().subscribe({
      next: (storesList) => {
        this.stores = storesList;
        this.storesFound = this.stores.length; // Set productsFound to the number of products found
        console.log(`Number of stores found: ${this.storesFound}`);
        this.visibleStores = this.stores.slice(0, this.numberOfStoresToShow);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getStarsArray(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = (rating % 1) >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill('full'),
      ...Array(halfStar).fill('half'),
      ...Array(emptyStars).fill('empty')
    ];
  }
}
