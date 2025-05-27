import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { BoatService } from '../../services/boat.service';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';
import { Boat } from '../../models/boat.model';
import { BoatsComponent } from '../../components/boats/boats.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NzModalModule,
    NzImageModule,
    BoatsComponent
  ],
  template: `
    <div class="relative overflow-hidden" [style.height]="'calc(100vh)'">
      <ng-container *ngFor="let boat of boats; let i = index;">
        <div
          class="absolute w-full h-full transition-opacity duration-1000"
          [style.opacity]="currentImageIndex === i ? '0.9' : '0'"
        >
          <img
            [src]="boat.imageUrl"
            [alt]="boat.name | translate"
            class="w-full h-full object-cover"
            (load)="onImageLoad()"
          />
          <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      </ng-container>

      <div class="relative z-10 max-w-7xl mx-auto h-full flex items-center">
        <div class="text-white px-4 m-auto">
          <h1 class="text-5xl font-bold mb-6 text-white">{{ 'HOME_PAGE.HERO_TITLE' | translate }}</h1>
          <p class="text-xl mb-8 max-w-2xl">{{ 'HOME_PAGE.HERO_SUBTITLE' | translate }}</p>
          <a href="#" (click)="scrollToGallery($event)"
             class="bg-indigo-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-indigo-700 transition">
            {{ 'HOME_PAGE.HERO_BUTTON_GET_STARTED' | translate }}
          </a>
        </div>
      </div>
    </div>

    <!-- Back to gallery button -->
    <button
      *ngIf="showBackToGallery"
      (click)="scrollToGalleryFromDown()"
      class="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50 flex items-center justify-center"
      aria-label="Back to gallery"
    >
      <svg
        class="w-6 h-6 transform rotate-90"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
      </svg>
      <span class="sr-only">Back to Gallery</span>
    </button>

    <!-- Gallery Section (BoatsComponent) -->
    <app-boats
      [boats]="boats"
      [mode]="'read'"
      [user]="user"
      (selectBoat)="openModal($event)">
    </app-boats>

  `,
  styles: [`
    :host {
      display: block;
      margin-top: -2rem;
      margin-left: -1rem;
      margin-right: -1rem;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  boats: Boat[] = [];
  currentImageIndex = 0;
  private intervalId: any;
  private imagesLoaded = 0;
  showBackToGallery = false;
  confirmModal?: NzModalRef;
  user:User | null = null;

  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private boatService: BoatService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.boatService.getBoats().subscribe(response=>{
      this.boats = response.data;
      this.resetSlideshow();
    });
    this.user = this.authService.getCurrentUser()
    this.startSlideshow();
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const gallerySection = document.getElementById('gallery');
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (gallerySection) {
      const offsetTop = gallerySection.offsetTop;
      this.showBackToGallery = scrollTop > offsetTop;
    }
  }

  scrollToGallery(event: Event) {
    event.preventDefault();
    const gallery = document.getElementById('gallery');
    gallery?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToGalleryFromDown() {
    const gallerySection = document.getElementById('gallery');
    gallerySection?.scrollIntoView({ behavior: 'smooth' });
  }

  onImageLoad() {
    this.imagesLoaded++;
    if (this.imagesLoaded === 1 && !this.intervalId) {
      this.startSlideshow();
    }
  }

  private resetSlideshow() {
    this.clearInterval();
    this.currentImageIndex = 0;
    this.imagesLoaded = 0;
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.boats.length;
    }, 3000);
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  openModal(boat: Boat): void {
    const galleryComponent = document.querySelector('app-boats') as any;
    if (galleryComponent) {
      galleryComponent.selectedBoat = boat;
      document.body.classList.add('overflow-hidden');
    }
  }

  deleteBoat(boat: Boat): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: this.translate.instant('HOME_PAGE.CONFIRM_DELETE'),
      nzOkText: this.translate.instant('COMMON.YES'),
      nzCancelText: this.translate.instant('COMMON.CANCEL'),
      nzCentered: true,
      nzOnOk: () =>
        this.boatService.deleteBoatById(boat.id).subscribe(() => {
          this.boats = this.boats.filter(b => b.id !== boat.id);
        })
    });
  }
}
