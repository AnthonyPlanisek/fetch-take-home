import { Component, OnInit } from '@angular/core';
import { FetchServiceService } from '../fetch-service.service'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dog-landing-page',
  templateUrl: './dog-landing-page.component.html',
  styleUrls: ['./dog-landing-page.component.scss']
})
export class DogLandingPageComponent implements OnInit {
  allBreeds: string[] = [];
  filteredBreeds: string[] = [];
  selectedBreeds: string[] = [];
  showDropdown = false;
  searchTerm: string = '';
  matchingDogs: any[] = [];
  detailedDogs: any[] = [];

  constructor(private apiService: FetchServiceService) {}

  ngOnInit(): void {
    this.apiService.getDogBreeds().subscribe({
      next: (response: any) => {
        // If response is a stringified array, we parse it
        try {
          const breeds = Array.isArray(response) ? response : JSON.parse(response);
          console.log('Parsed Breeds:', breeds); // Log parsed data to verify it's an array
          this.allBreeds = breeds;
          this.filteredBreeds = breeds; // Initially show all breeds
        } catch (error) {
          console.error('Error parsing breeds response:', error);
        }
      },
      error: err => {
        console.error('Error fetching dog breeds:', err);
      }
    });
  }

  // Filter breeds as user types
  filterBreeds(): void {
    this.filteredBreeds = this.allBreeds.filter((breed) =>
      breed.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Toggle dropdown visibility when input is clicked
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Select a breed and add to selected list
  selectBreed(breed: string): void {
    if (!this.selectedBreeds.includes(breed)) {
      this.selectedBreeds.push(breed);
    }
    this.searchTerm = ''; // Reset search term after selecting a breed
    this.showDropdown = false; // Hide dropdown after selection
  }

  // Remove a breed from the selected list
  removeBreed(breed: string): void {
    this.selectedBreeds = this.selectedBreeds.filter((b) => b !== breed);
  }

  // Trigger the search and then make the POST request with the search results
  searchDogs(): void {
    const breedsQuery = this.selectedBreeds.join(',');
    this.apiService.searchDogs(breedsQuery).subscribe(
      (dogs) => {
        console.log('Dogs returned from search:', dogs); // Log the search results

        // Make the POST request with the search results
        this.apiService.getDetailedDogs(dogs).subscribe(
          (detailedDogs) => {
            this.detailedDogs = detailedDogs;
            console.log('Detailed dogs returned from POST:', this.detailedDogs); // Log the detailed dogs
          },
          (error) => {
            console.error('Error fetching detailed dogs:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching dogs:', error);
      }
    );
  }
}
