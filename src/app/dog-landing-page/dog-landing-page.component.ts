import { Component, HostListener, OnInit } from '@angular/core';
import { FetchServiceService } from '../fetch-service.service'
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

    const size = 100;

    this.apiService.searchDogs(this.selectedBreed, size).subscribe(
      (dogIds) => {
        
        this.apiService.getDetailedDogs(dogIds).subscribe(
          (detailedDogs) => {
            this.detailedDogs = this.sortDogs(detailedDogs, this.isAscending)
            const inputElement = document.querySelector('.landing-page input') as HTMLInputElement;
            inputElement.blur();
            this.detailedDogs = this.filterFavoritedDogs(detailedDogs);
            const zipCodes = [...new Set(this.detailedDogs.map(dog => dog.zip_code))];
            this.apiService.getLocations(zipCodes).subscribe(
              (locations) => {
                
                const locationMap = new Map(
                  locations
                    .filter((loc: any) => loc) 
                    .map((loc: { zip_code: any; }) => [loc.zip_code, loc])
                );
  
                
                this.detailedDogs = this.detailedDogs.map(dog => {
                  const location = locationMap.get(dog.zip_code) as { city?: string; state?: string } | undefined;
                  
                  return {
                    ...dog,
                    city: location?.city ?? null, 
                    state: location?.state ?? null 
                  };
                });
          },
          (error) => console.error('Error fetching detailed dogs:', error)
        );
      },
      (error) => console.error('Error fetching dogs:', error)
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
    const inputElement = document.querySelector('.landing-page input');
    const dropdownElement = document.querySelector('.landing-page .dropdown');
    
    if (
      inputElement && !inputElement.contains(event.target as Node) &&
      dropdownElement && !dropdownElement.contains(event.target as Node)
    ) {
      this.showDropdown = false;
      this.filteredBreeds = [...this.allBreeds];
    }
  }

  onInputClick(): void {
    if (!this.showDropdown) {
      this.showDropdown = true;
    }
  }

  loadFavorites() {
    const accessToken = this.getCookie('fetch-access-token');
    if (accessToken) {
      const storedFavorites = localStorage.getItem(`favoriteDogs-${accessToken}`);
      this.favoriteDogs = storedFavorites ? JSON.parse(storedFavorites) : [];
    } else {
      this.favoriteDogs = [];
    }
  }

  getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  isFavorite(dogId: string): boolean {
    return this.favoriteDogs.some((dog) => dog.id === dogId);
  }

  toggleFavorite(dog: any) {
    const dogData = { id: dog.id, name: dog.name, img: dog.img };

    if (this.isFavorite(dog.id)) {
      this.favoriteDogs = this.favoriteDogs.filter((d) => d.id !== dog.id);
    } else {
      this.favoriteDogs.push(dogData);
    }

    const accessToken = this.getCookie('fetch-access-token');
    if (accessToken) {
      localStorage.setItem(`favoriteDogs-${accessToken}`, JSON.stringify(this.favoriteDogs));
    }

    this.detailedDogs = this.filterFavoritedDogs(this.detailedDogs);
  }

  filterFavoritedDogs(dogs: any[]): any[] {
    return dogs.filter((dog) => !this.isFavorite(dog.id));
  }

  openFavoritesModal() {
    this.dialog.open(FavoritesModalComponent, {
      data: { favorites: this.favoriteDogs },
    });
  }

}
