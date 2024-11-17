import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoneyPageRoutingModule } from './money-routing.module';
import { MoneyPage } from './money.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MoneyEffects } from './effects/money.effects';
import { moneyReducer } from './reducer/money.reducer';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    MoneyPageRoutingModule,
    StoreModule.forFeature('money', moneyReducer),
    EffectsModule.forFeature([MoneyEffects]),
  ],
  declarations: [MoneyPage],
})
export class MoneyPageModule {}
