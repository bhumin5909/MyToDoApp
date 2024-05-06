import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskShowComponent } from './task-show.component';

describe('TaskShowComponent', () => {
  let component: TaskShowComponent;
  let fixture: ComponentFixture<TaskShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskShowComponent]
    });
    fixture = TestBed.createComponent(TaskShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
