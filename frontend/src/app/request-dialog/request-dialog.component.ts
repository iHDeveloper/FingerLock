import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  name: string;
  timeout: number;
  type: 'accept' | 'reject' | 'wait';
}

@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css'],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class RequestDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RequestDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.countdown()
  }

  countdown() {
    setTimeout(() => {
      this.data.timeout = this.data.timeout - 1000;
      if (this.data.timeout <= 0) {
        this.data.timeout = 0;
        return;
      }
      this.countdown()
    }, 1000);
  }

  onAccept(data) {
  }

  onReject(data) {
  }

}
