import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchServiceService } from '../fetch-service.service'
import { MatDialog } from '@angular/material/dialog';
import { MatchModalComponent } from '../match-modal/match-modal.component';

@Component({
  selector: 'app-favorites-modal',
  templateUrl: './favorites-modal.component.html',
  styleUrls: ['./favorites-modal.component.scss']
})
export class FavoritesModalComponent {

  favoriteDogs: any[];

  constructor(
    public dialogRef: MatDialogRef<FavoritesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: FetchServiceService,
    private dialog: MatDialog
  ) {
    this.favoriteDogs = data.favorites;
    console.log(data.favorites)
  }

  findMatch() {
    const favoriteDogIds = this.favoriteDogs.map(dog => dog.id);
    this.apiService.matchDogs(favoriteDogIds).subscribe((matchedDogId) => {
      const matchedDog = matchedDogId.match
      this.apiService.getDetailedDogs([matchedDog]).subscribe((dogDetails) => {
        this.dialog.open(MatchModalComponent, {
          data: { matchedDog: dogDetails[0] }
        });
      });
    });
  }
  

  close() {
    this.dialogRef.close();
  }

}
