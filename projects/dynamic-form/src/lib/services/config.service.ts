import {Inject, Injectable, InjectionToken} from '@angular/core';
import {FormConfig} from '../types';

export const USER_CONFIG_TOKEN = new InjectionToken<FormConfig>('unique.string.for.config');

@Injectable()
export class ConfigService {
    public config: FormConfig;

    constructor(@Inject(USER_CONFIG_TOKEN) config: FormConfig){
        this.config = config;
    }
}
