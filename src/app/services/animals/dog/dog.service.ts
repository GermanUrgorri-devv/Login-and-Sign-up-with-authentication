import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DogService {

  private header = new HttpHeaders().set(
    'Content-Type', 'application/json'
  ).set(
    'x-api-key', 'live_QHLlBzH1KAiSuir5TfbAD7TAqb4dnCLWwOkcw66pjhwWyZjgUXOyvk6cFN4HuO46'
  );

  constructor(private http: HttpClient) { }

  public get10Dogs(): Promise<any[]> {
    return this.http.get<any[]>("https://api.thedogapi.com/v1/images/search?format=json&limit=8",  { headers: this.header })
      .toPromise()
      .then(response => {
        return response || []; 
      })
      .catch(error => {
        console.error(error);
        return Promise.resolve([]);  
      });
  }
}
