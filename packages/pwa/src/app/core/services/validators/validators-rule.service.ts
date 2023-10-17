import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { isEmail, isMobile, isPasswordPass, isTelPhone } from '@utils/validate/validate';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsRuleService {
  constructor() {}

  mobileRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isMobile(value) ? null : { message: 'please enter a valid phone number' };
  }

  telPhoneRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isTelPhone(value) ? null : { message: 'Please enter the correct phone number' };
  }

  emailRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isEmail(value) ? null : { message: 'Please enter the correct email format' };
  }

  passwordRule(value: string): ValidationErrors | null {
    if (!value) {
      return null;
    }
    return isPasswordPass(value) ? null : { message: 'Password consists of 6 to 20 uppercase and lowercase letters, numbers or other characters' };
  }
}
