import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  template: `
    {{ currentDate | dateTimeFormat }}
  `,
})
export class ClockComponent implements OnInit {
  currentDate: Date;

  constructor() { 
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }
}
