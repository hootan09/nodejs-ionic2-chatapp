import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private ws;
  private onmessage;

  public username;
  public message; // Message field model
  public chatMessages: Array<Object> = new Array(); // Main messages array

  constructor(public navCtrl: NavController) {
    // Setting receive message callback
    this.onMessage(e => {
      this.delegateData(e); // Decide how to process message
    })
    this.connect(); // Connect WebSocket
  }

    delegateData(e) {
    let data = JSON.parse(e.data); // Parsing data

    if(data.t === 'm') { // Message type
      let message = { // Composing message
        messageClass: (data.u === this.username)? 'self': '',
        username: data.u, 
        message: data.m
      }

      this.chatMessages.push(message); // Pushing message to view
    }
    console.log(e);
    
  }
  

  connect(){
    this.ws = new WebSocket('ws://127.0.0.1:3000');
    this.ws.onmessage = this.onmessage;
    this.ws.onopen    = (evt) => console.log("** Opened ***");
    
    this.ws.onclose   = this.retry.bind(this);

  }

    retry(evt) {
    setTimeout(() => {
      this.connect();
    }, 3000);
    console.log(`Error: ${evt}`);
  }

  send(message: any) {
    this.ws.send(message);
  }

  onMessage(callback: any) {
    this.onmessage = callback
  }


    sendMessage() {
    if (!this.message) return;

    let result = JSON.stringify({ // Composing message
      t: 'm',
      u: this.username, 
      m: this.message
    });
    this.ws.send(result);
    this.message = '';
  }

}
