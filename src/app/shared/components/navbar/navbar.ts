import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.scss'
})
export class NavbarComponent {

    isScrolled = false;

    @HostListener('window:scroll')
    onScroll(): void {
        this.isScrolled = window.scrollY > 20;
    }

}