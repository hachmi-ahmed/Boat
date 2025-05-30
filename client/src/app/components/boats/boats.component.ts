import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boat } from '../../models/boat.model';
import { TranslateModule } from '@ngx-translate/core';
import { NzImageModule } from 'ng-zorro-antd/image';
import { BoatModalComponent } from './boat-modal.component';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-boats',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NzImageModule, BoatModalComponent, NzSwitchModule, NzDividerModule],
  template: `
     <section id="gallery" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">
          {{ titleKey | translate }}
          <span *ngIf="showCount">({{ boats.length }})</span>
        </h2>
        
        <div class="flex items-center justify-between mb-4" *ngIf="mode==='edit'">
          <div class="flex items-center gap-2">
            <label *ngIf="isAdmin"  for="showAllSwitch" class="text-gray-700"><strong>{{ 'DASHBOARD.SHOW_MINE' | translate }}</strong></label>
            <nz-switch *ngIf="isAdmin" [(ngModel)]="showAll" id="showAllSwitch" 
            (ngModelChange)="toggleShowMine.emit(!showAll)"></nz-switch>
          </div>          
          <button
            nz-button
            nzType="primary"
            (click)="newBoat()"
            class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded"
          >
            {{ 'DASHBOARD.NEW_BOAT' | translate }}
          </button>
        </div>
        
        <nz-divider *ngIf="mode==='edit'" [nzText]="'DASHBOARD.BOAT_LIST' | translate"></nz-divider>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div
            *ngFor="let boat of boats"
            (click)="onBoatClick(boat)" class="group bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full 
              transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                [src]="boat.imageUrl"
                [alt]="boat.name"
                class="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105 origin-center"
              />
              <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 
                via-black/40 to-transparent transition-all duration-300 group-hover:from-black/80">
                <h3 class="text-white font-bold text-lg">{{ boat.name}}</h3>
              </div>
              <div class="absolute bottom-2 right-2">
                <div
                  *ngIf="user?.id === boat.owner?.id"
                  class="w-4 h-4 rounded-full bg-indigo-600 border-2 border-white shadow"
                ></div>
              </div>
            </div>
            <div class="p-4 flex-1 transition-colors duration-300 group-hover:bg-gray-50">
              <p class="text-gray-600">{{ boat.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BOAT READ MODAL -->
    
    <app-boat-modal
      *ngIf="selectedBoat"
      [boat]="selectedBoat"
      (close)="selectedBoat = null"
    />
  `
})
export class BoatsComponent {
  @Input() boats: Boat[] = [];
  @Input() mode: 'read' | 'edit' = 'read';
  @Input() user: User | null= null;
  @Output() selectBoat = new EventEmitter<Boat>();
  @Output() toggleShowMine = new EventEmitter<boolean>();
  selectedBoat: Boat | null = null;
  isAdmin: boolean | null = false;
  showAll:boolean=false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.selectBoat.subscribe(boat => this.selectedBoat = boat);
    this.isAdmin = this.user && this.user.role === 'ROLE_ADMIN';
  }

    onBoatClick(boat: Boat): void {
    if (this.mode === 'edit') {
      this.router.navigate(['boats', boat.id]); 
    } else {
      this.selectedBoat = boat;
      this.selectBoat.emit(boat); 
    }
  }

  onToggleShowAll(value: boolean) {
    this.showAll = value;
    this.toggleShowMine.emit(!value);
  }

  newBoat(){
    this.router.navigate(['boats/-1']);
  }

  get titleKey(): string {
    if (this.mode === 'read') {
      return 'HOME_PAGE.BOATS_TITLE';
    }
    if (this.isAdmin) {
      return this.showAll ? 'DASHBOARD.MY_BOATS' : 'DASHBOARD.ALL_BOATS';
    }
    return 'DASHBOARD.MY_BOATS';
  }

  get showCount(): boolean {
    return this.mode !== 'read';
  }
  
}
