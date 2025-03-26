import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: 'beautify'
})
export class BeautifyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Replace line breaks
    value = value.replace(/\\n/g, '\n');

    // Replace headings
    value = value.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    value = value.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    value = value.replace(/^# (.*)$/gm, '<h1>$1</h1>');

    // Replace bold
    value = value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Replace italic
    value = value.replace(/_(.*?)_/g, '<em>$1</em>');

    // Replace line breaks with <br>
    value = value.replace(/\n/g, '<br>');

    // Replace unordered list (basic handling)
    value = value.replace(/(?:^|\n)([-*]) (.*)/g, '<ul><li>$2</li></ul>');
    
    // Collapse multiple <ul> into one
    value = value.replace(/<\/ul>\s*<ul>/g, '');

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
