import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  // Subject 既是可观察对象的数据源，本身也是 Observable
  private searchTerms = new Subject<string>();

  constructor(private _heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    // 调用它的 next(value) 方法往 Observable 中推送一些值
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // 往 searchTerms 这个可观察对象的处理管道中加入了一系列 RxJS 操作符，用以缩减对 searchHeroes() 的调用次数
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this._heroService.searchHeroes(term)),
    );
  }
}
