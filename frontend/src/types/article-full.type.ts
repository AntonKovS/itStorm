import {ElementRef} from "@angular/core";

export type ArticleFullType = {
  text: ElementRef,
  comments: [],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
}
