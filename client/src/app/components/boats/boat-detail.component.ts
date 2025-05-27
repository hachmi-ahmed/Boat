import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Boat } from '../../models/boat.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { BoatService } from '../../services/boat.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CapitalizeFirstPipe } from '../../pipes/CapitalizeFirstPipe';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-boat-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CapitalizeFirstPipe,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    NzPopconfirmModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 py-6 mt-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        <div class="p-4 sm:p-6 border-b border-gray-100">
          <button
            (click)="goBack()"
            class="inline-flex items-center px-4 py-2 border border-transparent 
                   text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            {{ 'COMMON.BACK' | translate }}
          </button>
        </div>

        <ng-container *ngIf="!editMode">
          <ng-container *ngIf="boat">
            <div class="w-full h-[40vh] md:h-[40vh] lg:h-[40vh]">
              <img
                [src]="boat.imageUrl"
                [alt]="boat.name"
                class="object-cover w-full h-full"
              />
            </div>

            <div class="p-6 md:p-10 lg:p-8">
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {{ boat.name }}
              </h1>
              <p>{{ 'COMMON.OWNER' | translate }} {{ boat.ownerFirstName  | capitalizeFirst}} {{ boat.ownerLastName  | capitalizeFirst}}</p>

              <p class="text-gray-600 md:text-lg leading-relaxed mb-10">
                {{ boat.description }}
              </p>

              <div *ngIf="isAdmin" class="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  (click)="editBoat()"
                   class="bg-gray-300 text-black  px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  {{ 'BOAT_DETAIL.EDIT' | translate }}
                </button>  
                <button

                  nz-popconfirm
                  nzPopconfirmTitle="{{ 'COMMON.CONFIRM_MESSAGE' | translate }}"
                  (nzOnConfirm)="onDelete()"
                  (nzOnCancel)="cancel()"
                  nzOkText="{{ 'COMMON.YES' | translate }}"
                  nzCancelText="{{ 'COMMON.CANCEL' | translate }}" 
                  nzCancelText="cancel"
                  nzPopconfirmPlacement="top"
                  class="bg-red-600 text-white  ml-2 px-6 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  {{ 'BOAT_DETAIL.DELETE' | translate }}
                </button>
   
              </div>
            </div>
          </ng-container>       
        </ng-container>

        <!-- EDIT FORM-->

        <ng-container *ngIf="boatForm && editMode">
          <div class="p-6 md:p-10 lg:p-8">
            <div class="w-full h-[40vh] md:h-[40vh] lg:h-[40vh]" *ngIf="boatForm.controls['imageUrl'].value">
              <img
                [src]="boatForm.controls['imageUrl'].value"
                [alt]="boatForm.controls['imageUrl'].value"
                class="object-cover w-full h-full"
              />
            </div>
            <form [formGroup]="boatForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  {{ 'BOAT_DETAIL.IMAGE_URL' | translate }}
                </label>
                <nz-select formControlName="imageUrl" class="w-full" nzPlaceHolder="{{ 'FORM.REQUIRED' | translate }}">
                  <nz-option *ngFor="let url of imageOptions" [nzValue]="url" [nzLabel]="url"></nz-option>
                </nz-select>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  {{ 'BOAT_DETAIL.NAME' | translate }}
                </label>
                <input type="text" formControlName="name"   placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.BOAT_INFO_NAME' | translate }}"
                  class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  {{ 'BOAT_DETAIL.DESCRIPTION' | translate }}
                </label>
                <textarea formControlName="description" rows="4"   placeholder="{{ 'FORM.REQUIRED' | translate }} {{ 'VALIDATION.BOAT_INFO_DESCRIPTION' | translate }}"
                  class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="submit"
                  class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="boatForm.invalid">
                  {{ 'BOAT_DETAIL.SAVE' | translate }}
                </button>
                <button type="button" (click)="cancel()"
                  class="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors">
                  {{ 'COMMON.CANCEL' | translate }}
                </button>
              </div>
            </form>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class BoatDetailComponent implements OnInit {
  @Input() isAdmin = true;
  @Output() delete = new EventEmitter<Boat | null>();
  editMode = false;

  boat: Boat = {
            id: -1,
            name: '',
            description: '',
            imageUrl: '',
            ownerFirstName: '',
            ownerLastName: ''
          };;
  errorMessage: string | null = null;
  isNewBoat = false;
  ownerId:number | undefined;

  boatForm!: FormGroup;
  imageOptions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private boatService: BoatService,
    private location: Location,
    private fb: FormBuilder,
    private message: NzMessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.boatService.getBoatsImagesUrls().subscribe((response) => {
      this.imageOptions = response.data;
    });
    this.route.paramMap.pipe(
      switchMap(params => {
        const boatId = Number(params.get('boatId'));
        if (boatId === -1) {
          this.isNewBoat = true;  
          this.editMode = true;       
          this.initForm(this.boat);
          return of(null);
        } else {
          return this.boatService.getBoatById(boatId);
        }
      })
    ).subscribe({
      next: (boatData) => {
        if (boatData?.data) {
          this.boat = boatData.data;
          this.ownerId = this.boat.owner?.id;
          this.initForm(this.boat);
        } else if (!this.isNewBoat) {
          this.errorMessage = 'Boat not found.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load boat.';
      }
    });
  }

  initForm(boat: Boat) {
    this.boatForm = this.fb.group({
      name: [boat.name, Validators.required],
      description: [boat.description, Validators.required],
      imageUrl: [boat.imageUrl, Validators.required]
    });
  }

  onSubmit() {
    if (this.boatForm.invalid) return;

    const formValue = this.boatForm.value;
    const payload: Boat = {
      ...this.boat!,
      ...formValue
    };
    payload.userId=this.ownerId;
    payload.owner = undefined;
    if (this.isNewBoat) {
      this.boatService.createOrSaveBoat(payload).subscribe({
        next: (response) => {
          if(response.status===200){
            this.alertSuccess(response.key);
            this.location.back();
          } else if(response.status===400){
            this.alertError(response.key);
          } else if(response.status===404){
            this.alertError(response.key);
          }
        },
        error: () => this.alertError('Failed to create boat')
      });
    } else {
      
      this.boatService.createOrSaveBoat(payload)      
      .subscribe({
        next: (response) => {
          if(response.status===200){
            this.alertSuccess(response.key);
            this.location.back();
          } else if(response.status===400){
            this.alertError(response.key);
          } else if(response.status===404){
            this.alertError(response.key);
          }
        },
        error: () => this.alertError('Failed to update boat')
      });
    }
  }

  cancel(){
    if(this.boat.id===-1){
      this.goBack();
    }else{
      this.editMode=false;
      this.boatForm.reset();
    }
  }

  onDelete(): void {
    this.boatService.deleteBoatById(this.boat.id).subscribe({
        next: (response) => {
          this.alertSuccess(response.key);
          this.delete.emit(this.boat);
          this.location.back();
        },
        error: () => this.alertError('Failed to delete boat')
     });
  }

  onCancel(){}

  editBoat(){
    this.editMode = true;
    this.boatForm.patchValue(this.boat);
  }

  goBack(): void {
    this.location.back();
  }

  alertSuccess(key: string) {
    this.message.success(this.translate.instant(key), { nzDuration: 5000 });
  }

  alertError(key: string) {
    this.message.error(this.translate.instant(key), { nzDuration: 5000 });
  }
}