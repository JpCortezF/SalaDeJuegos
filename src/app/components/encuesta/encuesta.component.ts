import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent {
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private firestore: Firestore) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,10}$/)]],
      sexo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pregunta1: ['', Validators.required],
      servicio1: [false],
      servicio2: [false],
      satisfaccion: ['', Validators.required],
      terminos: [false, Validators.requiredTrue]
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