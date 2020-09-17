import {User} from './user.model';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth'
import {TrainingService} from '../training/training.service';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private angularAuth: AngularFireAuth,
              private trainingService: TrainingService) {}

  initAuthListener() {
    this.angularAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.angularAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
  }

  login(authData: AuthData) {
    this.angularAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
  }

  logout() {
    this.angularAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
