import {MatButtonModule, MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatSortModule, MatCardModule, MatDividerModule, MatDialogModule } from '@angular/material';
import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
      MatButtonModule,
      MatCheckboxModule,
      MatTabsModule,
      MatGridListModule,
      MatIconModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatSortModule,
      MatCardModule,
      MatDividerModule,
      MatDialogModule
    ],
  exports: [
      MatButtonModule,
       MatCheckboxModule,
       MatTabsModule,
       MatGridListModule,
       MatIconModule,
       MatTableModule,
       MatFormFieldModule,
       MatInputModule,
       MatSortModule,
       MatCardModule,
       MatDividerModule,
       MatDialogModule
    ],
})
export class MaterialsModule {}
