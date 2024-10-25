import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AllCommentsType} from "../../../types/all-comments.type";
import {ParamAllCommentsType} from "../../../types/param-all-comments.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionsType} from "../../../types/comment-actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) {
  }

  getComments(params: ParamAllCommentsType): Observable<AllCommentsType> {
      return this.http.get<AllCommentsType>(environment.api + 'comments', {params: params});
  };

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {"text": text, "article": article});
  };

  getAllAppliedUsersActionsForArticle(articleId: string): Observable<CommentActionsType[] | DefaultResponseType> {
      return this.http.get<CommentActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {params: {articleId: articleId}});
  };

  applyAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {"action": action});
  };

}
