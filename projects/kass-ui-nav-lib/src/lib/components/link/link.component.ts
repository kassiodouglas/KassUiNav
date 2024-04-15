import {
  Component,
  OnInit,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { EventEmitterService } from '../services/toggle.service';

@Component({
  selector: 'linker',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent implements OnInit {
  /** PROPERTIES-------------------------------------------------------------------------------------------------------- */

  @Input()
  link!: any;

  @Input()
  theme: string | any = 'dark';

  @Output()
  onSetfav: EventEmitter<any> = new EventEmitter();

  arrowActive: boolean = false;

  @Input()
  permissions: Array<string> = [];

  @Input()
  usePermissions: boolean = true;

  linkId: string = '';

  @Input()
  useFav: boolean = false;

  @Input()
  isInFavArea = false

  @ViewChildren('links') multLinks!: QueryList<ElementRef>;


  constructor(private eventEmitterService: EventEmitterService) {}


  ngOnInit() {
    if (this.link != undefined && this.link !== null && !this.link.divider && this.link.path){
      const label = this.link.label!.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
      const path = this.link.path!.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();

      this.linkId = this.generateUniqueId(label, path);
      this.link.identificator = this.linkId;
    }
  }

  basicHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString();
  }

  generateUniqueId(label: string, path: string) {
    const cleanLabel = label.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
    const cleanPath = path.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
    return 'linker_' + this.basicHash(cleanLabel + cleanPath);
  }


  arrow() {
    this.arrowActive = !this.arrowActive;
  }

  setFav(link: any) {
    var id = this.linkId;
    var star = document.querySelector(`#${id}`);

    if (star == null) return;

    var storage = localStorage.getItem('favoriteLinks');
    if (storage === null || storage === undefined) return;

    var links = JSON.parse(storage);

    if (star?.classList.contains('active')) {
      links.forEach((el: any, index: any) => {
        if (el.identificator == link.identificator) {
          links.splice(index, 1);
        }
      });
      star?.classList.remove('active');
      star?.classList.remove('fa-solid');
      star?.classList.add('fa-regular');
    } else {
      links.push(link);
      star?.classList.add('active');
      star?.classList.add('active');
      star?.classList.add('fa-solid');
      star?.classList.remove('fa-regular');
    }

    localStorage.setItem('favoriteLinks', JSON.stringify(links));

    this.eventEmitterService.onSetFav.emit(link);
  }

  removeFav(link: any) {

    var id = this.linkId;
    var star = document.querySelector(`#${id}`);

    var storage = localStorage.getItem('favoriteLinks');
    if (storage === null || storage === undefined) return;

    var linksFav = JSON.parse(storage);

    linksFav.forEach((el: any, index: any) => {
      if (el.identificator == link.identificator) {
        linksFav.splice(index, 1);
      }
    });

    star?.classList.remove('active');
    star?.classList.remove('fa-solid');
    star?.classList.add('fa-regular');

    localStorage.setItem('favoriteLinks', JSON.stringify(linksFav));
    this.eventEmitterService.onSetFav.emit(link);

  }


  checkPermission(permisisons: any) {
    if (this.usePermissions === false) return true;

    if (permisisons === undefined) return true;

    var result = false;

    this.permissions.forEach((perm: any) => {
      if (permisisons.includes(perm)) {
        result = true;
        return;
      }
    });

    return result;
  }

  openMenu(event: Event, drop: any){

    if(this.isInFavArea == false) return

    let all = document.querySelectorAll(`.drop-menu`);
    let thisdrop = document.querySelector(`.drop_${this.linkId}`);

    all.forEach((e: any) => e.classList.add('hide'));

    thisdrop?.classList.remove('hide');

    drop.open();
    event.preventDefault();
  }

}
