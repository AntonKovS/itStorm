import {Component, Input, OnInit} from '@angular/core';
import {CommentType} from "../../../../types/comment.type";
import {CommentsService} from "../../services/comments.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() comment!: CommentType;
  date: string = '';
  complaint: boolean = false;
  isLogged: boolean = false;

  constructor(private commentService: CommentsService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.isLogged = this.authService.getIsLoggedIn();

    this.date = new Date(this.comment.date).toLocaleString("ru-RU", {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).replace(/,/, ' ');
  }

  applyAction(action: string): void {
    if (!this.isLogged) {
      this._snackBar.open('Отправлять реакции могут только зарегистрированные пользователи');
      return;
    }
    if (this.complaint) {
      this._snackBar.open('Жалоба уже отправлена');
      return;
    }

    this.commentService.applyAction(this.comment.id, action)
      .subscribe({
        next: (data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }

          if (action === 'violate') {
            this.complaint = true;
            this._snackBar.open('Жалоба отправлена');
            return;
          }

          if (action === 'like') {
            switch (this.comment.likeDislike) {
              case 'like':
                this.comment.likesCount--;
                this.comment.likeDislike = '';
                break;
              case 'dislike':
                this.comment.dislikesCount--;
                this.comment.likesCount++;
                this.comment.likeDislike = 'like';
                break;
              default:
                this.comment.likesCount++;
                this.comment.likeDislike = 'like';
                break;
            }
          } else if (action === 'dislike') {
            switch (this.comment.likeDislike) {
              case 'dislike':
                this.comment.dislikesCount--;
                this.comment.likeDislike = '';
                break;
              case 'like':
                this.comment.likesCount--;
                this.comment.dislikesCount++;
                this.comment.likeDislike = 'dislike';
                break;
              default:
                this.comment.dislikesCount++;
                this.comment.likeDislike = 'dislike';
                break;
            }
          }
          this._snackBar.open('Ваш голос учтён');
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (action === 'violate') {
            this.complaint = true;
            this._snackBar.open('Жалоба уже отправлена');
          } else {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка отправки реакции');
              throw new Error(errorResponse.error.message);
            }
          }
        }
      });
  }

}
