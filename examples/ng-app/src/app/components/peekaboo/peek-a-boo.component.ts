import { 
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DoCheck,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core'

@Component({
    selector: 'peek-a-boo',
    template: '<p>Noew you see my hero, {{ name }}</p>'
})
export class PeekABooComponent implements 
             OnChanges, OnInit, DoCheck,
             AfterContentInit, AfterContentChecked,
             AfterViewInit, AfterViewChecked,
             OnDestroy {
    @Input() name = '';

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        console.log('OnChanges')
    }

    ngOnInit() { console.log('OnInit');  }
    ngDoCheck() { console.log('DoCheck'); }

    ngAfterContentInit() { console.log('AfterContentInit');  }

    // Beware! Called frequently!
    // Called in every change detection cycle anywhere on the page
    ngAfterContentChecked() { console.log('AfterContentChecked'); }
  
    ngAfterViewInit() { console.log('AfterViewInit'); }

    // Beware! Called frequently!
    // Called in every change detection cycle anywhere on the page
    ngAfterViewChecked() { console.log('AfterViewChecked'); }

    ngOnDestroy() { console.log('OnDestroy'); }
}