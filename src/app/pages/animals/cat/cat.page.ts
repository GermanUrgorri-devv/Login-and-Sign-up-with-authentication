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

  async ngOnInit() {
    this.isLoading = true; 
    try {
      this.cats = await this.catService.get10Cats();
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false; 
    }
  }
}

