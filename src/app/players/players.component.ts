import {
    Component,
    ComponentFactoryResolver,
    OnInit,
    ViewChild,
  } from '@angular/core';
  import { ActivatedRoute, Params, Router } from '@angular/router';


import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { RefDirective } from '@app/directives/refDirective';
import { CompletePaginationParams } from '@app/_models/Pagination/completePaginationParameters';
import { PlayerService } from '@app/_services/player.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { Player } from '@app/_models/player';
import { FormBuilder } from '@angular/forms';
import { Position } from '@app/_models/position';
import { DatePipe } from '@angular/common'
  
  @Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.scss'],
  })
  export class PlayersComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    playerDisplayColumns: string[] = [
      "Firstname",
      'Lastname',
      'Position',
      'Birth'
    ];
    playerProperties: string[] = ['firstName', 'lastName', 'position', 'birthString'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['firstName', 'lastName'];
    totalSize: number;
    searchForm: FormGroup;
    players: Player[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private playerService: PlayerService,
      private formBuilder: FormBuilder,
      public datepipe: DatePipe
    ) {}
  
    public ngOnInit(): void {

      // this.routeActive.queryParams.subscribe((params: Params) => {
      //   this.queryParams = this.queryParams.mapFromQuery(params);
      //   this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
      //     ? this.queryParams.sort.orderByField
      //     : 'id';
      //     const searchFilter: FilterParameters = this.queryParams?.filters?.find(
      //       (queryFilter) => this.fieldsForSearch.includes(queryFilter.propertyName)
      //     );
      //     this.searchForm = this.formBuilder.group({
      //       searchField: ['', Validators.required]
      //     });
      //     this.getPlayers(this.queryParams);
      // });

      this.routeActive.queryParams.subscribe((params: Params) => {
        this.queryParams = this.queryParams.mapFromQuery(params);
        this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
          ? this.queryParams.sort.orderByField
          : 'id';
        const searchFilter: FilterParameters = this.queryParams?.filters?.find(
          (queryFilter) => this.fieldsForSearch.includes(queryFilter.propertyName)
        );
        this.buildSearchForm(searchFilter?.value);
        this.getPlayers(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getPlayers(params: CompletePaginationParams){
      this.playerService.getAll(params).pipe().subscribe(players => {
        this.players = players.page;
        this.players.forEach(p => p.birthString = this.datepipe.transform(p.birth, 'dd-MM-yyyy'));
    });
    }

    public editPlayer(player: Player){
      console.log(player);
      this.playerService.player = player;
      this.router.navigate(['add-player'], {queryParams: {action: 'edit'}});
    }

    public deletePlayer(player: Player){
      this.playerService.delete(player.id).subscribe(data => {
        let players = this.players.filter(u => u.id !== player.id);
        this.players = players;
    });
    }
  
    public get searchField(): AbstractControl {
        return this.searchForm.get('searchField');
    }
  
  
    public search(searchText: string): void {
      const searchFilter: FilterParameters = this.queryParams?.filters?.find(
        (queryFilter) => this.fieldsForSearch.includes(queryFilter.propertyName)
      );
      if (searchFilter?.value === searchText) {
        return;
      }
  
      this.queryParams.page = 1;
      for (const fieldForSearch of this.fieldsForSearch) {
        const searchFilterIndex: number = this.queryParams?.filters?.findIndex(
          (queryFilter) => queryFilter.propertyName === fieldForSearch
        );
        if (searchFilterIndex !== -1) {
          this.queryParams?.filters?.splice(searchFilterIndex, 1);
        }
  
        this.queryParams.filters.push({
          propertyName: fieldForSearch,
          value: searchText,
        });
      }
  
      this.changeUrl();
  }

  public onPageChanged(page: number): void {
    this.queryParams.page = page;
    this.queryParams.firstRequest = false;

    this.changeUrl();
  }
  
  private changeUrl(): void {
    this.router.navigate(['.'], {
      relativeTo: this.routeActive,
      queryParams: this.queryParams.getQueryObject(),
    });
  }
  
    public onChangeSort(): void {
      this.changeUrl();
    }
  
    public pageChanged(currentPage: number): void {
      this.queryParams.page = currentPage;
      this.queryParams.firstRequest = false;
      this.changeUrl();
    }

    public onSortHeaderChanged(): void {
      this.changeUrl();
    }
  
    // Form
    public mergeClear(): void {
      this.selectedRows = [];
    }

    public addPlayer(): void {
      this.router.navigate(['add-player'], {queryParams: {action: 'add'}});
    }  
  }
  