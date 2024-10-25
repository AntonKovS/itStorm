import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import { LoaderComponent } from './components/loader/loader.component';
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
  declarations: [
    ArticleCardComponent,
    LoaderComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ArticleCardComponent, LoaderComponent, CommentComponent],
})
export class SharedModule { }
