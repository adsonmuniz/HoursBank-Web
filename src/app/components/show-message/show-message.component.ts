import { Component, Input, OnInit } from '@angular/core';

// Models
import { Message } from '../../models/message';

// Services
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.scss']
})

export class ShowMessageComponent implements OnInit {
  public message: Message | any;

  constructor(private messageService: MessageService) {
    this.message = { text: "", type: "" };
  }

  ngOnInit(): void {
    // Adiciona um observador para atualizar a propriedade message no componente quando ela for alterada no serviço
    this.messageService.addObserver((message: Message) => {
      this.message = message;

      if (this.message == "") {
        this.clear();
      }
    });
  }

  close() {
    this.clear();
  }

  clear() {
    this.message = {};
  }
}
