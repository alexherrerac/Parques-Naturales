import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   *  listar todos los parques
   */
  getParques(){
    return this.firestore.collection("parques").snapshotChanges();
  }

  /**
   * crear un parque en firebase
   * @param estudiante 
   */
  createParque(parque:any){
    return this.firestore.collection("parques").add(parque);
  }

  /**
   * actualiza un dato existente en firebase
   * @param id id de la coleccion en firebase
   * @param estudiante estudiante a actualizar
   */
  updateParque(id:any, parque:any){
    return this.firestore.collection("parques").doc(id).update(parque);
  }


  /**
   * borrar un dato existente en firebase
   * @param id id de la coleccion en firebase
   */
  deleteParque(id:any){
    return this.firestore.collection("parques").doc(id).delete();

  }


}
