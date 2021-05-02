import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Income } from '@app/_models/income';
import { IncomeService } from '@app/_services/income.service';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';
import { TournamentService } from '@app/_services/tournaments.service';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss'],
})
export class IncomeFormComponent implements OnInit {
  income: Income;
  action: FormAction = FormAction.Add;
  durations= ['30m', '60m', '1h', '1h:30m','2h'];
  incomeTypes;
  title: string;
  submitButtonText: string;
  form: FormGroup;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private incomeService: IncomeService,
    private tournamentService: TournamentService,
    public enumToArray: EnumToArrayPipe,
    public datepipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.income = {};
    this.income = this.incomeService.income;
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " income";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
      console.log(this.income);
    this.form = new FormGroup({
      id: new FormControl({ value: this.income?.id, disabled: true }),
      amount: new FormControl(this.income?.amount, [
        Validators.min(0)
      ]),
      date: new FormControl(this.income?.date),
      description: new FormControl(this.income?.description)
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.income = {
        amount: this.form.get('amount').value,
        date: this.form.get('date').value,
        description: this.form.get('description').value,
    };

    console.log(this.income);
    if (this.action !== FormAction.Add) {
      this.income.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updateIncome(this.income);
        break;
      default:
        this.addIncome(this.income);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addIncome(income: Income): void {
    console.log(income);
    this.incomeService.post(income).subscribe(
      (data: Income) => {
        this.cancel();
      },
    );
  }


  public updateIncome(income: Income): void {
    this.incomeService.put(income).subscribe(
      (data: Income) => {
        this.cancel();
      },
    );
  }


}
