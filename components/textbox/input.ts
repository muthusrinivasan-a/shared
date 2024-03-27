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
  @Prop() isSuccess: boolean; // New property for success state
  @Prop() pattern: string;
  @Prop() sizeVariant: 'large' | 'small' | 'xl' = 'large';
  @Prop() type: 'text' | 'password' = 'text';

  @Event() valueChange: EventEmitter<string>;

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Perform validation based on regex pattern
    if (this.pattern && !new RegExp(this.pattern).test(value)) {
      this.isError = true;
      this.isSuccess = false;
    } else {
      this.isError = false;
      this.isSuccess = true;
      this.valueChange.emit(value);
    }
  }

  render() {
    const inputClass = {
      'form-control': true,
      'is-invalid': this.isError,
      'is-valid': this.isSuccess,
      'form-control-lg': this.sizeVariant === 'large',
      'form-control-sm': this.sizeVariant === 'small',
      'form-control-xl': this.sizeVariant === 'xl',
    };

    return (
      <div class={{ 'form-group': true, 'has-error': this.isError, 'has-success': this.isSuccess }}>
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


/* Angular */
<form-textbox 
  label="Password" 
  id="password" 
  [value]="password" 
  placeholder="Enter your password" 
  [readonly]="false" 
  [disabled]="false" 
  [isError]="isPasswordError" 
  [isSuccess]="isPasswordSuccess" <!-- Use isSuccess property -->
  [pattern]="passwordPattern" 
  sizeVariant="large" 
  type="password" 
  (valueChange)="onPasswordChange($event)"
></form-textbox>

export class MyComponent {
  password: string = '';
  isPasswordError: boolean = false;
  isPasswordSuccess: boolean = false; // Add property for success state
  passwordPattern: string = '^[a-zA-Z0-9]+$';

  onPasswordChange(value: string) {
    this.password = value;
    this.isPasswordError = !new RegExp(this.passwordPattern).test(value);
    this.isPasswordSuccess = !this.isPasswordError; // Update success state
  }

  onSubmit() {
    // Perform form submission logic here
  }
}

/* React */

import React, { useState } from 'react';
import FormTextbox from './FormTextbox';

function App() {
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false); // Add state for success
  const passwordPattern = '^[a-zA-Z0-9]+$';

  const handlePasswordChange = (value) => {
    setPassword(value);
    setIsPasswordError(!new RegExp(passwordPattern).test(value));
    setIsPasswordSuccess(!isPasswordError); // Update success state
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormTextbox 
        label="Password" 
        id="password" 
        value={password} 
        placeholder="Enter your password" 
        readonly={false} 
        disabled={false} 
        isError={isPasswordError} 
        isSuccess={isPasswordSuccess} <!-- Use isSuccess property -->
        pattern={passwordPattern} 
        sizeVariant="large" 
        type="password" 
        onValueChange={handlePasswordChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;

/* HTML */
<form-textbox 
  label="Username" 
  id="username" 
  value="" 
  placeholder="Enter your username" 
  readonly="false" 
  disabled="false" 
  isError="false" 
  isSuccess="false" 
  pattern="^[a-zA-Z0-9]+$" 
  sizeVariant="large" 
  type="text"
></form-textbox>
    
