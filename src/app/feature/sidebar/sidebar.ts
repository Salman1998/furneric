import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FilterItem {
  name: string;
  icon: string;
  count: number;
  router: string;
}

interface FilterGroup {
  title: string;
  isOpen: boolean;
  selected: string;
  items: FilterItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

filterGroups: FilterGroup[] = [
    {
      title: 'Categories',
      isOpen: true,
      selected: '',
      items: [
        { name: 'Technology', icon: 'fa fa-laptop', count: 125, router: 'technology' },
        { name: 'Science', icon: 'fa fa-flask', count: 89, router: 'science' },
        { name: 'Art & Design', icon: 'fa fa-palette', count: 156, router: 'art-design' },
        { name: 'Business', icon: 'fa fa-briefcase', count: 203, router: 'business' }
      ]
    },
    {
      title: 'Topics',
      isOpen: false,
      selected: '',
      items: [
        { name: 'Web Development', icon: 'fa fa-code', count: 342, router: 'web-dev' },
        { name: 'Mobile Apps', icon: 'fa fa-mobile-alt', count: 198, router: 'mobile' },
        { name: 'Machine Learning', icon: 'fa fa-brain', count: 267, router: 'ml' },
        { name: 'Cloud Computing', icon: 'fa fa-cloud', count: 145, router: 'cloud' }
      ]
    },
    {
      title: 'Resources',
      isOpen: false,
      selected: '',
      items: [
        { name: 'Tutorials', icon: 'fa fa-book', count: 512, router: 'tutorials' },
        { name: 'Videos', icon: 'fa fa-video', count: 423, router: 'videos' },
        { name: 'Articles', icon: 'fa fa-newspaper', count: 678, router: 'articles' },
        { name: 'Podcasts', icon: 'fa fa-podcast', count: 234, router: 'podcasts' }
      ]
    }
  ];

  onSelectSidebarMenu(): void {
    console.log('Sidebar menu item selected');
  }

  toggleGroup(group: FilterGroup): void {
    group.isOpen = !group.isOpen;
  }

  selectItem(group: FilterGroup, item: FilterItem): void {
    group.selected = item.name;
    this.onSelectSidebarMenu();
  }
}
