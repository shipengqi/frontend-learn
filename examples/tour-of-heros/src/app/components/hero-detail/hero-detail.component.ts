import { Component, Input } from "@angular/core";
import { Hero } from '../../hero';
// ActivatedRoute 保存着到这个 HeroDetailComponent 实例的路由信息
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from "../../services/hero.service";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent {
  // @Input() hero?: Hero;
  hero: Hero | undefined;

  constructor(
    private _route: ActivatedRoute,
    private _heroService: HeroService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    // route.snapshot 是一个路由信息的静态快照
    // paramMap 是一个从 URL 中提取的路由参数值的字典
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this._heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  save(): void {
    if (this.hero) {
      this._heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }
}
