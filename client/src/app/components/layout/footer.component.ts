import {Component, OnInit} from "@angular/core";
import {CommonService} from "../../services/common.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [ TranslateModule],
    template:`
        <footer class="bg-black text-white">
          <div class="flex flex-col items-center justify-center space-y-2">
            <p class="text-center text-sm flex items-center gap-1" style="padding-top: 10px;">
              {{ 'FOOTER_TEXT_1' | translate }}<span class="text-red-500 text-lg">❤️</span>{{ 'FOOTER_TEXT_2' | translate }}<strong>{{ 'FOOTER_TEXT_3' | translate }}</strong><img src="assets/img/owt.png" alt="Open Web Technology Logo" class="h-6"> Version - {{version}}
            </p>            
          </div>
        </footer>
    `
})
export class FooterComponent implements OnInit {
    version: string = '';

    constructor(private commonService: CommonService) {}

    ngOnInit(): void {
        this.commonService.getVersion().subscribe(ver => this.version = ver);
    }
}
