import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoriesType} from "../../../types/category.type";
import {environment} from "../../../environments/environment";
import {OrderType} from "../../../types/order.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CategoriesAndOrderService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  };

  createOrder(params: OrderType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', params)
  }
}
