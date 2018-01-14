import {Component} from '@angular/core';
import {StompService} from 'ng2-stomp-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connected = false;
  messages: Array<any> = [];
  subscription: Subscription = null;

  logs = [];

  constructor(private stomp: StompService) {
    this.stomp.config = {host: 'http://localhost:8090/websocket-endpoint'};
    stomp.configure(this.stomp.config);
  }

  connect() {
    this.stomp.startConnect().then(() => {
      this.connected = true;
      this.log('connected');
      setTimeout(() => {
        console.log('subscribing');
        this.subscription =
          this.stomp.subscribe('/topic/greetings',
            (data) => {
              this.messages.push(data);
            }
          );
      }, 500);
    });
  }

  disconnect() {
    this.subscription.unsubscribe();
    this.stomp.disconnect().then(() => {
      this.log('disconnected');
      this.connected = false;
    });
  }

  send(text: string) {
    this.stomp.send('/app/hello', {'text': text, 'author': 'AlexZahv'});
  }

  log(message: string) {
    this.logs.push(message);
  }
}
