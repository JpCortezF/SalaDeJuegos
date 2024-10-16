import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit{
  formulario!: FormGroup;
  userEmail: string | null = "";

  constructor(private fb: FormBuilder, private firestore: Firestore, private userService: UserService) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: this.userService.userAuth(),
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,10}$/)]],
      sexo: ['', Validators.required],
      como_llego: ['', Validators.required],
      mejoras: ['', Validators.required],
      favorito: ['', Validators.required],
      nivelSatisfaccion: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      const encuestaData = this.formulario.value;
      const encuestaRef = collection(this.firestore, 'encuestas');
      addDoc(encuestaRef, encuestaData).then(() => {
        console.log('Encuesta guardada en Firebase:', encuestaData);
      }).catch(error => {
        console.error('Error al guardar la encuesta:', error);
      });
    } else {
      this.formulario.markAllAsTouched(); // Muestra todos los errores
    }
  }
}