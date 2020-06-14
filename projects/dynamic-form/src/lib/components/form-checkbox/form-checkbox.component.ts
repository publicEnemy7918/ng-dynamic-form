import { Component, OnInit } from '@angular/core';
import {Field} from "../field";
import {FieldSettings} from "../../types";

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss', '../form/form.component.scss']
})
export class FormCheckboxComponent extends Field<FieldSettings, boolean>{

}
