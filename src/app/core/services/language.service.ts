import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly STORAGE_KEY = 'hexacare-lang';

  private translate = inject(TranslateService);

  currentLang = signal<AppLanguage>(this._loadPreference());

  constructor() {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
    this.applyLanguage(this.currentLang());
  }

  toggle(): void {
    const next: AppLanguage = this.currentLang() === 'en' ? 'ar' : 'en';
    this.applyLanguage(next);
  }

  applyLanguage(lang: AppLanguage): void {
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);

    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  isArabic(): boolean {
    return this.currentLang() === 'ar';
  }

  private _loadPreference(): AppLanguage {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
    return navigator.language?.startsWith('ar') ? 'ar' : 'en';
  }
}
