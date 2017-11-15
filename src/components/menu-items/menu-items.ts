import {
  Component, Input, ChangeDetectionStrategy
} from '@angular/core';
import {
  trigger, transition, style, animate, state
} from '@angular/animations';
import debug from 'debug';

import { MenuMapping } from '../../../config/pages/';

const log = debug('MenuItem');

export interface IMenuItem {
  type: String;
  trans: String;
  page?: String;
  params?: Object;
  icon?: String;
  list?: Array<IMenuItem>;
  isOpen?: boolean;
}

@Component({
  selector: 'menu-items',
  templateUrl: 'menu-items.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('toggleMenu', [
      state('opened', style({ height: '*' })),
      state('closed', style({ height: 0 })),
      transition('closed => opened', [
        animate(250, style({ height: '*' }))
      ]),
      transition('opened => closed', [
        animate(250, style({ height: 0 }))
      ])
    ]),
    trigger('rotateIcon', [
      state('opened', style({ transform: 'rotate(90deg)' })),
      state('closed', style({ transform: 'rotate(0deg)' })),
      transition('closed => opened', [
        animate(250, style({ transform: 'rotate(90deg)' }))
      ]),
      transition('opened => closed', [
        animate(250, style({ transform: 'rotate(0deg)' }))
      ])
    ])
  ]
})
export class MenuItemsComponent {
  @Input() list: Array<IMenuItem>;
  @Input() content: any;

  trackByIndex = (index: number, item) => index;

  closeAllFolders() {
    this.list.filter(item => item.type === 'folder').forEach(item => item.isOpen = false);
  }

  toggleFolder(item: IMenuItem) {
    const isOpened = item.isOpen;
    this.closeAllFolders();
    item.isOpen = !isOpened;
  }

  doInternalClick = (e, { page, params, navRoot }) => {
    if (!MenuMapping[page]) {
      throw new Error(`the page "${page}" does not exist`);
    }

    if (params && params.options) {
      params = Object.assign({}, params, {
        options: JSON.stringify(params.options)
      });
    }
    log('[MENU]', page, params);
    if (navRoot) {
      this.content.setRoot(MenuMapping[page], params);
    } else {
      this.content.push(MenuMapping[page], params);
    }
  }

}
