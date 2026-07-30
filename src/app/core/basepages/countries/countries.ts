import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  finalize
} from 'rxjs/operators';
import { CountryService } from '../../services/CountryService';
import { CountryResponse } from '../../response/CountryResponse';
import { SingleSelectDropdownComponent } from '../../shared/custom-dropdown/single-select-dropdown';


@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SingleSelectDropdownComponent
  ],
  templateUrl: './countries.html',
  styleUrls: ['./countries.scss']
})
export class CountryComponent
  implements OnInit, AfterViewInit, OnDestroy {

  private readonly countryService = inject(CountryService);

  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollAnchor')
  scrollAnchor!: ElementRef<HTMLDivElement>;

  countries: CountryResponse[] = [];

  searchText = '';

  serviceable?: boolean;

  selectedServiceableValue: string | null = '';

  readonly serviceableOptions = [
    {
      label: 'All Countries',
      value: ''
    },
    {
      label: 'Serviceable',
      value: 'true'
    },
    {
      label: 'Non Serviceable',
      value: 'false'
    }
  ];

  readonly pageSize = 20;

  loading = false;

  hasMore = true;

  offsetToken = '';

  totalRecords = 0;

  errorMessage = '';

  private observer?: IntersectionObserver;

  private ignoreFirstIntersection = true;

  private readonly searchSubject =
    new Subject<string>();

  ngOnInit(): void {

    this.initializeSearch();

    this.loadCountries(true);

  }

  ngAfterViewInit(): void {

    this.initializeIntersectionObserver();

  }

  ngOnDestroy(): void {

    this.observer?.disconnect();

    this.searchSubject.complete();

  }

  /**
   * Search
   */
  onSearchChange(): void {

    this.searchSubject.next(this.searchText);

  }

  /**
   * Serviceable Filter
   */
  onServiceableChange(value: string | null): void {

    this.selectedServiceableValue = value;

    if (value === '' || value === null) {

      this.serviceable = undefined;

    } else {

      this.serviceable = value === 'true';

    }

    this.loadCountries(true);

  }

  /**
   * Main Loader
   */
  loadCountries(reset: boolean = false): void {

    if (this.loading) {
      return;
    }

    if (!this.hasMore && !reset) {
      return;
    }

    if (reset) {

      this.countries = [];

      this.offsetToken = '';

      this.hasMore = true;

      this.errorMessage = '';

    }

    this.loading = true;

    this.countryService
      .getCountries(
        this.searchText,
        this.pageSize,
        this.offsetToken,
        this.serviceable
      )
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({

        next: (response) => {

          const responseData = response.data ?? [];

          if (reset) {
            this.countries = responseData;
          } else {
            this.countries.push(...responseData);
          }

          this.offsetToken = response.offsetToken ?? '';

          this.totalRecords = response.recordCount ?? 0;

          this.hasMore =
            this.offsetToken.trim().length > 0 &&
            responseData.length >= this.pageSize;

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: () => {

          this.errorMessage =
            'Unable to load countries.';

          this.cdr.detectChanges();

        }

      });

  }

  /**
   * Retry Button
   */
  retry(): void {

    this.loadCountries(false);

  }

  /**
   * Search Debounce
   */
  private initializeSearch(): void {

    this.searchSubject
      .pipe(

        debounceTime(400),

        distinctUntilChanged()

      )
      .subscribe(() => {

        this.loadCountries(true);

      });

  }

  /**
   * Infinite Scroll
   */
  private initializeIntersectionObserver(): void {

    this.observer = new IntersectionObserver(entries => {

      const entry = entries[0];

      if (!entry.isIntersecting) {
        return;
      }

      // Ignore the first automatic trigger
      if (this.ignoreFirstIntersection) {
        this.ignoreFirstIntersection = false;
        return;
      }

      if (this.loading || !this.hasMore) {
        return;
      }

      this.loadCountries();

    }, {
      root: null,
      threshold: 0.1
    });

    this.observer.observe(this.scrollAnchor.nativeElement);

  }

}