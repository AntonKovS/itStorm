import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {IsActiveMatchOptions, Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {NavigateService} from "../../services/navigate.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    isLogged: boolean = false;
    userInfo!: UserInfoType;
    activeElement: string = '';


    constructor(private authService: AuthService,
                private _snackBar: MatSnackBar,
                private router: Router,
                private userService: UserService,
                private navigateService: NavigateService) {
    }

    ngOnInit(): void {
        this.isLogged = this.authService.getIsLoggedIn();
        if (this.isLogged) {
            this.getUserInfoHeader();
        }
        this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
            this.isLogged = isLoggedIn;
            if (this.isLogged) {
                this.getUserInfoHeader();
            }
        });

        this.navigateService.activeElement.subscribe((id: string) => {
            this.activeElement = id;
        });
    }

    getUserInfoHeader() {
        this.userService.getUserInfo()
            .subscribe((data: UserInfoType | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                    throw new Error((data as DefaultResponseType).message);
                }
                if ((data as UserInfoType)) {
                    this.userInfo = data as UserInfoType;
                }
            });
    }

    logout(): void {
        this.authService.logout()
            .subscribe({
                next: () => {
                    this.doLogout();
                },
                error: () => {
                    this.doLogout();
                }
            })
    }

    doLogout(): void {
        this.authService.removeTokens();
        this.authService.userId = null;
        this._snackBar.open('Вы вышли из системы');
        this.router.navigate(['/login']);
    }

    //при использовании в шаблоне <a routerLink="/" fragment="reviews" routerLinkActive="active" [routerLinkActiveOptions]="linkActiveOptions">Отзывы</a>
    // linkActiveOptions: IsActiveMatchOptions = {
    //     matrixParams: 'exact',
    //     queryParams: 'exact',
    //     paths: 'exact',
    //     fragment: 'exact',
    // };

    navigate(fragment: string): void {
        this.navigateService.navigate(fragment);
    }

}
