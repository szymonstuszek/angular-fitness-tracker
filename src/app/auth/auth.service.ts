import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {UiService} from '../shared/ui.service';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private angularAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private uiService: UiService) {}

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
    this.uiService.loadingStateChanged.next(true);
    this.angularAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.angularAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    )
    .then(result => {
      this.uiService.loadingStateChanged.next(false);
    })
    .catch(error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    this.angularAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
