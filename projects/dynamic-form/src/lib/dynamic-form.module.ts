import {
    CUSTOM_ELEMENTS_SCHEMA,
    ModuleWithProviders,
    NgModule,
    Optional,
    SkipSelf
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormInputComponent} from './components/form-input/form-input.component';
import {FormTextareaComponent} from './components/form-textarea/form-textarea.component';
import {FormNativeSelectComponent} from './components/form-selector/form-native-select.component';
import {FormCheckboxComponent} from './components/form-checkbox/form-checkbox.component';
import {FormComponent} from './components/form/form.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {ConfigService, USER_CONFIG_TOKEN} from './services/config.service';
import {AddComponentDirective} from './directives/add-component.directive';
import {FormConfig} from './types';
import { FormErrorComponent } from './components/form-error/form-error.component';

@NgModule({
    declarations: [FormInputComponent,
        FormTextareaComponent,
        FormNativeSelectComponent,
        FormCheckboxComponent,
        FormComponent,
        AddComponentDirective,
        FormErrorComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule
    ],
    entryComponents: [
        FormInputComponent,
        FormTextareaComponent,
        FormNativeSelectComponent,
        FormCheckboxComponent,
        FormComponent,
        FormErrorComponent
    ],
    exports: [FormInputComponent,
        FormTextareaComponent,
        FormNativeSelectComponent,
        FormCheckboxComponent,
        FormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicFormModule{
    constructor(@Optional() @SkipSelf() parentModule: DynamicFormModule){
        if (parentModule) {
            throw new Error(
                'DynamicFormModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(config?: FormConfig): ModuleWithProviders {
        return {
            ngModule: DynamicFormModule,
            providers: [
                {provide: USER_CONFIG_TOKEN,
                    useValue: config || {}},
                ConfigService
            ],
        };
    }
}
