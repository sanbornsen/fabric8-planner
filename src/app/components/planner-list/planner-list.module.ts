import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';

import {
  HttpModule,
  Http,
  XHRBackend,
  RequestOptions
} from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-modal';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule,
  WidgetsModule
} from 'ngx-widgets';

import { NgxDatatableModule } from 'rh-ngx-datatable';

import { FilterColumn } from '../../pipes/column-filter.pipe';

import { ActionModule, ListModule, EmptyStateModule } from 'patternfly-ng';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';


import { GlobalSettings } from '../../shared/globals';
import {
  FabPlannerAssociateIterationModalModule
} from '../work-item-iteration-modal/work-item-iteration-modal.module';
import { GroupTypesModule } from '../group-types-panel/group-types-panel.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { LabelsModule } from '../labels/labels.module';
import { PlannerModalModule } from '../modal/modal.module';
import { PlannerListRoutingModule } from './planner-list-routing.module';
import { SidepanelModule } from '../side-panel/side-panel.module';
import { ToolbarPanelModule } from '../toolbar-panel/toolbar-panel.module';
import { UrlService } from './../../services/url.service';
import { WorkItemDetailModule } from '../work-item-detail/work-item-detail.module';
import { WorkItemDetailAddTypeSelectorModule } from '../work-item-create/work-item-create.module';
import { PlannerListComponent } from './planner-list.component';
import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';
import { PlannerLayoutModule } from './../../widgets/planner-layout/planner-layout.module';
import { WorkItemService } from '../../services/work-item.service';
import { MockHttp } from '../../mock/mock-http';
import { HttpService } from '../../services/http-service';
import { LabelService } from '../../services/label.service';
import { AssigneesModule } from './../assignee/assignee.module';
import { WorkItemCellComponent } from '../work-item-cell/work-item-cell.component';
import { CookieService } from '../../services/cookie.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { EventService } from './../../services/event.service';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as states from './../../states/index.state';
import * as reducers from './../../reducers/index.reducer';
import * as effects from './../../effects/index.effects';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    BsDropdownConfig,
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useClass: MockHttp
    },
    LabelService,
    TooltipConfig,
    UrlService,
    CookieService
  ];
} else {
  providers = [
    BsDropdownConfig,
    GlobalSettings,
    WorkItemService,
    WorkItemDataService,
    EventService,
    Logger,
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    LabelService,
    TooltipConfig,
    UrlService,
    CookieService
  ];
}

@NgModule({
  imports: [
    ActionModule,
    AlmIconModule,
    AssigneesModule,
    BsDropdownModule.forRoot(),
    CommonModule,
    DialogModule,
    EmptyStateModule,
    FabPlannerAssociateIterationModalModule,
    HttpModule,
    InfiniteScrollModule,
    GroupTypesModule,
    IterationModule,
    LabelsModule,
    ListModule,
    ModalModule,
    PlannerLayoutModule,
    PlannerListRoutingModule,
    SidepanelModule,
    ToolbarPanelModule,
    TooltipModule.forRoot(),
    WidgetsModule,
    WorkItemDetailModule,
    WorkItemQuickAddModule,
    WorkItemDetailAddTypeSelectorModule,
    PlannerModalModule,
    NgxDatatableModule,
    StoreModule.forFeature('listPage', {
        iterations: reducers.iterationReducer,
        labels: reducers.LabelReducer,
        areas: reducers.AreaReducer,
        collaborators: reducers.CollaboratorReducer,
      }, {
      initialState: {
        iterations: states.initialIterationState,
        labels: states.initialLabelState,
        areas: states.initialAreaState,
        collaborators: states.initialCollaboratorState
      }
    }),
    EffectsModule.forFeature([
      effects.IterationEffects,
      effects.LabelEffects,
      effects.AreaEffects,
      effects.CollaboratorEffects
    ])
  ],
  declarations: [
    PlannerListComponent,
    WorkItemCellComponent,
    FilterColumn
  ],
  providers: providers,
  exports: [ PlannerListComponent ]
})
export class PlannerListModule {
  constructor(http: Http) {}
}
