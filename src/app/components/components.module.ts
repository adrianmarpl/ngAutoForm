import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AutoFormsComponent } from './autoforms/autoforms.component';
import { MatInputModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AutoFormsComponent
    ],
    imports     : [
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ],
    exports     : [
        AutoFormsComponent
    ]
})

export class ComponentsModule
{
}
