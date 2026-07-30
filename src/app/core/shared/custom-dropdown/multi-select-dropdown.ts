import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  inject
} from '@angular/core';

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multi-select-dropdown.html',
  styleUrls: ['./multi-select-dropdown.scss']
})
export class MultiSelectDropdownComponent {
  private readonly elementRef = inject(ElementRef);

  @Input() label = 'Select Options';
  @Input() placeholder = 'Choose values';
  @Input() options: DropdownOption[] = [];
  @Input() selectedValues: string[] = [];

  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = false;

  get selectedLabels(): string {
    const selected = this.options.filter(option => this.selectedValues.includes(option.value));
    return selected.length ? selected.map(option => option.label).join(', ') : this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  toggleOption(option: DropdownOption): void {
    if (option.disabled) {
      return;
    }

    const exists = this.selectedValues.includes(option.value);

    if (exists) {
      this.selectedValues = this.selectedValues.filter(value => value !== option.value);
    } else {
      this.selectedValues = [...this.selectedValues, option.value];
    }

    this.selectionChange.emit([...this.selectedValues]);
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isOpen = false;
    }
  }
}
