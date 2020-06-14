import {AsyncValidatorFn, ValidatorFn} from '@angular/forms';
import {Field} from './components/field';

export enum FieldType{
    group = 'group',
    string = 'string',
    number = 'number',
    checkbox = 'checkbox',
    radio = 'radio',
    nativeSelect = 'nativeSelect',
    password = 'password',
    textarea = 'textarea',
}

export enum FieldCbType{
    click = 'onClick',
    change = 'onChange'
}

export interface FormConfig {
    controlsComponents?: FormComponentConfig;
    customErrorLabels?: {[key: string]: string};
}

export interface FieldSettings {
    type: FieldType | string;
    disabled?: boolean;
    label?: string;
    hostClass?: string;
    fieldClass?: string;
    updateOn?: string;
    disabledClass?: string;
    validation?: FieldValidation;
    isFlat?: boolean;
    errorOutput?: FieldErrorsSettings;
    controls?: {
        [key: string]: FieldSettings;
    };
}

export interface FieldValidation{
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    validatiorFn?: ValidatorFn;
    asyncValidatorFn?: AsyncValidatorFn;
}

export interface FieldErrorsSettings{
    priorityKeys?: string[];
    isSingleOutput?: boolean;
}

export interface FormSettings<C extends {[key: string]: FieldSettings}>{
    label?: string;
    submitLabel?: string;
    disabled?: boolean;
    submitDisabled?: boolean;
    controls: C;
}

export interface FormComponentConfig{
    [key: string]: any;
}

export interface FormDefaultValues{
    [key: string]: any;
}

export type FieldCb<V> = (value: V) => void;
export type ControlsSettings = any & FieldSettings;
export type FormGenericComponent = any & Field<any & FieldSettings, any>;

