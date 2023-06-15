import { Injectable } from '@angular/core';

// Models
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private message: Message | any;
  private observers: ((message: Message) => void)[] = [];

  constructor() {
    this.message = { text: "", type: "" }
  }

  public getMessage() {
    return this.message;
  }

  public setMessage(message: any) {
    this.message = message;
    this.notifyObservers(this.message);
  }

  public clearMessage() {
    this.message = { text: "", type: "" }
    this.notifyObservers(this.message);
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (message: Message) => void) {
    this.observers.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (message: Message) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(message: Message) {
    this.observers.forEach(observer => observer(message));
  }
}
