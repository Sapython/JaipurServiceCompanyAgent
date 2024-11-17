import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IdentityproofService } from './services/identityproof.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/shared/models/app.structure';
import { firstValueFrom, take } from 'rxjs';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-identity-proof',
  templateUrl: './identity-proof.page.html',
  styleUrls: ['./identity-proof.page.scss'],
})
export class IdentityProofPage {
  aadhaarImage: File | undefined;
  panImage: File | undefined;
  identityForm: FormGroup = new FormGroup({
    panNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExp('[A-Z]{5}[0-9]{4}[A-Z]{1}')),
    ]),
    aadhaarNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(RegExp('[0-9]{12}')),
    ]),
  });
  agent = this.store.select('app', 'agentData');
  constructor(
    private identityService: IdentityproofService,private router :Router, private menuController: MenuController,
    private store: Store<{ app: AppState }>,
  ) {
    this.agent.pipe(take(1)).subscribe((agent) => {
      if (agent) {
        this.identityForm.patchValue({
          panNumber: agent.userProofDocument.panNumber,
          aadhaarNumber: agent.userProofDocument.aadhaarNumber,
        });
      }
    });
  }

  async submit() {
    let agent = await firstValueFrom(this.agent);
    this.identityService.updateKycDetails(
      agent!.uid,
      this.identityForm.get('aadhaarNumber')!.value,
      this.identityForm.get('panNumber')!.value,
      this.aadhaarImage,
      this.panImage,
    );
  }
  close(){
    this.router.navigate(['main/home'])
    this.menuController.open();
  }
}
