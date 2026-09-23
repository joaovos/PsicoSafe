import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PsicoSafeValidators {
  
  static noSequentialChars(maxAllowedSequence = 3): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null;

      let ascSeqCount = 1;
      let descSeqCount = 1;

      for (let i = 0; i < value.length - 1; i++) {
        const curr = value.charCodeAt(i);
        const next = value.charCodeAt(i + 1);

        if (next === curr + 1) {
          ascSeqCount++;
          if (ascSeqCount >= maxAllowedSequence) {
            return { sequentialChars: true };
          }
        } else {
          ascSeqCount = 1;
        }

        if (next === curr - 1) {
          descSeqCount++;
          if (descSeqCount >= maxAllowedSequence) {
            return { sequentialChars: true };
          }
        } else {
          descSeqCount = 1;
        }
      }

      return null;
    };
  }

  static crpFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null;

      const crpPattern = /^\d{2}\/\d{5}$/;

      if (!crpPattern.test(value)) {
        return { invalidCrpFormat: true };
      }

      return null;
    };
  }

  static emailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null; 

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailPattern.test(value)) {
        return { invalidEmailFormat: true };
      }

      return null; 
    };
}

  static phoneFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null;

      const phonePattern = /^\d{11}$/;

      return phonePattern.test(value) ? null : { invalidPhoneFormat: true };
    };
  }

  static dateNotInPast(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;
      if (!value) return null;

      const today = new Date().toISOString().split('T')[0];

      return value >= today ? null : { pastDate: true };
    };
  }
};