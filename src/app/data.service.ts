import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private REST_API_SERVER = "http://localhost:4200/";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(url) {
    return this.httpClient.get(this.REST_API_SERVER + url);
  }
}
