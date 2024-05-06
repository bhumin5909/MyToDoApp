import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/Models/task';
import { FirebaseDataService } from 'src/app/Services/firebase-data.service';

@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.css']
})
export class AddTaskFormComponent {
  firebaseServ: FirebaseDataService = inject(FirebaseDataService);

  editTask: Task | undefined;

  editTaskId: string | undefined;
  updateData: boolean = false;
  firesub!:Subscription;
  taskStatus:string = "To Do"
  @ViewChild('taskForm') form!: NgForm;

  ngOnInit(): void {
    this.firesub = this.firebaseServ.editTaskSubject.subscribe(task=>{
      this.editTask = task;
      this.editTaskId = task.id;
      this.updateData = true;
      this.form.form.patchValue(task);
    })
  }

  ngOnDestroy(): void {
    this.firesub.unsubscribe();
  }
  addNewTask(form:NgForm): void {
    this.firebaseServ.uploadData(this.editTaskId,form.value,this.updateData);
    this.closeForm();
  }

  closeForm():void{
    this.editTask = undefined;
    this.editTaskId = undefined;
    this.updateData = false;
    this.form.reset();
  }

}
