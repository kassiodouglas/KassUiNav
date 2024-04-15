import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { EventEmitterService } from '../services/toggle.service';

@Component({
  selector: 'navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss'],
})
export class NavigatorComponent implements OnInit, OnChanges {
  @Input()
  links!: any;

  @Input()
  header: any = null;

  @Input()
  useFav: boolean = true;

  @Input()
  permissions: Array<string> = [];

  @Input()
  usePermissions: boolean = false;

  @Input()
  theme: string | any = 'dark';

  @Input()
  position: string = 'left';

  @Input()
  search: boolean = true;

  @ViewChild('containerHeader', { read: ViewContainerRef })
  containerHeader!: ViewContainerRef;

  headerIsComponent = false;

  favorite_links: Array<any> = [];

  links_list!: Array<any>;

  show = false;
  showing = false;
  hiding = false;

  filter_link: string = '';

  screenWidth!: number;
  screenHeight!: number;
  bodyHeight = '100%';

  constructor(
    private eventEmitterService: EventEmitterService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private elementRef: ElementRef
  ) {
    this.eventEmitterService.onSetFav.subscribe((data: any) => {
      setTimeout(() => {
        this.setFavoriteLinks();
      }, 10);
    });
  }

  ngOnInit() {
    this.links_list = JSON.parse(JSON.stringify(this.links));
    this.checkFavs();
    this.headerCheck();

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.checkBodyHeight();
  }

  ngAfterContentInit(): void {
    setTimeout(() => this.headerCheck(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['useFav']) {
      if (changes['useFav'].currentValue == true) {
        this.checkFavs();
      } else if (
        changes['useFav'].currentValue == false &&
        changes['useFav'].firstChange != true
      ) {
        this.links_list = JSON.parse(JSON.stringify(this.links));
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.checkBodyHeight();
  }

  checkBodyHeight() {

    let percent = 0.078;
    if(this.screenHeight <= 599){
      percent = 0.090;
    }else{
      percent = 0.078;
    }

    this.bodyHeight = this.screenHeight * percent + "%"
  }

  checkFavs() {
    if (this.useFav && this.links_list !== undefined) {
      this.setFavoriteLinks();
      this.links_list.forEach((el) => this.initFavorites(el));
    }
  }

  initFavorites(el: any) {
    if (el.hasOwnProperty('links')) {
      this.initFavorites(el.links);
    } else if (el.length > 0) {
      el.forEach((ellink: any) => {
        this.initFavorites(ellink);
      });
    } else {
      if (this.favorite_links !== undefined) {
        this.favorite_links.forEach((fav: any) => {
          if (fav.label == el.label) {
            el['isfav'] = true;
            // el['favArea'] = true;
            fav['favArea'] = true;
          }
        });
      }
    }
  }

  setFavoriteLinks() {
    var storage = localStorage.getItem('favoriteLinks');

    if (storage === undefined || storage === null) {
      localStorage.setItem('favoriteLinks', JSON.stringify([]));
      storage = localStorage.getItem('favoriteLinks');
    }

    if (storage !== undefined && storage !== null) {
      var links = JSON.parse(storage);

      var indexToRemove: Array<number> = [];

      links.forEach((link: any, index: number) => {
        var permited: boolean = false;

        if (this.usePermissions) {
          if (link.permissions !== undefined) {
            link.permissions.forEach((perm: any) => {
              if (this.permissions.includes(perm)) {
                permited = true;
                return;
              }
            });
          } else {
            permited = true;
          }
        } else {
          permited = true;
        }

        if (permited) {
          link['isfav'] = true;
          link['favArea'] = true;
        } else {
          indexToRemove.push(index);
        }
      });

      indexToRemove.forEach((x: number) => links.pop(x));

      this.favorite_links = links;

      localStorage.setItem('favoriteLinks', JSON.stringify(links));
    }
  }

  recursiveSearch(data: any, text: string): any {
    if (data.hasOwnProperty('dividder')) return;

    text = text.toLowerCase();

    if (data.hasOwnProperty('label') && data.hasOwnProperty('path')) {
      let label = data['label'].toLowerCase();
      let tags = data.hasOwnProperty('tags') ? data['tags'] : [];

      let foundTag: Boolean = false;
      tags.forEach((tag: string) => {
        tag = tag.toLowerCase();
        if (tag.includes(text)) {
          foundTag = true;
        }
      });

      if (label.includes(text) || foundTag) return data;
    } else if (data.hasOwnProperty('links')) {
      var ell: any = [];
      data.links.forEach((el: any) => {
        var res = this.recursiveSearch(el, text);
        if (res !== undefined) ell.push(res);
      });

      if (ell.length == 0) return undefined;

      data.links = ell;
      return data;
    }
  }

  searchLinks() {
    this.links_list = JSON.parse(JSON.stringify(this.links));
    var filtered_menu: Array<any> = [];

    this.initFavorites(this.links_list);

    if (this.filter_link != '') {
      this.links_list.forEach((obj: any) => {
        var x = this.recursiveSearch(obj, this.filter_link);

        if (x !== undefined) {
          if (x.hasOwnProperty('links') && x.links[0].length == 0) '';
          else filtered_menu.push(x);
        }
      });

      this.links_list = filtered_menu;

      if (this.links_list == undefined || this.links_list.length == 0) {
        this.links_list = [{ divider: 'Nenhum menu encontrado' }];
      }
    }
  }

  headerCheck() {
    if (typeof this.header !== 'string' && this.header !== undefined) {
      this.headerIsComponent = true;

      const factory: any =
        this.componentFactoryResolver.resolveComponentFactory(this.header);

      if (this.containerHeader === undefined) {
        return;
      }
      const componentRef = factory.create(this.containerHeader.injector);
      this.containerHeader.insert(componentRef.hostView);
    }
  }

  closeBackdropMenu(event:MouseEvent){
    this.hiding=true;
    setTimeout(()=>{this.show=false; this.showing=false, this.hiding = false;},500)
  }

  closeContainerMenu(event:MouseEvent){
    event.stopPropagation();
    this.hiding=true;
    setTimeout(()=>{this.show=false; this.showing=false, this.hiding = false;},500)
  }

  openMenu(){
    this.show=true;
    this.showing=true;
  }
}
