import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Payment } from '@app/_models/payment';
import { PaymentService } from '@app/_services/payment.service';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';
import { TournamentService } from '@app/_services/tournaments.service';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit {
  payment: Payment;
  action: FormAction = FormAction.Add;
  durations= ['30m', '60m', '1h', '1h:30m','2h'];
  paymentTypes;
  title: string;
  submitButtonText: string;
  form: FormGroup;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private paymentService: PaymentService,
    private tournamentService: TournamentService,
    public enumToArray: EnumToArrayPipe,
    public datepipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.payment = {};
    this.payment = this.paymentService.payment;
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " payment";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
      console.log(this.payment);
    this.form = new FormGroup({
      id: new FormControl({ value: this.payment?.id, disabled: true }),
      amount: new FormControl(this.payment?.amount, [
        Validators.min(0)
      ]),
      date: new FormControl(this.payment?.date),
      description: new FormControl(this.payment?.description)
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.payment = {
        amount: this.form.get('amount').value,
        date: this.form.get('date').value,
        description: this.form.get('description').value,
    };

    console.log(this.payment);
    if (this.action !== FormAction.Add) {
      this.payment.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updatePayment(this.payment);
        break;
      default:
        this.addPayment(this.payment);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addPayment(payment: Payment): void {
    console.log(payment);
    this.paymentService.post(payment).subscribe(
      (data: Payment) => {
        this.cancel();
      },
    );
  }


  public updatePayment(payment: Payment): void {
    this.paymentService.put(payment).subscribe(
      (data: Payment) => {
        this.cancel();
      },
    );
  }


}
