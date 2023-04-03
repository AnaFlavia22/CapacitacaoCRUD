//import { ToastService } from './../../services/toast.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/interfaces/user';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { BuscaCEPService } from 'src/app/services/busca-cep.service';
import { async } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
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

  async alertVisualizarInfo(i: number){
    console.log(this.userVetor[i].nome);
  }

  async alertEditarInfo(i: number){
    console.log(this.userVetor[i].nome);
    const alert = await alertController.create({
      header: this.userVetor[i].nome,
      subHeader: "Informações",
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
        },
      ],
  })};

  async alertExcluirInfo(i: number){
    const alert = await alertController.create({
      header: 'Excluir usuario',
      message: 'Deseja excluir o usuario $(this.userVetor[i].',
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

  async verificarCEP(cep:string){
    console.log(cep);
    const enderecoColocado = await this.buscaCEP.consultaCEP(cep);
    console.log(enderecoColocado);
  }


}
