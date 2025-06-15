import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Boat } from '../../models/boat.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoatService } from '../../services/boat.service';
import { takeUntil, finalize, first } from 'rxjs/operators'; // Added takeUntil, finalize
import { Subject,  lastValueFrom } from 'rxjs'; // Added Subject, forkJoin
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
    FormsModule, // Keep if you use ngModel elsewhere, otherwise can be removed
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

        <ng-container *ngIf="!editMode && boat">
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
            <p>{{ 'COMMON.OWNER' | translate }} {{ boat.ownerFirstName | capitalizeFirst }} {{ boat.ownerLastName | capitalizeFirst }}</p>

            <p class="text-gray-600 md:text-lg leading-relaxed mb-10">
              {{ boat.description }}
            </p>

            <div *ngIf="isAdmin" class="mt-8 pt-6 border-t border-gray-200 flex justify-end">
              <button
                (click)="editBoat()"
                 class="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                {{ 'BOAT_DETAIL.EDIT' | translate }}
              </button>  
              <button
                nz-popconfirm
                nzPopconfirmTitle="{{ 'COMMON.CONFIRM_MESSAGE' | translate }}"
                (nzOnConfirm)="onDelete()"
                (nzOnCancel)="cancelDelete()"
                nzOkText="{{ 'COMMON.YES' | translate }}"
                nzCancelText="{{ 'COMMON.CANCEL' | translate }}"
                nzPopconfirmPlacement="top"
                class="bg-red-600 text-white ml-2 px-6 py-2 rounded hover:bg-red-700 transition-colors"
              >
                {{ 'BOAT_DETAIL.DELETE' | translate }}
              </button>
            </div>
          </div>
        </ng-container>

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
                <div *ngIf="boatForm.controls['imageUrl'].invalid && boatForm.controls['imageUrl'].touched" class="text-red-600 text-sm mt-1">
                    {{ 'FORM.REQUIRED' | translate }}
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  {{ 'BOAT_DETAIL.NAME' | translate }}
                </label>
                <input type="text" formControlName="name" placeholder="{{ 'BOAT_DETAIL.NAME' | translate }}"
                  class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <div *ngIf="boatForm.controls['name'].errors?.['required']  && boatForm.controls['name'].touched" class="text-red-600 text-sm mt-1">
                  {{ 'FORM.REQUIRED' | translate }}
                </div>
              <div *ngIf="boatForm.controls['name'].errors?.['maxlength']  && boatForm.controls['name'].touched" class="text-red-600 text-sm mt-1">
                  {{ 'VALIDATION.BOAT_NAME' | translate }}
              </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  {{ 'BOAT_DETAIL.DESCRIPTION' | translate }}
                </label>
                <textarea formControlName="description" rows="4" placeholder="{{ 'BOAT_DETAIL.DESCRIPTION' | translate }}"
                  class="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                <div *ngIf="boatForm.controls['description'].errors?.['required']  && boatForm.controls['description'].touched" class="text-red-600 text-sm mt-1">
                  {{ 'FORM.REQUIRED' | translate }}
                </div>
                <div *ngIf="boatForm.controls['description'].errors?.['maxlength']  && boatForm.controls['description'].touched" class="text-red-600 text-sm mt-1">
                  {{ 'VALIDATION.BOAT_DESCRIPTION' | translate }}
                </div>
              </div>
              <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button type="submit"
                  class="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  [disabled]="boatForm.invalid || isSubmitting"
                >
                  {{ 'BOAT_DETAIL.SAVE' | translate }}
                </button>
                <button type="button" (click)="onCancelEdit()"
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
export class BoatDetailComponent implements OnInit, OnDestroy {
  @Input() isAdmin = true;
  @Output() delete = new EventEmitter<Boat | null>();

  editMode = false;
  boat: Boat | null = null;
  errorMessage: string | null = null;
  isNewBoat = false;
  ownerId: number | undefined;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  boatForm!: FormGroup;
  imageOptions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private boatService: BoatService,
    private location: Location,
    private fb: FormBuilder,
    private message: NzMessageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadBoatAndImageUrls();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadBoatAndImageUrls(): Promise<void> {
    try {
      const imagesResponsePromise = lastValueFrom(this.boatService.getBoatsImagesUrls());
      this.imageOptions = (await imagesResponsePromise).data || [];

      const params : any = await lastValueFrom(this.route.paramMap.pipe(first()));
      const boatId = Number(params.get('boatId'));

      let boatData: Boat;
      if (isNaN(boatId) || boatId === -1) {
        this.isNewBoat = true;
        this.editMode = true;
        boatData = this.createEmptyBoat();
      } else {
        try {
          const boatResponse = await lastValueFrom(this.boatService.getBoatById(boatId));
          if (boatResponse?.data) {
            boatData = boatResponse.data;
          } else {
            this.editMode = false;
            return;
          }
        } catch (error) {
          console.error('Error fetching boat by ID:', error);
          this.editMode = false; 
          return;
        }
      }

      this.boat = boatData;
      this.ownerId = this.boat.owner?.id;
      this.checkIfCamAccess();
      this.initForm(this.boat); 
      
    } catch (err) {
      console.error('Error during boat/image URL loading:', err);
    }
  }
    checkIfCamAccess(){
    if(this.authService.getCurrentUser()?.role!=='ROLE_ADMIN' 
      && this.ownerId!==this.authService.getCurrentUser()?.id
      && !this.isNewBoat
    ){
      this.router.navigateByUrl('/denied');
    }
  }

  private createEmptyBoat(): Boat {
    return {
      id: -1,
      name: '',
      description: '',
      imageUrl: this.imageOptions.length > 0 ? this.imageOptions[0] : '',
      userId: this.authService.getCurrentUser()?.id
    };
  }

  initForm(boat: Boat | null): void {
    this.boatForm = this.fb.group({
      name: [boat?.name, [Validators.required, Validators.maxLength(50)]],
      description: [boat?.description, [Validators.required, Validators.maxLength(300)]],
      imageUrl: [boat?.imageUrl, [Validators.required]]
    });
    this.boatForm.controls['imageUrl'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(url => {
        if (this.boat) {
          this.boat.imageUrl = url;
        }
      });
  }

  onSubmit(): void {
    if (this.boatForm.invalid) {
      this.boatForm.markAllAsTouched();
      this.alertError('FORM.INVALID_FORM');
      return;
    }
    this.isSubmitting = true;
    const formValue = this.boatForm.value;
    const payload: Boat = {
      ...this.boat!,
      ...formValue,
      userId: this.isNewBoat ? this.authService.getCurrentUser()?.id : this.ownerId
    };
    payload.owner = undefined;

    this.boatService.createOrSaveBoat(payload)
      .pipe(finalize(() => this.isSubmitting = false)) 
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.location.back();
          } 
        },
        error: (err) => {
          console.error('Boat save/create error:', err);
        }
      });
  }

  onCancelEdit(): void {
    if (this.isNewBoat) {
      this.goBack();
    } else {
      this.editMode = false;
      this.boatForm.patchValue(this.boat!);
      this.boatForm.markAsPristine();
    }
  }

  onDelete(): void {
    this.boatService.deleteBoatById(this.boat?.id)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (response) => {
          this.delete.emit(this.boat);
          this.location.back();
        },
        error: (err) => {
          console.error('Boat deletion error:', err);
        }
      });
  }

  cancelDelete(): void {
   
  }

  editBoat(): void {
    this.editMode = true;
    this.boatForm.patchValue(this.boat!); 
  }

  goBack(): void {
    this.location.back();
  }

  alertSuccess(key: string): void {
    this.message.success(this.translate.instant(key), { nzDuration: 5000 });
  }

  alertError(key: string): void {
    this.message.error(this.translate.instant(key), { nzDuration: 5000 });
  }
  
  isControlInvalid(controlName: string): boolean {
    const control = this.boatForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}