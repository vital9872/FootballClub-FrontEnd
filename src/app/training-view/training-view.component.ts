import { Location } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Training } from '@app/_models/training';
import { Player } from '@app/_models/player';
import { PlayerTraining } from '@app/_models/playerTraining';
import { TrainingService } from '@app/_services/training.service';
import { PlayerService } from '@app/_services/player.service';
import { PlayerTrainingService } from '@app/_services/playerTraining.service';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './training-view.component.html',
  styleUrls: ['./training-view.component.scss'],
})
export class TrainingViewComponent implements OnInit {
  public training: Training;
  public players: Player[]
  public playerTraining: PlayerTraining[];
  public selectedPlayer: Player;
  public activeBooksExist: boolean;
  public currentUserId: number;
  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private trainingService: TrainingService,
    private playerService: PlayerService,
    private playerTrainingService: PlayerTrainingService
  ) {
  }

  public ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((id) => {
        this.loadTraining(+id);
        this.getPlayers();
        this.buildForm();
      });
  }

  private loadTraining(id: number): void {
    this.trainingService.getById(id).subscribe((training) => {
      this.training = training;
      this.playerTraining = training.playerTrainings;
    });
  }

  public buildForm(): void {
  this.form = new FormGroup({
    trainingId: new FormControl({ value: this.training?.id, disabled: true }),
    player: new FormControl(),
    shooting: new FormControl([Validators.min(0), Validators.max(10)]),
    speed: new FormControl([Validators.min(0), Validators.max(10)]),
    dribling: new FormControl([Validators.min(0), Validators.max(10)]),
    defensive: new FormControl([Validators.min(0), Validators.max(10)])
  });
}

public submit(): void {
  this.form.markAllAsTouched();
  if (this.form.invalid) {
    return;
  }

  let playerTraining = new PlayerTraining();


  playerTraining = {
    trainingId: this.training.id,
    player:{
        id: +this.form.get('player').value,
    },
    shooting: this.form.get('shooting').value,
    speed: this.form.get('speed').value,
    dribling: this.form.get('dribling').value,
    defensive: this.form.get('defensive').value,
  };
  console.log(playerTraining);
  this.addPlayerTraining(playerTraining);
}

public getPlayers(){
    this.playerService.getAllWithoutParams().pipe().subscribe(players => {
      this.players = players;
  });
  }

  public deletePlayerTraining(playerTraining: PlayerTraining){
      console.log(playerTraining);
    this.playerTrainingService.delete(playerTraining).subscribe(data => {
        this.loadTraining(this.training?.id);
  });
  }

  public addPlayerTraining(playerTraining: PlayerTraining){
      this.playerTrainingService.post(playerTraining).subscribe(data => {
          this.playerTraining.push(data);
          this.loadTraining(this.training?.id);
      })
  }
}


