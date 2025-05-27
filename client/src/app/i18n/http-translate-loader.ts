import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export class HttpTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    const localUrl = `/assets/i18n/${lang}.json`;
    const backendUrl = `/api/i18n/${lang}`;

    return forkJoin({
      local: this.http.get(localUrl),
      backend: this.http.get(backendUrl)
    }).pipe(
      map(({ local, backend }) => ({
        ...local,
        ...backend // backend keys override local if duplicated
      }))
    );
  }
}
