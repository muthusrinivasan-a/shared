import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from './dropdown-item';

interface DropdownItem {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss']
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() items: DropdownItem[] = [];
  @Input() showSearch: boolean = true;
  @Input() defaultSelected: DropdownItem[] = [];
  @Output() selectedItemsChange = new EventEmitter<DropdownItem[]>();

  filteredItems: DropdownItem[] = [];
  isDropdownOpen: boolean = false;
  isDropdownTop: boolean = false;
  selectedItems: Set<number | string> = new Set();

  constructor() {}

  ngOnInit(): void {
    this.filteredItems = [...this.items];
    this.defaultSelected.forEach(item => this.selectedItems.add(item.id));
    this.emitSelectedItems();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.checkDropdownPosition();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }

  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
  }

  onItemSelect(event: any, item: DropdownItem) {
    if (event.target.checked) {
      this.selectedItems.add(item.id);
    } else {
      this.selectedItems.delete(item.id);
    }
    this.emitSelectedItems();
  }

  emitSelectedItems() {
    const selectedItemsArray = this.items.filter(item => this.selectedItems.has(item.id));
    this.selectedItemsChange.emit(selectedItemsArray);
  }

  checkDropdownPosition() {
    const dropdownRect = document.querySelector('.dropdown')?.getBoundingClientRect();
    this.isDropdownTop = dropdownRect ? window.innerHeight - dropdownRect.bottom < 200 : false;
  }
}

/* 

import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showSidebar: boolean = true;

  constructor() {
    this.checkScreenSize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize((event.target as Window).innerWidth);
  }

  private checkScreenSize(width: number) {
    this.showSidebar = width >= 1300;
  }
}

/* OLD */
/* import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

interface DropdownItem {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css']
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() items: DropdownItem[] = [];
  @Input() showSearch: boolean = true;
  @Input() maxHeight: string = '300px'; // Default max height
  @Output() selectedItemsChange = new EventEmitter<DropdownItem[]>();

  filteredItems: DropdownItem[] = [];
  isDropdownOpen: boolean = false;
  isDropdownTop: boolean = false;
  selectedItems: Set<number | string> = new Set();

  constructor() { }

  ngOnInit(): void {
    this.filteredItems = [...this.items];
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.checkDropdownPosition();
  }

  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(query));
  }

  onItemSelect(event: any, item: DropdownItem) {
    if (event.target.checked) {
      this.selectedItems.add(item.id);
    } else {
      this.selectedItems.delete(item.id);
    }
    this.emitSelectedItems();
  }

  emitSelectedItems() {
    const selectedItemsArray = this.items.filter(item => this.selectedItems.has(item.id));
    this.selectedItemsChange.emit(selectedItemsArray);
  }

  trackByFn(index: any, item: DropdownItem) {
    return item.id; // or index
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkDropdownPosition();
  }

  checkDropdownPosition() {
    const dropdownRect = document.querySelector('.dropdown')?.getBoundingClientRect();
    this.isDropdownTop = dropdownRect ? window.innerHeight - dropdownRect.bottom < 200 : false;
  }
} */
