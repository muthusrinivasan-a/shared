import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'breadcrumb-component',
  styleUrl: 'breadcrumb-component.css',
  shadow: true,
})
export class BreadcrumbComponent {
  @Prop() items: { text: string; url?: string; disabled?: boolean }[]; // Updated prop definition
  @State() activeIndex: number = -1; // State to store the index of the active breadcrumb item

  handleClick(index: number, event: Event) {
    if (this.items[index].disabled) {
      event.preventDefault(); // Prevent navigating if the breadcrumb is disabled
    } else {
      this.activeIndex = index; // Set the active index to highlight the breadcrumb
    }
  }

  render() {
    return (
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          {this.items.map((item, index) => (
            <li
              class={{
                'breadcrumb-item': true,
                'active': index === this.activeIndex,
              }}
              aria-current={index === this.activeIndex ? 'page' : undefined}
              onClick={(event) => this.handleClick(index, event)}
              key={index}
            >
              {item.url ? (
                <a href={item.url} class={{ 'disabled': item.disabled }}>
                  {item.text}
                </a>
              ) : (
                <span class={{ 'disabled': item.disabled }}>{item.text}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
}
