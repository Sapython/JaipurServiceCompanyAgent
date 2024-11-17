import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentityProofPage } from './identity-proof.page';

describe('IdentityProofPage', () => {
  let component: IdentityProofPage;
  let fixture: ComponentFixture<IdentityProofPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IdentityProofPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
