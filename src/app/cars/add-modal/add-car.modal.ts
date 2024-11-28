import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from "@ionic/angular";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-create',
  templateUrl: './add-car.modal.html',
  styleUrls: ['./add-car.modal.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddCarModal implements OnInit {
  carData = {
    brand: '',
    model: '',
    licensePlate: '',
    photos: {
      front: null as File | null,
      back: null as File | null
    }
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onFileSelected(event: Event, type: 'front' | 'back') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.carData.photos[type] = input.files[0];
    }
  }

  async onSubmit() {
    const db = getFirestore();
    const storage = getStorage();

    try {
      const photoUrls: { front: string; back: string } = {
        front: '',
        back: ''
      };

      for (const type of ['front', 'back'] as const) {
        const photo = this.carData.photos[type];
        if (photo) {
          const storageRef = ref(storage, `cars/${this.carData.licensePlate}_${type}`);
          await uploadBytes(storageRef, photo);
          const downloadUrl = await getDownloadURL(storageRef);
          photoUrls[type] = downloadUrl;
        }
      }

      const carCollection = collection(db, 'cars');
      await addDoc(carCollection, {
        brand: this.carData.brand,
        model: this.carData.model,
        licensePlate: this.carData.licensePlate,
        photos: photoUrls
      });

      alert('Voiture ajoutée avec succès !');
      this.dismiss();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
}
