import {Exercise} from './exercise.model';
import {Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {map} from 'rxjs/operators';
import {UiService} from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import {Store} from '@ngrx/store';
import * as UI from '../shared/ui.action';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisedChanged = new Subject<Exercise[]>();
  private firebaseSubscriptions: Subscription[] = [];

  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromRoot.State>) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.firebaseSubscriptions.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as Exercise
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching exercises failed, please try again later.', null, 3000);
        this.exercisesChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      calories: this.runningExercise.calories * (progress / 100),
      duration: this.runningExercise.duration * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);

  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  getPastExercises() {
    this.firebaseSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisedChanged.next(exercises);
      }, error => {
        console.log(error);
      }));
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(
      subscription => {
        subscription.unsubscribe();
      }
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db
      .collection('finishedExercises')
      .add(exercise);
  }
}
