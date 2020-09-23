import {Exercise} from './exercise.model';
import {from, Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {map, take} from 'rxjs/operators';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as UI from '../shared/ui.action';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromTraining.State>) {}

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
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackbar('Fetching exercises failed, please try again later.', null, 3000);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe( exercise => {
        this.addDataToDatabase({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe( exercise => {
        this.addDataToDatabase({
          ...exercise,
          calories: exercise.calories * (progress / 100),
          duration: exercise.duration * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  getPastExercises() {
    this.firebaseSubscriptions.push(this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedTrainings(exercises));
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
