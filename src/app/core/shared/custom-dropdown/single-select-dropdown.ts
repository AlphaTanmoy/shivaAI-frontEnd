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
  selector: 'app-single-select-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-select-dropdown.html',
  styleUrls: ['./single-select-dropdown.scss']
})
export class SingleSelectDropdownComponent {
  private readonly elementRef = inject(ElementRef);

  @Input() label = 'Select Option';
  @Input() placeholder = 'Choose one';
  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: string | null = null;

  @Output() selectionChange = new EventEmitter<string | null>();

  isOpen = false;

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(option => option.value === this.selectedValue);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled) {
      return;
    }

    this.selectedValue = option.value;
    this.selectionChange.emit(this.selectedValue);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isOpen = false;
    }
  }
}
