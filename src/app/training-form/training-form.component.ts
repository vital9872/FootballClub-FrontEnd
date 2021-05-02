import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Training } from '@app/_models/training';
import { TrainingService } from '@app/_services/training.service';
import { Position } from '@app/_models/position';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';
import { TournamentService } from '@app/_services/tournaments.service';
import { Player } from '@app/_models/player';
import { PlayerService } from '@app/_services/player.service';
import { TrainingType } from '@app/_models/trainingType';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './training-form.component.html',
  styleUrls: ['./training-form.component.scss'],
})
export class TrainingFormComponent implements OnInit {
  training: Training;
  action: FormAction = FormAction.Add;
  durations= ['30m', '60m', '1h', '1h:30m','2h'];
  trainingTypes;
  selectedType: TrainingType;
  title: string;
  submitButtonText: string;
  form: FormGroup;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private trainingService: TrainingService,
    private tournamentService: TournamentService,
    public enumToArray: EnumToArrayPipe,
    public datepipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.training = {};
    this.training = this.trainingService.training;
    this.trainingTypes = this.enumToArray.transform(TrainingType);
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " training";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
      console.log(this.training);
    this.form = new FormGroup({
      id: new FormControl({ value: this.training?.id, disabled: true }),
      duration: new FormControl(this.training?.duration),
      trainingType : new FormControl(this.training?.trainingType),
      date: new FormControl(this.training?.date),
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.training = {
      duration: this.form.get('duration').value,
      trainingType: this.form.get('trainingType').value,
      date: this.form.get('date').value,
    };

    console.log(this.training);
    if (this.action !== FormAction.Add) {
      this.training.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updateTraining(this.training);
        break;
      default:
        this.addTraining(this.training);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addTraining(training: Training): void {
    console.log(training);
    this.trainingService.post(training).subscribe(
      (data: Training) => {
        this.cancel();
      },
    );
  }

  public updateTraining(training: Training): void {
    this.trainingService.put(training).subscribe(
      (data: Training) => {
        this.cancel();
      },
    );
  }


}
