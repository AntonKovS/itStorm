import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  activeElement = new Subject<string>();

  constructor() {
  }

  navigate(fragment: string): void {
    setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element && element as HTMLElement) {
        element?.scrollIntoView({behavior: 'smooth'});
      }
      this.activeElement.next(fragment);
    }, 100);
  }

}

