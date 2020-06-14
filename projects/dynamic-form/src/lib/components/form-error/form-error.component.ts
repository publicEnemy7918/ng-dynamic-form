import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    DoCheck,
    Input, KeyValueChanges,
    KeyValueDiffer,
    KeyValueDiffers,
    OnInit
} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {FieldErrorsSettings} from '../../types';
import {ConfigService} from '../../services/config.service';
import {DynamicFormHelper} from '../../dynamic-form-helper';

@Component({
    selector: 'app-form-error',
    templateUrl: './form-error.component.html',
    styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent {
    @Input() control: FormControl;
    @Input('<?') errorOutput: FieldErrorsSettings = {};

    private readonly errorsMap: { [key: string]: string };

    constructor(private configService: ConfigService) {
        this.errorsMap = {
            ...DynamicFormHelper.getDefaultErrorMessages(),
            ...this.configService.config.customErrorLabels
        };
    }

    public objectKeys = Object.keys;

    public getSingleError(): string {
        const priorityKeys: string[] = this.errorOutput.priorityKeys;
        const errors: ValidationErrors = this.control.errors;

        if (priorityKeys) {
            return this.getError(priorityKeys[0]) || 'Field is invalid';
        }

        return this.getError(Object.keys(errors)[0] || 'Field is invalid');
    }

    public getError(key: string) {
        return this.errorsMap[key];
    }
}
