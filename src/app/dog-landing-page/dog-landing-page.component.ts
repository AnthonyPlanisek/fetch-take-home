import { Component, HostListener, OnInit } from '@angular/core';
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
  selectedBreed: string | null = null;
  showDropdown = false;
  searchTerm: string = '';
  detailedDogs: any[] = [];

  constructor(private apiService: FetchServiceService) {}

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
        console.log('Dog IDs returned from search:', dogIds);
        
        this.apiService.getDetailedDogs(dogIds).subscribe(
          (detailedDogs) => {
            this.detailedDogs = detailedDogs;
            console.log('Detailed dogs:', this.detailedDogs);
          },
          (error) => console.error('Error fetching detailed dogs:', error)
        );
      },
      (error) => console.error('Error fetching dogs:', error)
    );
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    const inputElement = document.querySelector('.single-select-input input');
    if (inputElement && !inputElement.contains(event.target as Node)) {
      this.showDropdown = false;
      this.filteredBreeds = [...this.allBreeds];
    }
  }

}
