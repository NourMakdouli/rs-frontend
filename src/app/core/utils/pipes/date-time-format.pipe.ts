import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  transform(value: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const day = days[value.getDay()];
    const date = value.getDate();
    const hour = this.pad(value.getHours());
    const minute = this.pad(value.getMinutes());
    const second = this.pad(value.getSeconds());
    
    const suffixIndex = (date % 10 <= 3 && Math.floor(date / 10) !== 1) ? date % 10 : 0;
    const suffix = suffixes[suffixIndex] || suffixes[0];
    
    return `${day} ${date}${suffix}, ${hour}:${minute}:${second}`;
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
