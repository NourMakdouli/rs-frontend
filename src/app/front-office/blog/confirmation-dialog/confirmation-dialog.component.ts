// confirmation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <h1 mat-dialog-title>Confirm</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onSave()">Save as Draft</button>
      <button mat-button (click)="onLeave()">Leave Without Saving</button>
      <button mat-button (click)="onCancel()">Cancel</button>
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 1rem;
    }
    div[mat-dialog-actions] {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave(): void {
    this.dialogRef.close('save');
  }

  onLeave(): void {
    this.dialogRef.close('leave');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
