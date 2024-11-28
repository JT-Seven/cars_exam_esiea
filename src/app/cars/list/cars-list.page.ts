import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddCarModal } from '../add-modal/add-car.modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-list',
  templateUrl: './cars-list.page.html',
  styleUrls: ['./cars-list.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarsListPage implements OnInit {
  carImages: { name: string; url: string }[] = [];

  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) { }

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

    const result = await listAll(carsRef);

    this.carImages = await Promise.all(
      result.items.map(async (itemRef) => ({
        name: itemRef.name,
        url: await getDownloadURL(itemRef),
      }))
    );
  }

  getCarDetail(name: string, detail: 'brand' | 'model' | 'licensePlate'): string {
    const parts = name.split('-');
    switch (detail) {
      case 'brand': return parts[0] || 'Inconnu';
      case 'model': return parts[1] || 'Inconnu';
      case 'licensePlate': return parts[2]?.split('_')[0] || 'Inconnu';
      default: return 'Inconnu';
    }
  }
}
