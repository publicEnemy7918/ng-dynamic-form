import {
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    Input, KeyValueChangeRecord, KeyValueChanges,
    KeyValueDiffer,
    KeyValueDiffers,
    OnDestroy,
    OnInit,
    Output, ViewChild
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {DynamicFormHelper} from '../../dynamic-form-helper';
import {
    ControlsSettings,
    FieldType,
    FormDefaultValues,
    FormSettings
} from '../../types';
import {takeUntil} from 'rxjs/operators';
import {AddComponentDirective} from '../../directives/add-component.directive';
import {DynamicFormService} from '../../services/dynamic-form.service';

@Component({
    selector: 'app-form',
    template: `
        <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">
            <ng-template appAddComponent></ng-template>
            <button *ngIf="settings.submitLabel" type="submit" [disabled]="settings.submitDisabled">
                {{settings.submitLabel}}
            </button>
        </form>`,
    styleUrls: ['./form.component.scss'],
    providers: [DynamicFormService] // service instance for each form instance
})

export class FormComponent implements OnInit, OnDestroy, DoCheck{
    @ViewChild(AddComponentDirective, {static: true}) adHost: AddComponentDirective;
    @Input() settings: FormSettings<ControlsSettings>;
    @Input() defaultValues: FormDefaultValues = {};
    @Output() onDfInit = new EventEmitter<FormGroup>();
    @Output() onSubmitForm = new EventEmitter<any>();
    @Output() onChangeForm = new EventEmitter<any>();

    private destroy$ = new EventEmitter<void>();
    private settingsDiffer: KeyValueDiffer<string, any>;

    public form: FormGroup;

    constructor(private cdr: ChangeDetectorRef,
                private formService: DynamicFormService,
                private differs: KeyValueDiffers){
    }

    /**
     * Get controls by settings
     */
    private getControls(): any{
        const fields = {};

        Object.keys(this.settings.controls).forEach((controlName) => {
            const controlSettings: ControlsSettings = this.settings.controls[controlName];

            fields[controlName] = controlSettings.type === FieldType.group ?
                new FormGroup(DynamicFormHelper.getNewFormGroupControl(controlSettings as ControlsSettings, this.defaultValues)) :
                DynamicFormHelper.getNewControl(controlName, this.settings.controls[controlName], this.defaultValues[controlName]);
        });

        return fields;
    }

    /**
     * Runs force FormControl or FormGroup validation
     * @param control FormControl | FormGroup
     */
    private validateControlManually(control: FormControl| FormGroup): void{
        control.markAsDirty();
        control.updateValueAndValidity();
    }

    private filterFormValue(value: any): any{
        let result = {};
        const controlsSettings = this.settings.controls;

        Object.keys(value).forEach((key) => {
            const fieldSettings = controlsSettings[key];
            const fieldValue = value[key];

            if (fieldSettings.type === FieldType.group && fieldSettings.isFlat) {
                result = {...result, ...fieldValue};
                return;
            }

            result[key] = fieldValue;
        });

        return result;
    }

    /**
     * Updates form disabled
     * @param value boolean
     */
    private updateDisabled(value: boolean): void{
        value ? this.form.disable() : this.form.enable();
    }

    private getFirstInvalidControlKey(): string{
        let result = null;
        for ( const key in this.form.controls ) {
            const control = this.form.controls[key];

            if (control.invalid) {
                result = key;
                break;
            }
        }

        return `data-${result}`;
    }

    /**
     * Runs force form validation
     * @param control FormControl | FormGroup
     */
    public validateFormManually(group: FormGroup): void{
        const values = Object.values(group.controls);

        for ( let i = 0; i < values.length; i++ ) {
            const control: FormGroup = (values[i] as FormGroup);
            control.controls ? this.validateFormManually(control) : this.validateControlManually(control);
        }
    }

    /**
     * On submit form handler. Trigger an onSubmitForm event on a component
     * @listens onSubmit
     */
    public onSubmit(): void{
        this.validateFormManually(this.form);
        if (!this.form.valid) {
            // document.querySelector(this.getFirstInvalidControlKey()).scrollIntoView();
            return;
        }
        this.onSubmitForm.emit(this.filterFormValue(this.form.value));
    }

    ngOnInit(): void{
        this.form = new FormGroup(this.getControls());
        this.settingsDiffer = this.differs.find(this.settings).create();
        this.onDfInit.emit(this.form);

        this.form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => this.onChangeForm.emit(value));

        this.updateDisabled(this.settings.disabled);
        this.formService.loadTemplate(this.form, this.settings, this.defaultValues, this.adHost);
    }

    ngDoCheck(): void{
        const diff: KeyValueChanges<string, any> = this.settingsDiffer.diff(this.settings);

        if (diff) {
            diff.forEachChangedItem((record: KeyValueChangeRecord<string, any>) => {
                if (record.key === 'disabled') {
                    this.updateDisabled(record.currentValue);
                } else if (record.key !== 'controls') {
                    this.cdr.detectChanges();
                }
            });
        }
    }

    ngOnDestroy(): void{
        this.destroy$.emit();
    }
}
