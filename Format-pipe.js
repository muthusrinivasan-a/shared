import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMarkdown'
})
export class FormatMarkdownPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Convert ## headings to h2
    value = value.replace(/^##\s(.+)$/gm, '<h2>$1</h2>');

    // Convert **bold** text
    value = value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert * list items to <ul><li>
    value = value.replace(/\n\*\s(.+)/g, '<li>$1</li>');

    // Wrap list items inside <ul> tags
    value = value.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    return value;
  }
}
