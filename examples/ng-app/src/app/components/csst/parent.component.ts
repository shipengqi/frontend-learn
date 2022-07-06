import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <p>Parent Component</p>
    <app-a></app-a>
    <app-b></app-b>
  `,
  styles: ['::ng-deep p { color: red; }'] // 在父组件的 styles 里给 p 标签加上样式
})
export class ParentComponent {}
