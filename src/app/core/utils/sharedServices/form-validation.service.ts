import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  requiredField(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value ? null : { required: true };
    };
  }

  
  minLength(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length >= length
        ? null
        : { minLength: { requiredLength: length } };
    };
  }

futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion
    return selectedDate >= today ? null : { futureDate: true };
  };
}


startDateBeforeEndDateValidator(startDateField: string, endDateField: string) {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const startDateControl = formGroup.controls[startDateField];
    const endDateControl = formGroup.controls[endDateField];

    if (!startDateControl || !endDateControl) {
      return null;
    }

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(endDateControl.value);

    if (startDate && endDate && startDate > endDate) {
      endDateControl.setErrors({ startDateAfterEndDate: true });
      return { startDateAfterEndDate: true };
    } else {
      if (endDateControl.errors) {
        delete endDateControl.errors['startDateAfterEndDate'];
        if (Object.keys(endDateControl.errors).length === 0) {
          endDateControl.setErrors(null);
        }
      }
      return null;
    }
  };
}





  expirationDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || value.length !== 4) {
        return { invalidExpiration: true }; 
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; 
      const inputMonth = parseInt(value.substring(0, 2), 10);
      const inputYear = parseInt(`20${value.substring(2, 4)}`, 10); 

      if (inputMonth < 1 || inputMonth > 12) {
        return { invalidExpiration: true };
      }

      if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
        return { expired: true }; 
      }

      return null; 
    };
  }
  emailFormat(): ValidatorFn {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return (control: AbstractControl): ValidationErrors | null => {
      return emailRegex.test(control.value) ? null : { emailFormat: true };
    };
  }

  pattern(pattern: string | RegExp): ValidatorFn {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    return (control: AbstractControl): ValidationErrors | null => {
      return regex.test(control.value) ? null : { pattern: true };
    };
  }


   validateBirthday() {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      const selectedDate = new Date(control.value);
      return selectedDate > today ? { futureDate: true } : null;
    };
  }


  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['passwordMismatch']) {
        return null; 
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPassControl.setErrors(null); 
      }

      return null;
    };
  }

  minimumImagesRequired(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      return formArray && formArray.length >= min
        ? null
        : { minimumImagesRequired: { required: min } };
    };
  }
positiveFloatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value > 0 && !isNaN(value) && value % 1 !== 0 ? null : { positiveFloat: true };
  };
}


positiveNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value > 0 && !isNaN(value) ? null : { positiveNumber: true };
  };
}
salaryRangeValidator(minField: string, maxField: string) {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const minControl = formGroup.controls[minField];
    const maxControl = formGroup.controls[maxField];

    if (minControl.value !== null && maxControl.value !== null && minControl.value > maxControl.value) {
      maxControl.setErrors({ salaryRangeInvalid: true });
      return { salaryRangeInvalid: true };
    } else {
      maxControl.setErrors(null);
      return null;
    }
  };
}
}
