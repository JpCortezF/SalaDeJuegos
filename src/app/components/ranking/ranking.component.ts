import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { collection, collectionData, Firestore, orderBy, limit, query } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent implements OnInit, OnDestroy{
  rankingData: any[] = [];
  currentGame: string = '';
  private sub: Subscription = new Subscription();

  constructor(private firestore: Firestore) { }

  ngOnInit() {
    this.loadRanking('listado_deftionary');
  }

  loadRanking(collectionName: string) {
    this.currentGame = collectionName.replace('listado_', '').replace('-', ' ').toUpperCase();
    this.GetData(collectionName);
  }

  async GetData(collectionName: string) {
    const col = collection(this.firestore, collectionName);
    const q = query(col, orderBy('score', 'desc'), limit(5));

    const observable = collectionData(q);
    this.sub.unsubscribe(); // Nos aseguramos de cancelar suscripciones anteriores
    this.sub = observable.subscribe((data: any) => {
      this.rankingData = data; // Guardamos los datos del ranking
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe(); // Limpiamos la suscripción cuando el componente se destruye
    }
  }

  FormatDate(date: any): string {
    if (date && date.toDate) {
      const d = date.toDate();
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    return '';
  }
}
