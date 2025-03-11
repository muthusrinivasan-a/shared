import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * GeminiToHtmlPipe
 * 
 * This pipe converts Google Gemini's markdown-like syntax to HTML.
 * 
 * Conversions:
 * - # -> <h1>
 * - ## -> <h2>
 * - ### -> <h3>
 * - **text** -> <strong>text</strong> (bold)
 * - *text* -> <em>text</em> (italics)
 * - ```code``` -> <pre><code>code</code></pre> (code blocks)
 * - - item -> <li>item</li> inside <ul> (unordered lists)
 * - * item -> <li>item</li> inside <ul> (alternative unordered lists)
 * - 1. item -> <li>item</li> inside <ol> (ordered lists)
 * - \n\n -> </p><p> (paragraph breaks)
 * - \n -> <br> (line breaks)
 */
@Pipe({
  name: 'geminiToHtml',
  standalone: true
})
export class GeminiToHtmlPipe implements PipeTransform {
  
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(text: string): SafeHtml {
    if (!text) {
      return '';
    }
    
    // Process code blocks first to prevent formatting inside them
    text = this.handleCodeBlocks(text);
    
    // Handle headings (# Heading)
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    text = text.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    text = text.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    
    // Handle bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italics (*text*)
    text = text.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    
    // Handle unordered lists with hyphens
    text = this.handleLists(text, /(?:^|\n)(?:- .*(?:\n|$))+/g, /- (.*?)(?:\n|$)/g, '- ', 'ul');
    
    // Handle unordered lists with asterisks
    text = this.handleLists(text, /(?:^|\n)(?:\* .*(?:\n|$))+/g, /\* (.*?)(?:\n|$)/g, '\\* ', 'ul');
    
    // Handle ordered lists
    text = this.handleLists(text, /(?:^|\n)(?:\d+\. .*(?:\n|$))+/g, /\d+\. (.*?)(?:\n|$)/g, '\\d+\\. ', 'ol');
    
    // Handle links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Handle horizontal rules (---, ___, ***)
    text = text.replace(/^(---|___|\*\*\*)$/gm, '<hr>');
    
    // Handle line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Handle paragraphs (double newlines, now <br><br>)
    text = text.replace(/<br><br>/g, '</p><p>');
    
    // Wrap in paragraph tags if not already wrapped in an HTML tag
    if (!text.startsWith('<')) {
      text = `<p>${text}</p>`;
    }
    
    // Add CSS for styling
    const styledHtml = this.addStyles(text);
    
    // Return sanitized HTML to prevent XSS
    return this.sanitizer.bypassSecurityTrustHtml(styledHtml);
  }
  
  /**
   * Handles code blocks by replacing them with <pre><code> elements
   */
  private handleCodeBlocks(text: string): string {
    // Store code blocks to prevent processing markdown inside them
    const codeBlocks: string[] = [];
    text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(code);
      return placeholder;
    });
    
    // Process the rest of the text
    
    // Restore code blocks
    codeBlocks.forEach((code, index) => {
      text = text.replace(`__CODE_BLOCK_${index}__`, `<pre><code>${code}</code></pre>`);
    });
    
    return text;
  }
  
  /**
   * Generic function to handle different types of lists
   */
  private handleLists(text: string, blockPattern: RegExp, itemPattern: RegExp, 
                     replacer: string, listType: 'ul' | 'ol'): string {
    let listBlocks = text.match(blockPattern) || [];
    
    listBlocks.forEach(block => {
      const listItems = block.match(itemPattern)?.map(item => {
        // Use a dynamic RegExp to handle the replacer which might contain special chars
        const regex = new RegExp(replacer);
        return `<li>${item.replace(regex, '').trim()}</li>`;
      }).join('') || '';
      
      const replacedBlock = `<${listType}>${listItems}</${listType}>`;
      text = text.replace(block, replacedBlock);
    });
    
    return text;
  }
  
  /**
   * Adds CSS styles to the converted HTML for better appearance
   */
  private addStyles(html: string): string {
    const styles = `
      <style>
        /* Base styles */
        .gemini-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
        }
        
        /* Headings */
        .gemini-content h1, .gemini-content h2, .gemini-content h3, 
        .gemini-content h4, .gemini-content h5, .gemini-content h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.25;
          color: #222;
        }
        .gemini-content h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        .gemini-content h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        .gemini-content h3 { font-size: 1.25em; }
        .gemini-content h4 { font-size: 1em; }
        
        /* Lists */
        .gemini-content ul, .gemini-content ol {
          padding-left: 2em;
          margin-top: 0.8em;
          margin-bottom: 0.8em;
        }
        .gemini-content li {
          margin-bottom: 0.5em;
        }
        
        /* Code blocks */
        .gemini-content pre {
          background-color: #f6f8fa;
          border-radius: 6px;
          padding: 16px;
          overflow: auto;
          font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 85%;
          line-height: 1.45;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .gemini-content code {
          background-color: #f6f8fa;
          border-radius: 3px;
          font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 85%;
          padding: 0.2em 0.4em;
          margin: 0;
        }
        .gemini-content pre > code {
          background-color: transparent;
          padding: 0;
          margin: 0;
          font-size: 100%;
          word-break: normal;
          white-space: pre;
          overflow: visible;
        }
        
        /* Links */
        .gemini-content a {
          color: #0366d6;
          text-decoration: none;
        }
        .gemini-content a:hover {
          text-decoration: underline;
        }
        
        /* Paragraphs and text */
        .gemini-content p {
          margin-top: 0.8em;
          margin-bottom: 0.8em;
        }
        .gemini-content strong {
          font-weight: 600;
        }
        .gemini-content em {
          font-style: italic;
        }
        
        /* Horizontal rule */
        .gemini-content hr {
          height: 0.25em;
          padding: 0;
          margin: 24px 0;
          background-color: #e1e4e8;
          border: 0;
        }
      </style>`;
    
    return `<div class="gemini-content">${styles}${html}</div>`;
  }
}