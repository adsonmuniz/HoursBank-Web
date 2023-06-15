import { Component, OnInit } from '@angular/core';

// Services
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public isLoading: Boolean = true;
  public loading: string = "";
  constructor(private loadingService: LoadingService) {

  }
  ngOnInit(): void {
    // Adiciona um observador para atualizar a propriedade message no componente quando ela for alterada no serviço
    this.loadingService.addObserver((loading: Boolean) => {
      this.isLoading = loading;
    });
    let counter: number = 0;
    setInterval(() => {
      if (counter % 4) {
        this.loading += ".";
      } else {
        this.loading = "";
      }
      counter++;
    }, 300)
  }

}
