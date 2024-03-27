// my-button.tsx
import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'my-button',
  styleUrl: 'my-button.css',
  shadow: true,
})
export class MyButton {
  /** The text to display on the button */
  @Prop() text: string;

  /** Whether the button is disabled */
  @Prop() isDisabled: boolean = false;

  /** The type of the button */
  @Prop() type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' = 'primary';

  /** The size of the button (sm, md, lg) */
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  /** Whether the button should be displayed as a block element */
  @Prop() displayBlock: boolean = false;

  /** Event emitted when the button is clicked */
  @Event() buttonClicked: EventEmitter<void>;

  handleClick() {
    if (!this.isDisabled) {
      this.buttonClicked.emit();
    }
  }

  render() {
    const buttonClass = `btn${this.type !== 'link' ? ` btn-${this.type}` : ''} btn-${this.size} ${this.displayBlock ? 'btn-block' : ''}`;
    const Tag = this.type === 'link' ? 'a' : 'button';

    return (
      <Tag
        class={buttonClass}
        disabled={this.isDisabled}
        role="button"
        aria-disabled={this.isDisabled ? 'true' : 'false'}
        onClick={() => this.handleClick()}
      >
        {this.text}
      </Tag>
    );
  }
}
