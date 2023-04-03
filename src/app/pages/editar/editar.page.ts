import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {
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

  async alertEditarInfo(i: number){
    console.log(this.userVetor[i].nome);
    const alert = await alertController.create({
      header: 'Editar informações do cliente',
      inputs:[
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome',
          value: this.userVetor[i].nome,
        },
        {
          name: 'cpf',
          type: 'text',
          placeholder: 'CPF',
          value: this.userVetor[i].cpf,
        },
      ],
      buttons: [
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
          handler: async(data) => {
            console.log(data);
            this.fireStore.collection('users').doc(this.userVetor[i].uid).update({
              nome: data.nome,
              cpf: data.cpf,
            }
          )}
        },
      ],
  })
  await alert.present();
  };

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
