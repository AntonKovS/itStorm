import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutingModule } from './articles-routing.module';
import { BlogComponent } from './blog/blog.component';
import { ArtComponent } from './art/art.component';
import {MatMenuModule} from "@angular/material/menu";
import {SharedModule} from "../../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    BlogComponent,
    ArtComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatMenuModule,
    ReactiveFormsModule,
    RouterModule,
    ArticlesRoutingModule,
  ]
})

export class ArticlesModule { }
