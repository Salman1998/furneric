import { Injectable } from "@angular/core";
import { collection, collectionData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DataService {
    constructor(private firestore: Firestore) {}

     // Get list of users
    getCategories(): Observable<any[]> {
      const categoriesRef = collection(this.firestore, 'categories');
      return collectionData(categoriesRef, { idField: 'id' }) as Observable<any[]>;
    }

}