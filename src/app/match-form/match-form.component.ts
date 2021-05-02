import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { Match } from '@app/_models/match';
import { MatchService } from '@app/_services/match.service';
import { Position } from '@app/_models/position';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';
import { MatchTournament } from '@app/_models/matchTournament';
import { TournamentService } from '@app/_services/tournaments.service';
import { MatchLocation } from '@app/_models/matchLocation';
import { Player } from '@app/_models/player';
import { PlayerService } from '@app/_services/player.service';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.scss'],
})
export class MatchFormComponent implements OnInit {
  match: Match;
  action: FormAction = FormAction.Add;
  tournaments: MatchTournament[];
  selectedTournament: MatchTournament;
  locations;
  selectedLocation: MatchLocation;
  title: string;
  submitButtonText: string;
  form: FormGroup;


  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private matchService: MatchService,
    private tournamentService: TournamentService,
    public enumToArray: EnumToArrayPipe,
    public datepipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.match = {};
    this.match = this.matchService.match;
    this.locations = this.enumToArray.transform(MatchLocation);
    this.getTournaments();
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " match";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
      console.log(this.match);
    this.form = new FormGroup({
      id: new FormControl({ value: this.match?.id, disabled: true }),
      team1Goals: new FormControl(this.match?.team1Goals, [
          Validators.required,
          Validators.min(0),
          Validators.max(20)
      ]),
      team2Goals: new FormControl(this.match?.team2Goals, [
          Validators.required,
          Validators.min(0),
          Validators.max(20)
      ]),
      clubEnemyName: new FormControl(this.match?.clubEnemyName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      ticketSales: new FormControl(this.match?.ticketSales, [
        Validators.required,
        Validators.min(0)
      ]),
      outcome: new FormControl(this.match?.outcome, [
        Validators.required,
        Validators.min(0)
      ]),
      startDate: new FormControl(this.match?.startDate),
      matchLocation: new FormControl(this.match?.matchLocation),
      matchTournament: new FormControl(this.tournaments?.filter(x => x.id === this.match?.matchTournamentId)[0])
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.selectedTournament = this.tournaments.filter(x => x.name === this.form.get('matchTournament').value)[0] ?? this.tournaments[0];
    this.match = {
      team1Goals: this.form.get('team1Goals').value,
      team2Goals: this.form.get('team2Goals').value,
      clubEnemyName: this.form.get('clubEnemyName').value,
      ticketSales: this.form.get('ticketSales').value,
      outcome: this.form.get('outcome').value,
      startDate: this.form.get('startDate').value,
      matchLocation: this.form.get('matchLocation').value,
      matchTournamentId: this.selectedTournament.id
    };

    console.log(this.match);
    if (this.action !== FormAction.Add) {
      this.match.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updateMatch(this.match);
        break;
      default:
        this.addMatch(this.match);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addMatch(match: Match): void {
    console.log(match);
    this.matchService.post(match).subscribe(
      (data: Match) => {
        this.cancel();
      },
    );
  }

  public updateMatch(match: Match): void {
    this.matchService.put(match).subscribe(
      (data: Match) => {
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
