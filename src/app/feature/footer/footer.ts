import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface SocialIcon {
  name: string;
  class: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

currentYear = new Date().getFullYear();

  socialIcons: SocialIcon[] = [
    { name: 'Facebook', class: 'fab fa-facebook-f', url: '#' },
    { name: 'Twitter', class: 'fab fa-twitter', url: '#' },
    { name: 'Instagram', class: 'fab fa-instagram', url: '#' },
    { name: 'LinkedIn', class: 'fab fa-linkedin-in', url: '#' }
  ];

  footerLinks: { [key: string]: string[] } = {
    'Company': [
      'About Us',
      'Careers',
      'Press',
      'Blog'
    ],
    'Products': [
      'Sofas',
      'Chairs',
      'Tables',
      'Beds'
    ],
    'Support': [
      'Help Center',
      'Contact Us',
      'Shipping Info',
      'Returns'
    ],
    'Legal': [
      'Privacy Policy',
      'Terms of Service',
      'Cookie Policy',
      'Warranty'
    ]
  };
}
