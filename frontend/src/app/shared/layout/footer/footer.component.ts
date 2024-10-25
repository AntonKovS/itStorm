import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {OrderType} from "../../../../types/order.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CategoriesAndOrderService} from "../../services/categories-and-order.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigateService} from "../../services/navigate.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  recallShow: boolean = false;
  thankYouShow: boolean = false;
  errorServiceRequest: boolean = false;

  recallPopupForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder,
              private categoriesAndOrderService: CategoriesAndOrderService,
              private _snackBar: MatSnackBar,
              private navigateService: NavigateService) {
  }

  ngOnInit(): void {
  }

  showRecallPopup(): void {
    this.errorServiceRequest = false;
    this.recallPopupForm.reset();
    this.recallShow = true;
  }

  hideRecallPopup(): void {
    this.recallShow = false;
    this.thankYouShow = false;
  }

  sendRequestForConsultation(): void {
    this.errorServiceRequest = false;
    if (this.recallPopupForm.valid
      && this.recallPopupForm.value.name && this.recallPopupForm.value.phone) {
      const paramsObject: OrderType = {
        name: this.recallPopupForm.value.name,
        phone: this.recallPopupForm.value.phone,
        type: 'consultation',
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
              this._snackBar.open('Ошибка при отправке запроса на консультацию');
            }
          }
        });
    } else {
      this.recallPopupForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

  navigate(fragment: string): void {
    this.navigateService.navigate(fragment);
  }

}
