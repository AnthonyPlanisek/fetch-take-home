import { Component, HostListener, OnInit } from '@angular/core';
import { FetchServiceService } from '../fetch-service.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FavoritesModalComponent } from '../favorites-modal/favorites-modal.component';

@Component({
  selector: 'app-dog-landing-page',
  templateUrl: './dog-landing-page.component.html',
  styleUrls: ['./dog-landing-page.component.scss']
})
export class DogLandingPageComponent implements OnInit {
  allBreeds: string[] = [];
  filteredBreeds: string[] = [];
  selectedBreed: string | null = null;
  showDropdown = false;
  searchTerm: string = '';
  detailedDogs: any[] = [];
  isAscending: boolean = true;
  favoriteDogs: any[] = [];

  constructor(private apiService: FetchServiceService, private dialog: MatDialog) {
    this.loadFavorites();
  }

  ngOnInit(): void {
    this.apiService.getDogBreeds().subscribe({
      next: (response: any) => {
        try {
          const breeds = Array.isArray(response) ? response : JSON.parse(response);
          this.allBreeds = breeds;
          this.filteredBreeds = breeds; 
        } catch (error) {
          console.error('Error parsing breeds response:', error);
        }
      }
    });
  }

  filterBreeds(): void {
    this.filteredBreeds = this.allBreeds.filter((breed) =>
      breed.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectBreed(breed: string): void {
    this.selectedBreed = breed;
    this.searchTerm = ''; 
    this.showDropdown = false; 
    this.searchDogs();
  }

  searchDogs(): void {
    if (!this.selectedBreed) return;

    this.apiService.searchDogs(this.selectedBreed).subscribe(
      (dogIds) => {
        
        this.apiService.getDetailedDogs(dogIds).subscribe(
          (detailedDogs) => {
            this.detailedDogs = this.sortDogs(detailedDogs, this.isAscending)
            console.log(detailedDogs)
          },
          (error) => console.error('Error fetching detailed dogs:', error)
        );
      },
      (error) => console.error('Error fetching dogs:', error)
    );
  }

  
  sortDogs(dogs: any[], ascending: boolean): any[] {
    return dogs.sort((a, b) => {
      return ascending 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
  }

  
  toggleSortOrder(): void {
    this.isAscending = !this.isAscending;
    this.detailedDogs = this.sortDogs(this.detailedDogs, this.isAscending);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const inputElement = document.querySelector('.single-select-input input');
    if (inputElement && !inputElement.contains(event.target as Node)) {
      this.showDropdown = false;
      this.filteredBreeds = [...this.allBreeds];
    }
  }

  loadFavorites() {
    const storedFavorites = sessionStorage.getItem('favoriteDogs');
    this.favoriteDogs = storedFavorites ? JSON.parse(storedFavorites) : [];
  }

  isFavorite(dogId: string): boolean {
    return this.favoriteDogs.some((dog) => dog.id === dogId);
  }
  

  toggleFavorite(dog: any) {
    const dogData = { id: dog.id, name: dog.name, img: dog.img }; // Store only necessary data
  
    if (this.isFavorite(dog.id)) {
      this.favoriteDogs = this.favoriteDogs.filter((d) => d.id !== dog.id);
    } else {
      this.favoriteDogs.push(dogData);
    }
  
    sessionStorage.setItem('favoriteDogs', JSON.stringify(this.favoriteDogs));
  }
  

  openFavoritesModal() {
    this.dialog.open(FavoritesModalComponent, {
      data: { favorites: this.favoriteDogs },
    });
  }

}
