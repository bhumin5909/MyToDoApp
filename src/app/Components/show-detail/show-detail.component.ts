import { Component, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FirebaseDataService } from 'src/app/Services/firebase-data.service';

@Component({
  selector: 'app-show-detail',
  templateUrl: './show-detail.component.html',
  styleUrls: ['./show-detail.component.css']
})
export class ShowDetailComponent {
  firebServ: FirebaseDataService = inject(FirebaseDataService);
  tdSub!: Subscription;

  @ViewChild('taskForm') form!: NgForm;

  ngOnInit(): void {
    this.tdSub = this.firebServ.taskDisSubject.subscribe(task => {
      this.form.form.patchValue(task);
    })
  }

  ngOnDestroy(): void {
    this.tdSub.unsubscribe();
  }
}
