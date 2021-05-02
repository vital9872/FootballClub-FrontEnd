import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Player } from '@app/_models/player';
import { PlayerService } from '@app/_services/player.service';
import { Position } from '@app/_models/position';
import { EnumToArrayPipe } from '@app/_helpers/enumToArrayPipe';

enum FormAction {
  Edit = 'edit',
  Add = 'add'
}

@Component({
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  player: Player;

  action: FormAction = FormAction.Add;

  positions;
  title: string;
  submitButtonText: string;
  form: FormGroup;

  constructor(
    private router: ActivatedRoute,
    private location: Location,
    private playerService: PlayerService,
    public enumToArray: EnumToArrayPipe
  ) {}

  public ngOnInit(): void {
    this.player = {};
    this.player.contract = {};
    console.log(this.playerService.player);
    this.player = this.playerService.player;
    this.positions = this.enumToArray.transform(Position);
    this.router.queryParams
      .subscribe(params => {
        this.action = params.action;
        this.title = this.action[0].toUpperCase() + this.action.slice(1) + " player";
      }
    );

    this.submitButtonText = this.action.toLocaleUpperCase();
    this.buildForm();
  }

  public buildForm(): void {
    this.form = new FormGroup({
      id: new FormControl({ value: this.player?.id, disabled: true }),
      firstName: new FormControl(this.player?.firstName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        /* tslint:disable */
        Validators.pattern("^([(a-zA-Z||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ)'-]+)$"),
        /* tslint:enable */
      ]),
      lastName: new FormControl(this.player?.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        /* tslint:disable */
        Validators.pattern("^([(a-zA-Z||а-щА-ЩЬьЮюЯяЇїІіЄєҐґыЫэЭ)'-]+)$"),
        /* tslint:enable */
      ]),
      position: new FormControl(this.player?.position),
      birth: new FormControl(this.player?.birth, [
          Validators.required
      ]),
      salary: new FormControl(this.player?.contract.salary, [
          Validators.required,
          Validators.min(0)
      ]),
      premium: new FormControl(this.player?.contract.premium, [
        Validators.min(0),
        Validators.max(100)
      ]),
      price: new FormControl(this.player?.contract.price, [
        Validators.min(0)
      ]),
      expireDate: new FormControl(this.player?.contract.expireDate)
    });
  }

  public submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.player = {
      firstName: this.form.get('firstName').value,
      lastName: this.form.get('lastName').value,
      position: this.form.get('position').value,
      birth: this.form.get('birth').value,
      contract: {
          salary: this.form.get('salary').value,
          premium: this.form.get('premium').value,
          price: this.form.get('price').value,
          signedDate: new Date(),
          expireDate: this.form.get('expireDate').value
      }
    };
    if (this.action !== FormAction.Add) {
      this.player.id = this.form.get('id').value;
    }

    switch (this.action) {
      case FormAction.Edit:
        this.updatePlayer(this.player);
        break;
      default:
        this.addPlayer(this.player);
        break;
    }
  }

  public cancel(): void {
    this.location.back();
  }

  public addPlayer(player: Player): void {
    this.playerService.post(player).subscribe(
      (data: Player) => {
        this.cancel();
      },
    );
  }

  public updatePlayer(player: Player): void {
    this.playerService.put(player).subscribe(
      (data: Player) => {
        this.cancel();
      },
    );
  }

}
