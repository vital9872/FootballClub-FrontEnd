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
import { MatchService } from '@app/_services/match.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { Match } from '@app/_models/match';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'

  
  @Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.scss'],
  })
  export class MatchesComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    matchDisplayColumns: string[] = [
      "Enemy",
      'Location',
      'Date'
    ];
    matchProperties: string[] = ['clubEnemyName', 'matchLocation', 'startDateString'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['clubEnemyName'];
    totalSize: number;
    searchForm: FormGroup;
    matches: Match[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private matchService: MatchService,
      private formBuilder: FormBuilder,
      public datepipe: DatePipe
    ) {}
  
    public ngOnInit(): void {
      this.routeActive.queryParams.subscribe((params: Params) => {
        this.queryParams = this.queryParams.mapFromQuery(params);
        this.queryParams.sort.orderByField = this.queryParams.sort.orderByField
          ? this.queryParams.sort.orderByField
          : 'id';
        const searchFilter: FilterParameters = this.queryParams?.filters?.find(
          (queryFilter) => this.fieldsForSearch.includes(queryFilter.propertyName)
        );
        this.buildSearchForm(searchFilter?.value);
        this.getMatch(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getMatch(params: CompletePaginationParams){
      this.matchService.getAll(params).pipe().subscribe(matches => {
        this.matches = matches.page;
        this.matches.forEach(p => p.startDateString = this.datepipe.transform(p.startDate, 'dd-MM-yyyy, H:mm'));
    });
    }

    public editMatch(match: Match){
      console.log(match);
      this.matchService.match = match;
      this.router.navigate(['add-match'], {queryParams: {action: 'edit'}});
    }

    public deleteMatch(match: Match){
      this.matchService.delete(match.id).subscribe(data => {
        let matches = this.matches.filter(u => u.id !== match.id);
        this.matches = matches;
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

    public onViewButtonClicked(match: Match) {
        this.router.navigate(['matches', match.id]);
    }

    public addMatch(): void {
      this.router.navigate(['add-match'], {queryParams: {action: 'add'}});
    }  
  }
  