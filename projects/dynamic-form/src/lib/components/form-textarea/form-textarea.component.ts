import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Field} from '../field';
import {FieldCb, FieldSettings, FieldType} from '../../types';

export interface FormTextareaSettings extends FieldSettings {
    type: FieldType.textarea;
    placeholder?: string;
    onChange?: FieldCb<string | number>;
    isResize?: boolean;
}

@Component({
    selector: 'app-form-text',
    templateUrl: './form-textarea.component.html',
    styleUrls: ['./form-textarea.component.scss', '../form/form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormTextareaComponent extends Field<FormTextareaSettings, string> {
    public isFocus = false;

    public onBlur(): void {
        this.isFocus = false;
        this.control.markAsDirty();
    }

    public getIsShowError(): boolean {
        return !this.isFocus && super.getIsShowError();
    }
}
