import { Component, ViewChild, OnInit } from '@angular/core';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController, IonModal } from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './add-car.modal.html',
  styleUrls: ['./add-car.modal.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class AddCarModal implements OnInit {
  @ViewChild(IonModal)
  modal!: IonModal;

  formData = {
    brand: '',
    model: '',
    licensePlate: '',
    images: {
      front: null as File | null,
      back: null as File | null,
    },
  };

  constructor(
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() { }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  handleFile(event: Event, position: 'front' | 'back') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.formData.images[position] = input.files[0];
    }
  }

  validateLicense(plate: string): boolean {
    const regex = /^[A-Z0-9-]+$/;
    return regex.test(plate);
  }

  async showToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    toast.present();
  }

  async uploadImage(file: File | null, path: string): Promise<string> {
    if (!file) return '';
    const storage = getStorage();
    const fileRef = ref(storage, path);

    try {
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Erreur lors du téléversement de l\'image :', error);
      return '';
    }
  }

  async onSubmit() {
    if (!this.validateLicense(this.formData.licensePlate)) {
      this.showToast(
        'Numéro de plaque invalide. Veuillez utiliser uniquement des lettres, chiffres et tirets.',
        'danger'
      );
      return;
    }

    const db = getFirestore();
    const uploadedImages: { front: string; back: string } = {
      front: '',
      back: '',
    };

    try {
      for (const position of ['front', 'back'] as const) {
        const image = this.formData.images[position];
        if (image) {
          const filename = `${this.formData.brand}-${this.formData.model}-${this.formData.licensePlate}_${position}`;
          uploadedImages[position] = await this.uploadImage(image, `cars/${filename}`);
        }
      }

      const carCollection = collection(db, 'cars');
      const structuredName = `${this.formData.brand}-${this.formData.model}-${this.formData.licensePlate}`;

      this.showToast('Voiture ajoutée avec succès.', 'success');
      this.cancel();

      await addDoc(carCollection, {
        name: structuredName,
        brand: this.formData.brand,
        model: this.formData.model,
        licensePlate: this.formData.licensePlate,
        photos: uploadedImages,
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture :', error);
      this.showToast('Une erreur est survenue. Veuillez réessayer.', 'danger');
    }
  }
}