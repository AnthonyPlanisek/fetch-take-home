import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: ['./match-modal.component.scss']
})
export class MatchModalComponent {

  matchedDog: any;

  constructor(
    public dialogRef: MatDialogRef<MatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.matchedDog = data.matchedDog;
  }

  close() {
    this.dialogRef.close();
  }

}
