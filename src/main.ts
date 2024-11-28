import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { initializeApp } from 'firebase/app'; 
import { provideFirebaseApp, initializeApp as firebaseInitializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { environment } from './environments/environment';

initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    importProvidersFrom(
      IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }),
    ),
    provideIonicAngular(),
    provideFirebaseApp(() => firebaseInitializeApp(environment.firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage()), 
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
