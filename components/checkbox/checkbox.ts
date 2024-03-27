// checkbox-component.tsx

import { Component, EventEmitter, Output, Prop, h } from '@stencil/core';

@Component({
  tag: 'checkbox-component',
  styleUrl: 'checkbox-component.css',
  shadow: true
})
export class CheckboxComponent {
  @Prop() label: string;
  @Prop() value: string;
  @Prop() required: boolean = false;
  @Prop() error: string = '';
  @Output() checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  handleChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.checkedChange.emit(checkbox.checked);
  }

  render() {
    const errorId = this.error ? `${this.value}-error` : null;

    return (
      <div class="form-check">
        <input class="form-check-input" type="checkbox" aria-label={this.label} aria-required={this.required} required={this.required} onChange={this.handleChange.bind(this)} aria-describedby={errorId} />
        <label class="form-check-label">{this.label}</label>
        {this.error && <div class="invalid-feedback" id={errorId}>{this.error}</div>}
      </div>
    );
  }
}
