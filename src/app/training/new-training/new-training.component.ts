import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {UiService} from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UiService,
              private store: Store<fromRoot.State> ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription =
      this.trainingService
          .exercisesChanged
          .subscribe(
            exercises => {
              this.isLoading$ = this.store.select(fromRoot.getIsLoading);
              this.exercises = exercises;
            }
          );
    this.trainingService.fetchAvailableExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }
}
