import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/Models/task';
import { FirebaseDataService } from 'src/app/Services/firebase-data.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-show',
  templateUrl: './task-show.component.html',
  styleUrls: ['./task-show.component.css']
})
export class TaskShowComponent {
  firebaseServ: FirebaseDataService = inject(FirebaseDataService);

  todo:Task[] = [];
  inprogress:Task[] = [];
  underReview:Task[] = [];
  ready:Task[] = [];

  dropListName:string[] = ["To Do", "In Progress", "Under Review","Ready"];

  Alltasks: Task[] = [];

  errorMessage: string | null = null;

  firesub!: Subscription;
  ngOnInit(): void {
    this.firebaseServ.getAllData();
    this.firesub = this.firebaseServ.firebaseSubject.subscribe({
      next: (data: Task[]) => {
        this.todo = data.filter((task)=> task.taskstatus === "To Do");
        this.inprogress = data.filter((task)=> task.taskstatus === "In Progress");
        this.underReview = data.filter((task)=> task.taskstatus === "Under Review");
        this.ready = data.filter((task)=> task.taskstatus === "Ready");
      },
      error: (error) => {
        this.errorMessage = error.error.error;
        setTimeout(() => { this.errorMessage = null }, 5000);
      }
    });
  }

  ngOnDestroy() {
    this.firesub.unsubscribe();
  }


  refreshTrack(id: number, tsk: Task): string {
    return tsk.taskname;
  }

  deleteTask(id: string | undefined): void {
    if (id !== undefined)
      this.firebaseServ.deleteTask(id);
  }
  editTask(tk: Task): void {
    this.firebaseServ.EditTask(tk);
  }
  showTaskDetail(tk: Task): void {
    this.firebaseServ.taskToDisplay(tk);
  }


  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      event.previousContainer.data[event.previousIndex].taskstatus = this.dropListName[ event.container.id.at(-1) as unknown as number];
    this.firebaseServ.uploadData(event.previousContainer.data[event.previousIndex].id, event.previousContainer.data[event.previousIndex])
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}

