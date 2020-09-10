import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  closeResult = '';

  parqueForm = FormGroup;

  idFirabaseActualizar: string;
  actualizar: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
  ) { }

  config: any;
  collection = { count: 0, data: [] }

  ngOnInit(): void {

    this.idFirabaseActualizar = "";
    this.actualizar = false;

    //configuracion para la paginación
    this.config = {
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: this.collection.data.length
    };

    //inicializando formulario para guardar los parques
    this.parqueForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      superficie: ['', Validators.required],
      declaracion: ['', Validators.required]
    })

    //cargando todos los parques de firebase
    this.firebaseServiceService.getParques().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          id: e.payload.doc.data().id,
          nombre: e.payload.doc.data().nombre,
          superficie: e.payload.doc.data().superficie,
          declaracion: e.payload.doc.data().declaracion,
          idFirebase: e.payload.doc.id
        }
      })
    },
      error => {
        console.error(error);
      }
    );

  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.firebaseServiceService.deleteParque(item.idFirebase);
  }

  guardarParque(): void {
    this.firebaseServiceService.createParque(this.parqueForm.value).then(resp => {

      this.parqueForm.reset();
      this.modalService.dismissAll();

    }).catch(error => {
      console.error(error)
    })
  }

  openEditar(content, item: any) {

    //llenar form para editar
    this.parqueForm.setValue({
      id: item.id,
      nombre: item.nombre,
      superficie: item.superficie,
      declaracion: item.declaracion
    });
    this.idFirabaseActualizar = item.idFirebase;
    this.actualizar = true;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  actualizarParque() {
    if (!isNullOrUndefined(this.idFirabaseActualizar)) {
      this.firebaseServiceService.updateParque(this.idFirabaseActualizar, this.parqueForm.value).then(resp => {
        this.parqueForm.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });
    }
  }

  open(content) {
    this.actualizar = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
