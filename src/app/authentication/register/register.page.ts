import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from "@ionic/angular";
import { CommonModule } from '@angular/common';
import { AuthenticationService, IUser } from '../../services/authentication/auth.service';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterPage implements OnInit {

  public registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\+?\d{1,3}[- ]?)?(\d{1,3} ?){3,4}$/),
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  goToLogin() {
    this.router.navigate(['login']);
  }

  private validateSignUpForm(): boolean {
    this.errorMessage = '';

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return false;
    }

    if (this.registerForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return false;
    }

    return true;
  }

  async signUp(): Promise<void> {

    const isValid = this.validateSignUpForm();
    if (!isValid) {
      return;
    }

    try {
      const isRegistered = await this.authService.signUpWithEmailAndPassword(this.registerForm.value as unknown as IUser);
      if (isRegistered) {
        this.presentToast('Inscription réussie !', 'success');
        this.goToLogin();
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        this.presentToast('Cet email est déjà utilisé.', 'warning');
        return;
      }
      this.presentToast('Échec de l\'inscription. Veuillez vérifier les informations saisies.', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      color: color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    const errors: { [key: string]: string | (() => string) } = {
      required: 'Ce champ est requis.',
      minlength: () => `Minimum ${control?.getError('minlength')?.requiredLength} caractères requis.`,
      email: 'Adresse email invalide.',
      pattern: 'Format invalide.',
    };

    const errorKey = Object.keys(errors).find(key => control?.hasError(key));
    if (errorKey) {
      const error = errors[errorKey];
      return typeof error === 'function' ? error() : error;
    }
    return '';
  }
}
