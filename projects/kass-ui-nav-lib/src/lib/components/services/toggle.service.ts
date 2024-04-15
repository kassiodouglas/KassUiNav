//serviço para evento global da nav-bar

import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  public onNavigaionToggle: EventEmitter<any> = new EventEmitter();
  public onSetFav: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
