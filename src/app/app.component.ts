import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public signUpForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
    email: ['', [Validators.required, Validators.email]],
    type: ['', Validators.required],
    password: ['', [
      Validators.required, 
      Validators.minLength(5), 
      Validators.maxLength(24),
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)]]
  });

  public isSubmitting: boolean = false;

  constructor(private fb: FormBuilder) {}

  // CODE HERE
  //
  // I want to be able to create a new user for the application. Implement a reactive form that I can submit
  //
  // Form:
  // - username (required, min 3, max 24 characters)
  // - email (required, valid email address)
  // - type (required, select dropdown with either 'user' or 'admin')
  // - password (required, min 5, max 24 characters, upper and lower case, at least one special character)
  //
  // Requirements:
  // The form should submit a valid UserDto object (call createUser() function)
  // The submit button should be disabled if the form is invalid
  // The submit button should be disabled while the submit request is pending
  // If the request fails the button must become submittable again (error message must not be displayed)
  // Errors should be displayed under each input if not valid
  //
  // Futher Notes:
  // Styling is not important, use default HTML elements (no angular material or bootstrap)

  async registerUser(): Promise<void> {
    if (this.signUpForm.invalid) return;
    
    const formValue = this.signUpForm.getRawValue();

    this.isSubmitting = true;

    try {
      await this.createUser(formValue);

      // redirect to home page or dashboard

      this.signUpForm.reset();
    } catch (error) {
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private async createUser(user: UserDto) {
    await new Promise((res) => setTimeout(res, 2500));

    if (Math.random() < 0.5) {
      return Promise.reject('Request Failed');
    }
    // Backend call happening here.
    return { username: user.username, email: user.email, type: user.type };
  }
}
