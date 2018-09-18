import { NgModule } from '@angular/core';

import { NpaSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [NpaSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [NpaSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class NpaSharedCommonModule {}
