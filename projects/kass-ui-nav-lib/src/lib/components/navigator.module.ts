import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorComponent } from './navigator/navigator.component';
import { LinkComponent } from './link/link.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, RouterModule, NgbDropdownModule, FormsModule],
  declarations: [NavigatorComponent, LinkComponent],
  exports: [NavigatorComponent],
})
export class NavigatorModule {}
