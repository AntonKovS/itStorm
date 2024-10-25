import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BlogComponent} from "./blog/blog.component";
import {ArtComponent} from "./art/art.component";

const routes: Routes = [
  {path: 'blog', component: BlogComponent},
  {path: 'art/:url', component: ArtComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule { }
