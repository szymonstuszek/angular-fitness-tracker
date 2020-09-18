import {NgModule} from '@angular/core';
import {MaterialModule} from '../material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class SharedModule {
}
