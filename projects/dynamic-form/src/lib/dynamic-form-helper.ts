import {
    ControlsSettings,
    FieldSettings,
    FieldValidation,
    FormComponentConfig,
    FormDefaultValues,
    FormSettings
} from './types';
import {ValidatorFn, AsyncValidatorFn, FormGroup, AbstractControl, FormControl, Validators} from '@angular/forms';
import {FormInputComponent} from './components/form-input/form-input.component';
import {FormNativeSelectComponent} from './components/form-selector/form-native-select.component';
import {FormCheckboxComponent} from './components/form-checkbox/form-checkbox.component';
import {FormTextareaComponent} from './components/form-textarea/form-textarea.component';

export class DynamicFormHelper{
    /**
     * Returns all functions of  simple validators from settings
     * @params controlSettings FieldSettings
     */
    public static getControlValidators(controlSettings: FieldSettings): ValidatorFn[]{
        const result: ValidatorFn[] = [];
        const validation: FieldValidation = controlSettings.validation || null;

        if (!validation) {
            return result;
        }

        if (typeof validation.validatiorFn === 'function') {
            result.push(controlSettings.validation.validatiorFn);
        }

        if (validation.required) {
            result.push(Validators.required);
        }

        if (typeof validation.maxLength === 'number') {
            result.push(Validators.maxLength(validation.maxLength));
        }

        if (typeof validation.minLength === 'number') {
            result.push(Validators.minLength(validation.minLength));
        }

        return result;
    }

    /**
     * Returns all functions of asynchronous validators from settings
     * @params controlSettings FieldSettings
     */
    public static getControlAsyncValidators(controlSettings: FieldSettings): AsyncValidatorFn[]{
        const result: AsyncValidatorFn[] = [];
        const validation: FieldValidation = controlSettings.validation || null;

        if (!validation) {
            return result;
        }

        if (typeof validation.asyncValidatorFn === 'function') {
            result.push(controlSettings.validation.asyncValidatorFn);
        }

        return result;
    }

    /**
     * Returns default object with keys and component values
     */
    public static getDefaultConfig(): FormComponentConfig{
        return {
            string: FormInputComponent,
            number: FormInputComponent,
            password: FormInputComponent,
            nativeSelect: FormNativeSelectComponent,
            checkbox: FormCheckboxComponent,
            textarea: FormTextareaComponent,
        };
    }

    /**
     * Returns default object with keys and error values
     */
    public static getDefaultErrorMessages(): { [key: string]: string }{
        return {
            required: 'This field is required',
            maxLength: 'Too long',
            minLength: 'Too small',
            unknown: 'Validation error'
        };
    }

    /**
     * Returns control settings by control name  or control name with group name
     * @param settings FormSettings<ControlsSettings>
     * @param controlName string
     * @param groupName string
     */
    public static getFieldSettings(settings: FormSettings<ControlsSettings>, controlName: string, groupName?: string): ControlsSettings{
        return groupName ?
            settings.controls[groupName].controls[controlName] :
            settings.controls[controlName];
    }

    /**
     * Returns new FormControl
     * @param controlName string
     * @param controlSettings ControlsSettings
     * @param value any
     */
    public static getNewControl(controlName: string, controlSettings: ControlsSettings, value: any): FormControl{
        return new FormControl(value, {
            updateOn: controlSettings.updateOn || 'change',
            validators: DynamicFormHelper.getControlValidators(controlSettings),
            asyncValidators: DynamicFormHelper.getControlAsyncValidators(controlSettings),
        });
    }

    /**
     * Returns return AbstractControl (in fact FormControl) from form by control name  or control name with group name
     * @param form FormGroup
     * @param controlKey string
     * @param groupKey string
     */
    public static getFormFieldControl(form: FormGroup, controlKey: string, groupKey?: string): AbstractControl{
        const path = groupKey ? `${groupKey}.${controlKey}` : controlKey;

        return form.get(path);
    }

    /**
     * Returns an object with created controls on settings with default values ​​affixed
     * @param group ControlsSettings
     * @param defaultValues FormDefaultValues
     */
    public static getNewFormGroupControl(group: ControlsSettings, defaultValues: FormDefaultValues): { [key: string]: FormControl }{
        const result = {};

        for ( const controlName of Object.keys(group.controls) ) {
            result[controlName] = DynamicFormHelper.getNewControl(controlName, group.controls[controlName], defaultValues[controlName]);
        }

        return result;
    }
}
