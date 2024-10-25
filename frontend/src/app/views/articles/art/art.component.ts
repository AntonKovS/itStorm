import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleFullType} from "../../../../types/article-full.type";
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";
import {CommentsService} from "../../../shared/services/comments.service";
import {AllCommentsType} from "../../../../types/all-comments.type";
import {CommentType} from "../../../../types/comment.type";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {CommentActionsType} from "../../../../types/comment-actions.type";

@Component({
  selector: 'app-art',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss']
})
export class ArtComponent implements OnInit {

  article!: ArticleFullType;
  commentsCount: number = 0;
  commentsShown: number = 3;
  comments: CommentType[] = [];
  relatedArticles!: ArticleType[];
  serverStaticPathArticlesImages: string = environment.serverStaticPathArticlesImages;
  isLogged: boolean = false;

  commentForm = this.fb.group({
    text: ['', Validators.required],
  });

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private commentService: CommentsService,
              private authService: AuthService,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    this.activatedRoute.params.subscribe(params => {

      this.articleService.getArticle(params['url'])
        .subscribe({
          next: (data: ArticleFullType): void => {
            this.article = data;
            this.commentsCount = data.commentsCount;
            this.comments = [];
            this.checkActionsInComments(data.comments);

            this.articleService.getRelatedArticles(params['url'])
              .subscribe((data: ArticleType[]) => {
                this.relatedArticles = data;
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки реакции');
            }
              throw new Error(errorResponse.error.message);
          }
        });
    });
  }

  checkActionsInComments(commentsForRenew: CommentType[]): void {
    if (commentsForRenew && commentsForRenew.length > 0) {
      if (this.isLogged) {
        this.commentService.getAllAppliedUsersActionsForArticle(this.article.id)
          .subscribe({
            next: (result: CommentActionsType[] | DefaultResponseType) => {
              if ((result as DefaultResponseType).error !== undefined) {
                this._snackBar.open((result as DefaultResponseType).message);
                throw new Error((result as DefaultResponseType).message);
              }
              if ((result as CommentActionsType[]) && (result as CommentActionsType[]).length >0) {
                commentsForRenew.forEach((item: CommentType) => {
                  (result as CommentActionsType[]).find((comment: CommentActionsType) => {
                    item.id === comment.comment ? item.likeDislike = comment.action : '';
                  });
                });
              }
                this.comments.push(...commentsForRenew);
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && errorResponse.error.message) {
                this._snackBar.open(errorResponse.error.message);
              } else {
                this._snackBar.open('Ошибка обработки комментариев');
              }
            }
          });
      } else {
        this.comments.push(...commentsForRenew);
      }
    }
  }

  loadMoreComments(): void {
    this.commentService.getComments({offset: this.commentsShown, article: this.article.id})
      .subscribe({
        next: (data: AllCommentsType) => {
          this.checkActionsInComments(data.comments);
          ((this.commentsCount - this.commentsShown) > 0) ? (this.commentsShown += 10) : this.commentsShown = this.commentsCount;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка загрузки комментариев');
          }
        }
      });
  }

  addComment(): void {
    if (this.commentForm.valid && this.commentForm.value.text && this.article.id)
      this.commentService.addComment(this.commentForm.value.text, this.article.id)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
            }
            this.commentForm.reset();
            this.commentService.getComments({offset: 0, article: this.article.id})
              .subscribe((data: AllCommentsType) => {
                this.commentsCount = data.allCount;
                this.commentsShown += 1;
                this.comments.unshift(data.comments[0]);
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка добавления комментария');
            }
          }
        });
  }

}
