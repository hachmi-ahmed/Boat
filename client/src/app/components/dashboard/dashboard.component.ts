import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; // Added TranslateModule
import { CommonService } from '../../services/common.service';
import { Boat } from '../../models/boat.model';
import { AuthService } from '../../services/auth.service';
import { BoatService } from '../../services/boat.service';
import { BoatsComponent } from '../boats/boats.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, BoatsComponent],
  template: `
    <div class="max-w-7xl mx-auto mt-20 px-4 py-6">
      <div *ngIf="user?.role==='ROLE_ADMIN'" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Stats -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ 'DASHBOARD.STATS_TOTAL_USER' | translate }}</h3>
          <p class="text-3xl font-bold text-indigo-600">{{ stats.totalUsers }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">{{ 'DASHBOARD.STATS_TOTAL_BOAT' | translate }}</h3>
          <p class="text-3xl font-bold text-indigo-600">{{ stats.totalBoats }}</p>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white rounded-lg shadow-md mb-8">
     
          <!-- Gallery Section (BoatsComponent) -->
        <app-boats
          [boats]="boats"
          [mode]="'edit'"
          [user]="user"
          (toggleShowMine)="loadByUser($event)">
        </app-boats>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit{
  
  stats: any = {};
  boats: Boat[] = [];
  user:User | null = null;

  constructor(private commonService: CommonService, private authService: AuthService, private boatService: BoatService){}

  ngOnInit() {
    this.commonService.getStats().subscribe((response)=>{
      this.stats = response.data;
    });
    this.user  = this.authService.getCurrentUser();
    if(this.user!==null && this.user.role==='ROLE_USER'){
      this.loadBoatByUser();
    }
    if(this.user!==null && this.user.role==='ROLE_ADMIN'){
       this.loadAllBoat()
    }
  }
    
   loadByUser(showMine: boolean) {
      if (!showMine) {
          this.loadBoatByUser();
      } else {
        this.loadAllBoat();
      }
    }

    loadBoatByUser(){
      this.boatService.getBoatsByUserId(this.user?.id).subscribe((response)=>{
        this.boats = response.data;
      });
    }
    loadAllBoat(){
      this.boatService.getBoats().subscribe((response)=>{
        this.boats = response.data;
      });
    }
}
