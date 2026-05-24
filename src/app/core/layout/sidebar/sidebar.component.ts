import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MENU_ITEMS } from '../../../shared/constants/menu-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = MENU_ITEMS;
}
