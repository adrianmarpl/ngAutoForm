import { Component } from '@angular/core';
import { DataService } from './data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngAutoForms';
  personData: any[];
  result: any;

  constructor(private dataService: DataService
  ) {
    this.dataService.sendGetRequest('assets/data/person.json').subscribe((data: any[])=>{
      console.log(data);
      this.personData = data;
      // this.personData = JSON.parse(data.toString());
      // console.log(this.personData);
    })  
  }
  changeData(form: FormGroup) {
    console.log('changeData: ', form);
    this.result = JSON.stringify(form.value);
  }
}
