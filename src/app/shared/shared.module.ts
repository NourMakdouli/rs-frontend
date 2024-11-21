import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { MarketplaceRoutingModule } from '../front-office/marketplace/marketplace-routing.module';
import { FrontOfficeRoutingModule } from '../front-office/front-office-routing.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { CharacterLimitPipe } from '../core/utils/pipes/character-limit.pipe';
import { IsDraftFilterPipe } from '../core/utils/pipes/is-draft-filter.pipe';
import { OffCanvasContentComponent } from './off-canvas-content/off-canvas-content.component';
import { ClockComponent } from './clock/clock.component';
import { DateTimeFormatPipe } from '../core/utils/pipes/date-time-format.pipe';
import { WeatherComponent } from './weather/weather.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ErrorPageComponent,
    SpinnerComponent,
    CharacterLimitPipe,
    IsDraftFilterPipe,
    OffCanvasContentComponent,
    ClockComponent,
    DateTimeFormatPipe,
    WeatherComponent
  ],
  imports: [
    MarketplaceRoutingModule,
    FrontOfficeRoutingModule,
    CommonModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SidebarComponent,WeatherComponent,
    SpinnerComponent,    CharacterLimitPipe,
    IsDraftFilterPipe,OffCanvasContentComponent

  ]
})
export class SharedModule { }
