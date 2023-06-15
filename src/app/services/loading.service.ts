import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading: Boolean = false;
  private observers: ((loading: Boolean) => void)[] = [];

  constructor() { }

  public getLoading() {
    return this.isLoading;
  }

  public setLoading(loading: Boolean) {
    this.isLoading = loading;
    this.notifyObservers(this.isLoading);
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (loading: Boolean) => void) {
    this.observers.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (loading: Boolean) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(loading: Boolean) {
    this.observers.forEach(observer => observer(loading));
  }
}
