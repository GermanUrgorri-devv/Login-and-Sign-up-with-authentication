import { Component, OnInit } from '@angular/core';
import { DogService } from 'src/app/services/animals/dog/dog.service';

@Component({
  selector: 'app-dog',
  templateUrl: './dog.page.html',
  styleUrls: ['./dog.page.scss'],
})
export class DogPage implements OnInit {

  public dogs: any[] = []; 
  public isLoading: boolean = false; 

  constructor(private dogService : DogService) { }

  async ngOnInit() {
    this.isLoading = true; 
    this.dogService.get10Dogs().then(dogs => {
      this.dogs = dogs;  
      this.isLoading = false; 
    });
  }
}

