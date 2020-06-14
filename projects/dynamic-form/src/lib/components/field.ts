import {
    OnInit,
    OnDestroy,
    DoCheck, Input, EventEmitter,
    HostBinding, KeyValueDiffers,
    ChangeDetectorRef, KeyValueDiffer, KeyValueChangeRecord, KeyValueChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {takeUntil, filter} from 'rxjs/operators';
import {FieldSettings, FieldValidation, FieldCbType, FieldCb} from '../types';

export class Field<T extends FieldSettings, V> implements OnInit, OnDestroy, DoCheck {
    @HostBinding('class') get class(): string {
        let classes: string = this.settings.hostClass || '';
        if (this.settings.disabled || this.control.disable) {
            classes += this.settings.disabledClass || '';
        }
        return classes;
    }

    @Input() control: FormControl;
    @Input() settings: T;
    @Input() defaultValue: V;
    private settingsDiffer: KeyValueDiffer<string, any>;
    private validationDiffer: KeyValueDiffer<string, any>;
    private isValidation = false;

    public destroy$ = new EventEmitter<void>();

    /**
     * Returns need to show error
     */
    public getIsShowError(): boolean {
        return !!this.control && !this.control.valid && this.control.enabled && this.control.dirty;
    }

    constructor(
        public cdr: ChangeDetectorRef,
        public differs: KeyValueDiffers) {
    }

    /**
     * Creates basic differs for trapping field settings and redrawing a tree if something has changed
     */
    private creteBaseDiffers(): void {
        this.settingsDiffer = this.differs.find(this.settings).create();
        const validation: FieldValidation = this.settings.validation;
        if (this.settings.validation) {
            this.isValidation = true;
            this.validationDiffer = this.differs.find(validation).create();
        }
    }

    /**
     * Updates control disabled
     * @param value boolean
     */
    private updateDisabled(value: boolean): void {
        value ? this.control.disable() : this.control.enable();
    }

    public triggerCb(value: string | number, type: FieldCbType) {
        const fn: FieldCb<any> = this.settings[type];

        if (fn && typeof fn === 'function') {
            fn(value);
        }
    }

    /**
     * Listen onChange or ngModelChange event & trigger settings callback function
     * @listens OnChange | ngModelChange
     * @param value string | number
     */
    public onChange(value: string | number): void {
        this.triggerCb(value, FieldCbType.change);
    }

    ngOnInit() {
        this.control.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                filter((s: string) => s === 'INVALID')
            )
            .subscribe(() => this.cdr.detectChanges());


        this.creteBaseDiffers();
        this.updateDisabled(this.settings.disabled);
    }

    ngDoCheck() {
        const settingsDiff: KeyValueChanges<string, any> = this.settingsDiffer.diff(this.settings);
        const validatorDiff: KeyValueChanges<string, any> = this.isValidation ?
            this.validationDiffer.diff(this.validationDiffer) :
            null;

        if (settingsDiff) {
            settingsDiff.forEachChangedItem((record: KeyValueChangeRecord<string, any>) => {
                if (record.key === 'disabled') {
                    this.updateDisabled(record.currentValue);
                } else {
                    this.cdr.detectChanges();
                }
            });
        }

        if (validatorDiff) {
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy() {
        this.destroy$.emit();
    }
}
