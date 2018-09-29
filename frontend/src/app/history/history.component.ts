import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { History } from '../history';
import { SocketService } from '../socket.service';
import { RequestDialogComponent } from '../request-dialog/request-dialog.component';

/**Here we enter the data manually for the history */
const ELEMENT_DATA: History[] = [
  {position: 100, name: 'Vasiliki', type: 'warn', info: 'Logged by Vasiliki', status: 'accepted', datetime: '2018-09-20 08:30:45'},
  {position: 99, name: 'Abdul', type: 'log', info: 'Logged by Vasiliki', status: 'rejected', datetime: '2018-09-20 07:23:05'},
  {position: 98, name: 'Wael', type: 'log', info: 'Logged by Vasiliki', status: 'accepted', datetime: '2018-09-07 07:21:05'},
  {position: 97, name: 'Wael', type: 'log', info: 'Logged by Wael', status: 'accepted', datetime: '2018-09-02 23:54:05'},
  {position: 96, name: 'unknown', type: 'warn', info: 'Warning: Tried to log in', status: 'rejected', datetime: '2018-09-19 19:54:43'},
  {position: 95, name: 'Vasiliki', type: 'log', info: 'Logged by Vasiliki', status: 'rejected', datetime: '2018-09-20 17:23:59'},
  {position: 94, name: 'Hashim', type: 'log', info: 'Logged by Hashim', status: 'rejected', datetime: '2018-08-13 19:28:21'},
  {position: 93, name: 'unknown', type: 'warn', info: 'Warning: Tried to log in', status: 'rejected', datetime: '2018-07-22 07:23:43'},
  {position: 94, name: 'Wael', type: 'log', info: 'Logged by Wael', status: 'accepted', datetime: '2018-07-15 02:26:51'},

];


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'type', 'info', 'status', 'datetime'];
  dataSource = new MatTableDataSource([]);

  constructor(private socketService: SocketService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(socketService.historyList);
    // this.dataSource = new MatTableDataSource(ELEMENT_DATA);
   }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dialog.open(RequestDialogComponent, {
      width: '400px',
      data: {
        name: 'Hamza',
        timeout: 30 * 1000,
        type: 'wait'
      }
    });
  }
}
