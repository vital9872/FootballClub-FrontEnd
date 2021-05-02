import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatchBroadcast } from '@app/_models/matchBroadcast';
import { BroadcastService } from '@app/_services/broadcast.service';
import { Position } from '@app/_models/position';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';
import { MatchTournament } from '@app/_models/matchTournament';
import { TournamentService } from '@app/_services/tournaments.service';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './broadcast-form.component.html',
  styleUrls: ['./broadcast-form.component.scss'],
})
export class BroadcastFormComponent implements OnInit {
  broadcast: MatchBroadcast;

  action: FormAction = FormAction.Add;
  tournaments: MatchTournament[];
  selectedTournament: MatchTournament;
  title: string;
  submitButtonText: string;
  form: FormGroup;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private broadcastService: BroadcastService,
    private tournamentService: TournamentService
  ) {}

  public ngOnInit(): void {
    this.broadcast = {};
    this.broadcast = this.broadcastService.broadcast;
    this.getTournaments();
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " broadcast";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
    this.form = new FormGroup({
      id: new FormControl({ value: this.broadcast?.id, disabled: true }),
      name: new FormControl(this.broadcast?.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      payment: new FormControl(this.broadcast?.payment, [
        Validators.required,
        Validators.min(0)
      ]),
      tournament: new FormControl()
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.selectedTournament = this.tournaments.filter(x => x.name === this.form.get('tournament').value)[0] ?? this.tournaments[0];
    this.broadcast = {
      name: this.form.get('name').value,
      payment: this.form.get('payment').value,
      matchTournamentId: this.selectedTournament.id,
      matchTournamentName: this.selectedTournament.name,
      defaultPayment: this.selectedTournament.defaultPayment
    };

    if (this.action !== FormAction.Add) {
      this.broadcast.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updateBroadcast(this.broadcast);
        break;
      default:
        this.addBroadcast(this.broadcast);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addBroadcast(broadcast: MatchBroadcast): void {
    console.log(broadcast);
    this.broadcastService.post(broadcast).subscribe(
      (data: MatchBroadcast) => {
        this.cancel();
      },
    );
  }

  public updateBroadcast(broadcast: MatchBroadcast): void {
    this.broadcastService.put(broadcast).subscribe(
      (data: MatchBroadcast) => {
        this.cancel();
      },
    );
  }

  public getTournaments(){
    this.tournamentService.getAll().pipe().subscribe(tournaments => {
      this.tournaments = tournaments;
      this.selectedTournament = this.tournaments[0];
  });
  }

}
