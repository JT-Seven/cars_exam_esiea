import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';

export interface IUser {
  username: string;
  email: string;
  password: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }

  public signUpWithEmailAndPassword(user: IUser): Promise<boolean | unknown> {
    const database = getDatabase();

    return new Promise((resolve, reject) => {

      createUserWithEmailAndPassword(getAuth(), user.email, user.password)
        .then((userCreated: UserCredential) => {
          set(ref(database, 'users/' + userCreated.user.uid), {
            email: user.email,
            username: user.username,
            phone: user.phone,
          }).then(() => resolve(true))
            .catch((error) => reject(error));

        }).catch((error) =>
          reject(error));
    });
  }

  public signInWithEmailAndPassword(user: Partial<IUser>): Promise<UserCredential> {
    return signInWithEmailAndPassword(getAuth(), user.email as string, user.password as string);
  }
}
