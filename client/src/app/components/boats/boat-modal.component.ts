import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boat } from '../../models/boat.model';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizeFirstPipe } from '../../pipes/CapitalizeFirstPipe';

@Component({
  selector: 'app-boat-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapitalizeFirstPipe],
  template: `
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <!-- Modal Container -->
    <div class="bg-white rounded-xl w-[95%] md:w-[90%] h-[90vh] max-w-[90rem] max-h-[90vh] 
               shadow-2xl relative flex flex-col">
      <!-- Close Button -->
      <button
        (click)="close.emit()"
        class="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-gray-700 transition-colors z-50"
      >
        <svg class="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Modal Content -->
      <div class="flex-1 grid md:grid-cols-2 gap-4 md:gap-8 overflow-auto">
        <!-- Image Section (60% width on desktop) -->
        <div class="relative h-[40vh] md:h-full md:min-h-[400px]">
          <img
            [src]="boat.imageUrl"
            [alt]="boat.name"
            class="object-cover w-full h-full"
          />
        </div>

        <!-- Details Section (40% width on desktop) -->
        <div class="p-4 md:p-8 flex flex-col space-y-1 overflow-auto">
          <h2 class="text-2xl md:text-3xl font-bold">{{ boat.name }}</h2>
          <span class="m-0">{{ 'COMMON.OWNER' | translate }} {{ boat.ownerFirstName  | capitalizeFirst}} {{ boat.ownerLastName  | capitalizeFirst}}</span>
          <p class="text-gray-600 md:text-lg flex-1 pt-6 overflow-auto">
            {{ boat.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class BoatModalComponent implements OnInit, OnDestroy {
    @Input() boat!: Boat;
    @Output() close = new EventEmitter<void>();    

    ngOnInit() {
        document.body.classList.add('overflow-hidden'); 
    }

    ngOnDestroy() {
        document.body.classList.remove('overflow-hidden');
    }
}
