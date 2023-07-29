import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatService {

  private header = new HttpHeaders().set(
    'Content-Type', 'application/json'
  ).set(
    'x-api-key', 'live_7khNPbY8j44Zj1039aMP9ZffoLP7nsLV3KEHR7WAdpvfIPWs4pYCUOCBDNZdB4bf'
    );

  constructor(private http: HttpClient) { }

  public async get10Cats(): Promise<any[]> {
    try {
      const response = await this.http.get<any[]>('https://api.thecatapi.com/v1/images/search?limit=8',  { headers: this.header }).toPromise();
      return response || [];
    } catch (error) {
      console.error(error);
      return [];  
    }
  }
}