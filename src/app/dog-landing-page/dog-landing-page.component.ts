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
        
        try {
          const breeds = Array.isArray(response) ? response : JSON.parse(response);
          console.log('Parsed Breeds:', breeds); 
          this.allBreeds = breeds;
          this.filteredBreeds = breeds; 
        } catch (error) {
          console.error('Error parsing breeds response:', error);
        }
      },
      error: err => {
        console.error('Error fetching dog breeds:', err);
      }
    });
  }

  
  filterBreeds(): void {
    this.filteredBreeds = this.allBreeds.filter((breed) =>
      breed.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  
  selectBreed(breed: string): void {
    if (!this.selectedBreeds.includes(breed)) {
      this.selectedBreeds.push(breed);
    }
    this.searchTerm = ''; 
    this.showDropdown = false; 
  }

  removeBreed(breed: string): void {
    this.selectedBreeds = this.selectedBreeds.filter((b) => b !== breed);
  }

  // Grabs IDs of dogs from search then grabs dogs from their IDs
  searchDogs(): void {
    const breedsQuery = this.selectedBreeds.join(',');
    this.apiService.searchDogs(breedsQuery).subscribe(
      (dogs) => {
        console.log('Dogs returned from search:', dogs); 

        
        this.apiService.getDetailedDogs(dogs).subscribe(
          (detailedDogs) => {
            this.detailedDogs = detailedDogs;
            console.log('Detailed dogs returned from POST:', this.detailedDogs);
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
