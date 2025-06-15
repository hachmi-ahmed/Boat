import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScreenService {
    private breakpointObserver = inject(BreakpointObserver);

    readonly isMobile$: Observable<boolean> = this.breakpointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Handset])
        .pipe(
            map(result => result.matches),
            shareReplay({ refCount: true, bufferSize: 1 })
        );
}
