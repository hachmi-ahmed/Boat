import {Component, OnInit} from "@angular/core";
import { CommonModule, AsyncPipe } from '@angular/common';
import {CommonService} from "../../services/common.service";
import {TranslateModule} from "@ngx-translate/core";

import { ScreenService } from '../../services/screen.service';
import {catchError, of} from "rxjs";

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [ CommonModule, TranslateModule, AsyncPipe ],
    template:`
        <footer class="bg-black text-white">
          <div class="flex flex-col items-center justify-center space-y-2">
              <ng-container *ngIf="(screen.isMobile$ | async) === false">
                  <p class="text-center text-sm flex items-center gap-1" style="padding-top: 10px;">
                      {{ 'FOOTER_TEXT_1' | translate }}
                      <span class="text-red-500 text-lg">❤️</span>
                      {{ 'FOOTER_TEXT_2' | translate }}
                      <strong>{{ 'FOOTER_TEXT_3' | translate }}</strong>
                      - Version : {{ version }}
                  </p>
              </ng-container>

              <ng-container *ngIf="(screen.isMobile$ | async) === true">
                  <p class="text-center text-sm flex items-center gap-1" style="padding-top: 10px;">
                      {{ 'FOOTER_TEXT_MOBILE_1' | translate }}
                      <strong>{{ 'FOOTER_TEXT_3' | translate }}</strong>
                      <img src="assets/img/owt.png" alt="Open Web Technology Logo" class="h-6">
                      - Version : {{ version }}
                  </p>
              </ng-container>
           
          </div>
        </footer>
    `
})
export class FooterComponent implements OnInit {
    version: string = '';

    constructor(private commonService: CommonService, public screen: ScreenService) {}

    ngOnInit(): void {
        this.commonService.getVersion()
            .pipe(
                catchError(error => {
                    console.error('Error fetching version info', error);
                    // You can also show a message to the user or set a default value
                    return of({ build: { version: 'unknown' } });
                })
            )
            .subscribe(infos => {
                this.version = infos.build.version;
            });
    }

}
