import { Location } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Match } from '@app/_models/match';
import { Player } from '@app/_models/player';
import { PlayerMatches } from '@app/_models/playerMatches';
import { MatchService } from '@app/_services/match.service';
import { PlayerService } from '@app/_services/player.service';
import { PlayerMatchesService } from '@app/_services/playerMatches.service';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './match-view.component.html',
  styleUrls: ['./match-view.component.scss'],
})
export class MatchViewComponent implements OnInit {
  public match: Match;
  public players: Player[]
  public playerMatches: PlayerMatches[];
  public selectedPlayer: Player;
  public activeBooksExist: boolean;
  public currentUserId: number;
  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private matchService: MatchService,
    private playerService: PlayerService,
    private playerMatchesService: PlayerMatchesService
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((id) => {
        this.loadMatch(+id);
        this.getPlayers();
        this.buildForm();
      });
  }

  private loadMatch(id: number): void {
    this.matchService.getById(id).subscribe((match) => {
      this.match = match;
      this.playerMatches = match.playerMatches;
    });
  }

  public buildForm(): void {
  this.form = new FormGroup({
    matchId: new FormControl({ value: this.match?.id, disabled: true }),
    player: new FormControl(),
    goals: new FormControl([
      Validators.min(0),
      Validators.max(20)
    ]),
    assists: new FormControl([
      Validators.min(0),
      Validators.max(20)
    ])
  });
}

public submit(): void {
  this.form.markAllAsTouched();
  if (this.form.invalid) {
    return;
  }

  let playerMatch = new PlayerMatches();


  playerMatch = {
    matchId: this.match.id,
    player:{
        id: +this.form.get('player').value,
    },
    goals: this.form.get('goals').value,
    assists: this.form.get('assists').value,
  };
  console.log(playerMatch);
  this.addPlayerMatch(playerMatch);
}

public getPlayers(){
    this.playerService.getAllWithoutParams().pipe().subscribe(players => {
      this.players = players;
  });
  }

  public deletePlayerMatch(playerMatch: PlayerMatches){
      console.log(playerMatch);
    this.playerMatchesService.delete(playerMatch).subscribe(data => {
        this.loadMatch(this.match?.id);
  });
  }

  public addPlayerMatch(playerMatch: PlayerMatches){
      this.playerMatchesService.post(playerMatch).subscribe(data => {
          this.playerMatches.push(data);
          this.loadMatch(this.match?.id);
      })
  }
}


