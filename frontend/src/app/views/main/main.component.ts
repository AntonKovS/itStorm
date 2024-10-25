import {Component, HostListener, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ServicesType} from "../../../types/services.type";
import {FormBuilder, Validators} from "@angular/forms";
import {CategoriesAndOrderService} from "../../shared/services/categories-and-order.service";
import {CategoriesType} from "../../../types/category.type";
import {ArticleType} from "../../../types/article.type";
import {OrderType} from "../../../types/order.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ArticlesService} from "../../shared/services/articles.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 0,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false,
    autoplay: true,
    autoplayTimeout: 4000,
    smartSpeed: 1000,
  }

  services: ServicesType[] = [
    {
      name: 'Фриланс',
      image: '../../../assets/images/services/services-1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
    },
    {
      name: 'SMM',
      image: '../../../assets/images/services/services-2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
    },
    {
      name: 'Таргет',
      image: '../../../assets/images/services/services-3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000',
    },
    {
      name: 'Копирайтинг',
      image: '../../../assets/images/services/services-4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
    },
  ];

  detailsShow: boolean = false;
  thankYouShow: boolean = false;
  errorServiceRequest: boolean = false;

  categories: CategoriesType[] = [];
  selectCategory: string = '';
  detailsPopupForm = this.fb.group({
    title: ['', [Validators.required]],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  popularArticles: ArticleType[] = [];

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  reviews = [
    {
      name: 'Станислав',
      image: '../../../assets/images/reviews/review-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
    },
    {
      name: 'Алёна',
      image: '../../../assets/images/reviews/review-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      name: 'Мария',
      image: '../../../assets/images/reviews/review-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
  ]

  constructor(private fb: FormBuilder,
              private categoriesAndOrderService: CategoriesAndOrderService,
              private _snackBar: MatSnackBar,
              private articlesService: ArticlesService) {
  }

  ngOnInit(): void {
    this.articlesService.getPopularArticles()
      .subscribe((data: ArticleType[]): void => {
        this.popularArticles = data;
      });
  }

  showDetailsPopup(service: string): void {
    this.errorServiceRequest = false;
    this.detailsPopupForm.reset();
    this.categoriesAndOrderService.getCategories()
      .subscribe({
        next: (categories: CategoriesType[]) => {
          this.categories = categories;
          this.selectCategory = service;
        },
        error: () => {
          throw new Error('Ошибка при запросе категорий');
        }
      });
    this.detailsShow = true;
  }

  hideDetailsPopup(): void {
    this.detailsShow = false;
    this.thankYouShow = false;
  }

  // @HostListener('document:click', ['$event'])
  // click(event: Event) {
  //   if ((event.target as HTMLElement).classList.contains("popup")) {
  //     this.detailsShow = false;
  //   }
  // }

  sendRequestForService(): void {
    this.errorServiceRequest = false;
    if (this.detailsPopupForm.valid && this.detailsPopupForm.value.title
      && this.detailsPopupForm.value.name && this.detailsPopupForm.value.phone) {
      const paramsObject: OrderType = {
        name: this.detailsPopupForm.value.name,
        phone: this.detailsPopupForm.value.phone,
        service: this.detailsPopupForm.value.title,
        type: 'order',
      };
      this.categoriesAndOrderService.createOrder(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }
            this.thankYouShow = true;
          },
          error: (errorResponse: HttpErrorResponse) => {
            this.errorServiceRequest = true;
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при отправке заявки на услугу');
            }
          }
        });
    } else {
      this.detailsPopupForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

}
