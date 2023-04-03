import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ItemReorderEventDetail } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { User } from 'src/app/interfaces/user';
import { BuscaCEPService } from 'src/app/services/busca-cep.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-visualizar',
  templateUrl: './visualizar.page.html',
  styleUrls: ['./visualizar.page.scss'],
})
export class VisualizarPage implements OnInit {
  userVetor: User[] = [];
  segmentChange: String = 'visualizar';
  cep: string = '';
  
  constructor(private router:Router,
    private fireStore: AngularFirestore,
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private toast: ToastService,
    private buscaCEP: BuscaCEPService,
    ) { this.getUserData(); }

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
    const alert = await alertController.create({
      header: 'Informações do cliente',
      message: `
          <p><b>Nome:</b> ${this.userVetor[i].nome} </p>
          <p><b>CPF:</b> ${this.userVetor[i].cpf} </p>
          <p><b>CEP:</b> ${this.userVetor[i].cep} </p>
          <p><b>Endereço:</b> ${this.userVetor[i].endereco} </p>
          <p><b>Cidade:</b> ${this.userVetor[i].cidade} </p>
          <p><b>E-mail:</b> ${this.userVetor[i].email} </p>
       `,
    buttons: ['Ok'],
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
  
  async alertEditarInfo(i: number){
    console.log(this.userVetor[i].nome);
    const alert = await alertController.create({
      header: 'Informações',
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
            console.log('Confirma');
          },
        },
        {
          text: 'Ok',
          handler: async (data) => {
              console.log(data);
              this.fireStore.collection('users').doc(this.userVetor[i].uid).update({
                nome: data.nome,
                cpf: data.cpf,
              });
          }
        }
      ]
    })
    await alert.present();
  }

  async verificarCEP(cep:string){
    console.log(cep);
    const enderecoColocado = await this.buscaCEP.consultaCEP(cep);
    console.log(enderecoColocado);
  }
  ngOnInit() {
  }

}