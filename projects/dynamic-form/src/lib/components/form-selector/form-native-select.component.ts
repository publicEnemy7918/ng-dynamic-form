import {ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Field} from '../field';
import {FieldCb, FieldSettings, FieldType} from '../../types';

export interface FormNativeSelectSettings extends FieldSettings {
    type: FieldType.nativeSelect;
    options: FormNativeSelectSettingsOption[];
    onChange?: FieldCb<string | number>;
    multiple?: boolean;
}

export type FormNativeSelectSettingsOption = {
    label: string | number;
    value: string | number;
} | string | number;

@Component({
    selector: 'app-form-selector',
    templateUrl: './form-native-select.component.html',
    styleUrls: ['./form-native-select.component.scss', '../form/form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormNativeSelectComponent extends Field<FormNativeSelectSettings, string[] | number[]> implements OnInit {
    public getLabel(option: FormNativeSelectSettingsOption | string): string | number {
        return typeof option === 'string' || typeof option === 'number' ?
            option :
            option.label;
    }

    ngOnInit() {
        super.ngOnInit();
        if (!this.defaultValue) {
            const firsOfOption: FormNativeSelectSettingsOption = this.settings.options[0];
            this.control.setValue(typeof firsOfOption === 'object' ? firsOfOption.value : firsOfOption);
        }
    }

}
