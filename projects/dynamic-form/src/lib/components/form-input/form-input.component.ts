import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FieldSettings, FieldType, FieldCbType, FieldCb} from '../../types';
import {Field} from '../field';

export enum FormInputMode {
    text = 'text',
    none = 'none',
    numeric = 'numeric',
    search = 'search',
    email = 'email',
    url = 'url',
    decimal = 'decimal',
    tel = 'tel',
}

export interface FormInputSettings extends FieldSettings {
    type: FieldType.string | FieldType.number | FieldType.password;
    inputMode?: FormInputMode;
    placeholder?: string;
    onChange?: FieldCb<string | number>;
}

@Component({
    selector: 'app-form-input',
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss', '../form/form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FormInputComponent extends Field<FormInputSettings, string | number> {
    public isFocus = false;

    public onBlur(): void {
        this.isFocus = false;
        this.control.markAsDirty();
    }

    public getIsShowError(): boolean {
        return !this.isFocus && super.getIsShowError();
    }
}
