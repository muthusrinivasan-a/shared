// form-textbox.tsx
import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'form-textbox',
  styleUrl: 'form-textbox.css',
  shadow: true,
})
export class FormTextbox {
  @Prop() label: string;
  @Prop() id: string;
  @Prop() value: string;
  @Prop() placeholder: string;
  @Prop() readonly: boolean;
  @Prop() disabled: boolean;
  @Prop() isError: boolean;
  @Prop() pattern: string;
  @Prop() sizeVariant: 'large' | 'small' | 'xl' = 'large';
  @Prop() type: 'text' | 'password' = 'text'; // New property for input type

  @Event() valueChange: EventEmitter<string>;

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Perform validation based on regex pattern
    if (this.pattern && !new RegExp(this.pattern).test(value)) {
      this.isError = true;
    } else {
      this.isError = false;
      this.valueChange.emit(value);
    }
  }

  render() {
    const inputClass = {
      'form-control': true,
      'is-invalid': this.isError,
      'form-control-lg': this.sizeVariant === 'large',
      'form-control-sm': this.sizeVariant === 'small',
      'form-control-xl': this.sizeVariant === 'xl',
    };

    return (
      <div class={{ 'form-group': true, 'has-error': this.isError }}>
        <label htmlFor={this.id}>{this.label}</label>
        <input 
          type={this.type} 
          class={inputClass} 
          id={this.id} 
          aria-describedby={`${this.id}-error`} 
          value={this.value}
          placeholder={this.placeholder}
          readonly={this.readonly}
          disabled={this.disabled}
          onInput={(event: Event) => this.handleChange(event)}
        />
        {this.isError && <div class="invalid-feedback" id={`${this.id}-error`} aria-live="assertive">Invalid input</div>}
      </div>
    );
  }
}
