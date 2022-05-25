import {Component, OnInit} from "@angular/core";
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';
import { MessageService } from "../../services/message.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };
  heroes: Hero[] = [];
  // selectedHero?: Hero;

  constructor(
    private _heroService: HeroService,
    private _messageService: MessageService,
  ) {}

  ngOnInit() {
    this.getHeroes();
  }

  // onSelect(hero: Hero) {
  //   this.selectedHero = hero;
  //   this._messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }

  getHeroes(): void {
    this._heroService.getHeroes()
      .subscribe(heroes => {
        this.heroes = heroes
      })
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this._heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    // 从列表中移除要删除的英雄
    this.heroes = this.heroes.filter(h => h !== hero);
    // 删除
    this._heroService.deleteHero(hero.id).subscribe();
  }
}
