import {ComponentFactoryResolver, ComponentRef, Injectable} from '@angular/core';
import {
    ControlsSettings,
    FieldType,
    FormComponentConfig,
    FormDefaultValues, FormGenericComponent,
    FormSettings
} from '../types';
import {DynamicFormHelper} from '../dynamic-form-helper';
import {AddComponentDirective} from '../directives/add-component.directive';
import {FormGroup} from '@angular/forms';
import {ConfigService} from './config.service';

@Injectable()
export class DynamicFormService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private  configService: ConfigService,
    ) {
    }

    /**
     * Returns configuration of form field
     */
    private getFieldConfig(): FormComponentConfig {
        const defaultConfig: FormComponentConfig = DynamicFormHelper.getDefaultConfig();
        let userConfig: FormComponentConfig = {};
        if (this.configService.config) {
            userConfig = this.configService.config.controlsComponents || {};
        }

        return {...defaultConfig, ...userConfig};
    }

    /**
     * Form HTML template rendering
     * @ param form FormGroup
     * @ param settings FormSettings<ControlsSettings>
     * @ param defaultValues FormDefaultValues
     * @ param adHost AddComponentDirective
     */
    public loadTemplate(
        form: FormGroup,
        settings: FormSettings<ControlsSettings>,
        defaultValues: FormDefaultValues,
        adHost: AddComponentDirective
    ): void {
        const config: FormComponentConfig = this.getFieldConfig();
        const controlsSettings: { [key: string]: ControlsSettings } = settings.controls;

        const mapGroupSettings = Object.keys(controlsSettings)
            .filter((controlName: string) => controlsSettings[controlName].type === FieldType.group)
            .map((groupName: string) => {
                const controls = controlsSettings[groupName].controls;
                return Object.keys(controls)
                    .map((controlName: string) => ({
                        groupName,
                        controlName,
                        type: controls[controlName].type
                    }));
            });

        const mapControlSettings = Object.keys(controlsSettings)
            .filter((controlName: string) => controlsSettings[controlName].type !== FieldType.group)
            .map((controlName: string) => ([{
                groupName: null,
                controlName,
                type: controlsSettings[controlName].type

            }]));

        const map = mapGroupSettings.concat(mapControlSettings)
            .reduce((a, b) => ([...a, ...b]));


        for ( const controlMap of Object.values(map) ) {
            const groupName = controlMap.groupName;
            const controlName = controlMap.controlName;

            let defaultValue;

            if (groupName) {
                defaultValue = defaultValues[groupName] ?
                    defaultValues[groupName][controlName] :
                    null;
            }

            defaultValue = defaultValues[controlName];

            this.loadComponent(
                adHost,
                config[controlMap.type],
                {
                    control: DynamicFormHelper
                        .getFormFieldControl(form, controlMap.controlName, controlMap.groupName),
                    settings: DynamicFormHelper
                        .getFieldSettings(settings, controlMap.controlName, controlMap.groupName),
                    defaultValues: defaultValue,

                }
            );
        }
    }

    /**
     * Single component template rendering
     * @param host AddComponentDirective
     * @param component FormGenericComponent
     * @param data any
     */
    private loadComponent(host: AddComponentDirective, component: FormGenericComponent, data: any): void {
        const componentRef: ComponentRef<FormGenericComponent> = host.viewContainerRef.createComponent(
            this.componentFactoryResolver.resolveComponentFactory<FormGenericComponent>(component)
        );

        const fieldInstance: FormGenericComponent = componentRef.instance;

        for ( const key of Object.keys(data) ) {
            fieldInstance[key] = data[key];
        }
    }
}
