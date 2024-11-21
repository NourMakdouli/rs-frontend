import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SortingService {
  sortOrder: { [key: string]: 'asc' | 'desc' } = {};

  sortData<T>(field: string, data: T[], allowedFields: string[]): T[] {
    if (!allowedFields.includes(field)) return data; // Safety check

    this.sortOrder[field] = this.sortOrder[field] === 'asc' ? 'desc' : 'asc';

    return data.sort((a, b) => {
      const first = a[field as keyof T];
      const second = b[field as keyof T];

      if (first === null || first === undefined || second === null || second === undefined) {
        return 0; // If either value is null or undefined, consider them equal
      }

      if (first < second) return this.sortOrder[field] === 'asc' ? -1 : 1;
      if (first > second) return this.sortOrder[field] === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
