import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AddCarModal } from '../add-modal/add-car.modal';

@Component({
  selector: 'app-car-list',
  templateUrl: './cars-list.page.html',
  styleUrls: ['./cars-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarsListPage implements OnInit {
  carImages: { name: string; url: string }[] = [];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  getCarDetail(name: string, detail: 'brand' | 'model' | 'licensePlate'): string {
    const parts = name.split('-');
    switch (detail) {
      case 'brand': return parts[0] || 'Inconnu';
      case 'model': return parts[1] || 'Inconnu';
      case 'licensePlate': return parts[2]?.split('_')[0] || 'Inconnu';
      default: return 'Inconnu';
    }
  }

  async ngOnInit() {
    await this.loadCarImages();
  }

  async openAddCarModal() {
    const modal = await this.modalCtrl.create({
      component: AddCarModal,
    });
    return await modal.present();
  }

  async loadCarImages() {
    const storage = getStorage();
    const carsRef = ref(storage, 'cars');

    listAll(carsRef)
      .then(result => {
        return Promise.all(
          result.items.map(itemRef =>
            getDownloadURL(itemRef).then(url => ({
              name: itemRef.name,
              url: url,
            }))
          )
        );
      })
      .then(carImages => {
        this.carImages = carImages;
      })
      .catch(error => {
        console.error('Erreur lors du chargement des images :', error);
      });
  }

  async deleteCar(carName: string) {
    const storage = getStorage();
    const carRef = ref(storage, `cars/${carName}`);

    deleteObject(carRef)
      .then(() => {
        this.carImages = this.carImages.filter(car => car.name !== carName);
        this.showToast('Voiture supprimée avec succès.', 'success');
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la voiture :', error);
        this.showToast('Une erreur est survenue lors de la suppression.', 'danger');
      });
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
}
