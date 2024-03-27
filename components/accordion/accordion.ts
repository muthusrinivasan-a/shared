import { Component, h, Prop, State, Element } from '@stencil/core';

@Component({
  tag: 'bootstrap-accordion',
  styleUrl: 'bootstrap-accordion.css',
  shadow: true
})
export class BootstrapAccordion {
  @Prop() defaultOpen: number = -1; // Index of item to be opened by default (-1 means none)
  @Prop() multiOpen: boolean = false; // Whether multiple items can be opened simultaneously
  @Prop() disabled: boolean = false; // Whether accordion is disabled

  @Element() hostElement: HTMLElement;

  @State() openItems: number[] = []; // Array to store indices of open items

  componentWillLoad() {
    if (this.defaultOpen !== -1) {
      this.openItems = [this.defaultOpen];
    }
  }

  toggleItem(index: number) {
    if (this.disabled) return;
    if (!this.multiOpen) {
      this.openItems = this.openItems[0] === index ? [] : [index];
    } else {
      const itemIndex = this.openItems.indexOf(index);
      if (itemIndex === -1) {
        this.openItems = [...this.openItems, index];
      } else {
        this.openItems.splice(itemIndex, 1);
        this.openItems = [...this.openItems];
      }
    }
  }

  render() {
    return (
      <div class="accordion" role="tablist">
        {Array.from(this.hostElement.children).map((child, index) => {
          if (child.tagName === 'DIV' && child.classList.contains('accordion-item')) {
            return (
              <div
                class={`accordion-item ${this.openItems.includes(index) ? 'open' : ''}`}
                role="presentation"
              >
                {Array.from(child.children).map((innerChild, innerIndex) => {
                  if (innerChild.tagName === 'H2' && innerChild.classList.contains('accordion-header')) {
                    return (
                      <h2 class="accordion-header" role="tab">
                        <button
                          class="accordion-button"
                          type="button"
                          onClick={() => this.toggleItem(index)}
                          aria-expanded={this.openItems.includes(index) ? 'true' : 'false'}
                          aria-controls={`accordion-content-${index}`}
                          disabled={this.disabled}
                        >
                          {innerChild.textContent}
                        </button>
                      </h2>
                    );
                  } else if (innerChild.tagName === 'DIV' && innerChild.classList.contains('accordion-collapse')) {
                    return (
                      <div
                        class="accordion-collapse"
                        role="tabpanel"
                        id={`accordion-content-${index}`}
                        aria-labelledby={`accordion-header-${index}`}
                        style={{ display: this.openItems.includes(index) ? 'block' : 'none' }}
                      >
                        <div class="accordion-body">
                          {innerChild.textContent}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}


<bootstrap-accordion default-open="0" multi-open="true">
  <div class="accordion-item">
    <h2 class="accordion-header">Header 1</h2>
    <div class="accordion-collapse">
      <div class="accordion-body">Content 1</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">Header 2</h2>
    <div class="accordion-collapse">
      <div class="accordion-body">Content 2</div>
    </div>
  </div>
</bootstrap-accordion>

<!-- HTML -->
   <bootstrap-accordion default-open="0" multi-open="true">
    <div class="accordion-item">
      <h2 class="accordion-header">Header 1</h2>
      <div class="accordion-collapse">
        <div class="accordion-body">Content 1</div>
      </div>
    </div>
    <div class="accordion-item">
      <h2 class="accordion-header">Header 2</h2>
      <div class="accordion-collapse">
        <div class="accordion-body">Content 2</div>
      </div>
    </div>
  </bootstrap-accordion>
