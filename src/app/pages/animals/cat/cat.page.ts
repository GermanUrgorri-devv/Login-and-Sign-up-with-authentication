import { Component, OnInit } from '@angular/core';
import { CatService } from 'src/app/services/animals/cat/cat.service';

@Component({
  selector: 'app-cat',
  templateUrl: './cat.page.html',
  styleUrls: ['./cat.page.scss'],
})
export class CatPage implements OnInit {
  public cats: any[] = []; 
  public isLoading: boolean = false; 

  constructor(private catService : CatService) { }

  ngOnInit() {
    this.isLoading = true; 
    this.catService.get10Cats().then(cats => {
      this.cats = cats;  
      this.isLoading = false; 
    });
  }
}
