import { Component, OnInit, Input, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

@Component({
  selector: 'auto-forms',
  templateUrl: './autoforms.component.html',
  styleUrls: ['./autoforms.component.scss']
})
export class AutoFormsComponent implements OnInit {
  @Input() dataObject;

  @Output()
  formChanged: EventEmitter<any>;

  form: FormGroup;
  objectProps;
  lodash = _;

  constructor(private elRef: ElementRef) {
    this.formChanged = new EventEmitter();
  }

  Run(pString) {
    return eval(pString);
  }
  ngOnInit() {
    // remap the API to be suitable for iterating over it
    this.renderForm();
  }
  ngOnChanges(changes: any) {
    console.log('ngChanges: ', changes);
    this.renderForm();
    this.renderAfter();
  }
  renderForm() {
    if (!this.dataObject)
      return;
    this.objectProps =
      Object.keys(this.dataObject)
        .map(prop => {
          return Object.assign({}, { key: prop }, this.dataObject[prop]);
        });

    // setup the form
    const formGroup = {};
    for (let prop of Object.keys(this.dataObject)) {
      var element = this.dataObject[prop];
      console.log('prop: ', prop);
      if (this.dataObject[prop].type == 'select_range') {
        this.dataObject[prop].options = this.Run.call(this, this.dataObject[prop].range);
      }
      var formControl = new FormControl(this.dataObject[prop].value || '', this.mapValidators(this.dataObject[prop].validation));
      console.log('formControl: ', formControl);

      formControl.valueChanges.subscribe(val => {
        this.setReleatedFields(this.dataObject[prop], val);

        let evalField = this.dataObject[prop].evalField;
        if (evalField) {
          var evalString = this.dataObject[evalField].evalString;
          if (evalString) {
            // console.log('evalString: ',evalString);
            let evalResult = this.Run.call(this, evalString);
            this.form.get(evalField).setValue(evalResult);
          }
        }
      });
      formGroup[prop] = formControl;
      // .valueChanges.subscribe(val=>{

      // });
    }

    this.form = new FormGroup(formGroup);
    this.form.valueChanges.subscribe(val => {
      // console.log('val: ', val);
      this.formChanged.emit(this.form);
    })

  }
  renderAfter() {
    if (!this.dataObject)
      return;
    for (let prop of Object.keys(this.dataObject)) {
      var element = this.dataObject[prop];

      this.setReleatedFields(element, element.value);
    }
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    setTimeout(() => {
      this.renderAfter();
    }, 1000);
  }
  private setReleatedFields(element, val) {
    var releatedFields = element.releatedFields;
    if (releatedFields) {
      for (let rel of Object.keys(releatedFields)) {
        var keyField = releatedFields[rel].key;
        console.log(keyField);
        var field = this.form.get(keyField);
        var hElement: HTMLElement = this.elRef.nativeElement;
        var rowField = hElement.getElementsByClassName(keyField + '_field');

        if (val === releatedFields[rel].value) {
          // field.enable();
          if (rowField.length > 0)
            rowField[0].setAttribute('style', 'display: ');
        }
        else {
          // field.disable();
          if (rowField.length > 0)
            rowField[0].setAttribute('style', 'display: none');
        }
      }
    }
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }

    return formValidators;
  }

  onSubmit(form) {
    console.log(form);
  }
}
