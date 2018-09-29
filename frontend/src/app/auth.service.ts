import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: string | undefined;

  constructor(private router: Router) {
    this.auth = undefined;
  }

  public isAuth(): boolean {
    return this.auth !== undefined;
  }

  public logout(): void {
    this.auth = undefined;
    this.router.navigate(['auth'])
  }

  public login(): void {
    this.auth = 'a';
    this.router.navigate([''])
  }

}
