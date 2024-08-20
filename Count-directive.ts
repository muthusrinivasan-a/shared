import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimateNumber]'
})
export class AnimateNumberDirective implements OnInit {

  @Input() startValue = 0;
  @Input() endValue = 100;
  @Input() duration = 1000; // duration in milliseconds

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.animateNumber();
  }

  private animateNumber() {
    const start = this.startValue;
    const end = this.endValue;
    const duration = this.duration;
    const element = this.el.nativeElement;

    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const currentValue = Math.min(start + (end - start) * (progress / duration), end);
      element.innerText = Math.floor(currentValue).toString();
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        element.innerText = end.toString(); // Ensure the final value is correct
      }
    };

    requestAnimationFrame(step);
  }
}
