import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/interfaces/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { BuscaCEPService } from 'src/app/services/busca-cep.service';
import { async } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.page.html',
  styleUrls: ['./excluir.page.scss'],
})
export class ExcluirPage implements OnInit {
  userVetor: User[] = [];
  segmentChange: String = 'visualizar';
  cep: string = '';

  constructor(
    private fireStore: AngularFirestore,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private toast: ToastService,
    private buscaCEP: BuscaCEPService,
  ) {
    this.getUserData();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  private async getUserData(): Promise<void> {
    //primeira maneira de chamar todos os documentos de uma coleção
    const collectionRef = this.fireStore.collection('users');

    let userBanco = await collectionRef.get().toPromise();

    let users = userBanco?.docs.map((doc) => {
      return doc.data();
    });

    console.log(users);

    //segunda maneira de chamar todos os documentos de uma coleção
    collectionRef.valueChanges().subscribe((data) => {
      this.userVetor = data as User[];
      console.log(this.userVetor);
    });
  }

  async alertExcluirInfo(i: number){
    const alert = await alertController.create({
      header: 'Excluir usuario',
      message: 'Deseja excluir o usuario?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'danger',
          handler: () => {
            console.log('Confirm cancel');
          },
        },
        {
          text: 'Ok',
          handler: () => {
            this.fireStore.collection('users').doc(this.userVetor[i].uid).delete();
            //this.deletarEmail(this.userVetor[i].uid);
          },
        },
      ],
    });
    await alert.present();
  }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}
