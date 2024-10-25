import {Component, HostListener, OnInit} from '@angular/core';
import {BlogFilterParamsType} from "../../../../types/blog-filter-params.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {AllArticlesType} from "../../../../types/allArticles.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  blogFilterOptionsOpen = false;
  activeParams: ActiveParamsType = {page: 1, categories: []};
  blogFilterOptions: BlogFilterParamsType[] = [
    {name: 'Фриланс', urlName: 'frilans', value: false},
    {name: 'Дизайн', urlName: 'dizain', value: false},
    {name: 'SMM', urlName: 'smm', value: false},
    {name: 'Таргет', urlName: 'target', value: false},
    {name: 'Копирайтинг', urlName: 'kopiraiting', value: false}
  ];

  allArticles: AllArticlesType = {} as AllArticlesType;
  pages: number[] = [];

  constructor(private articlesService: ArticlesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        debounceTime(300)
      )
      .subscribe(params => {
          const activeParams: ActiveParamsType = {page: 1, categories: []};
          if (params.hasOwnProperty('categories')) {
            activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
          }
          if (params.hasOwnProperty('page')) {
            activeParams.page = +params['page'];
          }
          this.activeParams = activeParams;

          this.blogFilterOptions.forEach(param => {
            if (this.activeParams.categories && this.activeParams.categories.length > 0) {
              this.activeParams.categories.find(item => param.urlName === item ? param.value = true : param.value = false);
            } else {
              this.blogFilterOptions.forEach(item => item.value = false);
            }
          });

          this.articlesService.getArticles(this.activeParams)
            .subscribe((data: AllArticlesType): void => {
              this.allArticles = data;
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
            });
        }
      );
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.blogFilterOptionsOpen &&
      !(event.target as HTMLElement).classList.contains("blog-filter-options-head-empty") &&
      (event.target as HTMLElement).className.indexOf('blog-filter-options-head') === -1 &&
      (event.target as HTMLElement).className.indexOf('blog-filter-options-body') === -1) {
      this.blogFilterOptionsOpen = false;
    }
  }

  toggleBlogFilterOptionsOpen(): void {
    this.blogFilterOptionsOpen = !this.blogFilterOptionsOpen;
  }


  updateFilterParam(blogFilterOption: BlogFilterParamsType, e: Event): void {
    e.preventDefault();     //для запрета выполнения действий
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    // blogFilterOption.value = !blogFilterOption.value;
    if (this.activeParams.categories && this.activeParams.categories.length > 0
    ) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === blogFilterOption.urlName)
      if (existingTypeInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== blogFilterOption.urlName);
      } else if (!existingTypeInParams) {
        // this.activeParams.categories.push(url);
        this.activeParams.categories = [...this.activeParams.categories, blogFilterOption.urlName];
      }
    } else if (blogFilterOption.urlName) {
      this.activeParams.categories = [blogFilterOption.urlName];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {queryParams: this.activeParams})
      .then(() => {
          //восстанавливаем позицию прокрутки после навигации
        window.scrollTo({top: scrollPosition, behavior: 'auto'});
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {queryParams: this.activeParams});
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {queryParams: this.activeParams});
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {queryParams: this.activeParams});
    }
  }

}
