import { Injectable } from '@angular/core';
import * as SocketIO from 'socket.io-client';
import { History } from './history';
import { MatDialog } from '@angular/material';
import { RequestDialogComponent } from './request-dialog/request-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public historyList: History[];
  socket: any;

  constructor(public dialog: MatDialog) {
    this.socket = SocketIO('http://localhost:80');
    this.socket.on('history', (data) => this.onAdd(data));
    this.socket.on('request', (data) => this.onRequest(data));
  }

  onAdd(data) {
    const pos: any = data.pos;
    const name: any = data.name;
    const type: any = data.type;
    const status: any = data.status;
    const info: any = data.info;
    const datetime: any = data.datetime;
    const newList: History[] = [];
    newList.push({
      position: pos,
      name: name,
      type: type,
      status: status,
      info: info,
      datetime: datetime
    });
    for (const history of this.historyList) {
      newList.push(history);
    }
    this.historyList = newList;
  }

  onRequest(data) {
    this.dialog.open(RequestDialogComponent, {
      width: '250px',
      data: {
        name: data.name
      }
    })
  }

}
