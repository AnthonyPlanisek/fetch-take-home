import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface DogSearchResponse {
  resultIds: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class FetchServiceService {
  private apiUrl = 'https://frontend-take-home-service.fetch.com';

  constructor(private http: HttpClient) {}

  login(userInfo: { name: string, email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, userInfo, { 
      responseType: 'text', 
      withCredentials: true
    });
  }

  getDogBreeds(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dogs/breeds`, {
      responseType: 'text', 
      withCredentials: true
    });
  }

   
   searchDogs(breeds: string, size: number): Observable<any[]> {
    const queryParams = {
      breeds: breeds,
      size: size.toString(), 
    };
    return this.http.get<DogSearchResponse>(`${this.apiUrl}/dogs/search`, {
       params: queryParams ,
       withCredentials: true
       }).pipe(
        map(response => response.resultIds)
       )
  }

  getDetailedDogs(dogs: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/dogs`, dogs, { withCredentials: true });
  }

  matchDogs(favoriteDogIds: any[]): Observable<any> {
    return this.http.post<string[]>(`${this.apiUrl}/dogs/match`, favoriteDogIds, { withCredentials: true });
  }
  
}
