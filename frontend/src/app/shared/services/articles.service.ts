import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment";
import {AllArticlesType} from "../../../types/allArticles.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleFullType} from "../../../types/article-full.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  getArticles(params: ActiveParamsType): Observable<AllArticlesType> {
    return this.http.get<AllArticlesType>(environment.api + 'articles', {params: params});
  }

  getArticle(url: string): Observable<ArticleFullType> {
    return this.http.get<ArticleFullType>(environment.api + 'articles/' + url);
  }

  getPopularArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }

}
