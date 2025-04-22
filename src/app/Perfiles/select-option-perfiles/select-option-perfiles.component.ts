import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PerfilOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-select-option-perfiles',
  templateUrl: './select-option-perfiles.component.html',
  styleUrls: ['./select-option-perfiles.component.css']
})
export class SelectOptionPerfilesComponent {
  @Input() options: PerfilOption[] = [];
  @Input() selectedValue: number = 0;  // Valor inicial por defecto
  @Output() selectionChange = new EventEmitter<number>();

  onSelectionChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectionChange.emit(value);
  }
}
