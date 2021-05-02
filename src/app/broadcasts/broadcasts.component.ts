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
import { BroadcastService } from '@app/_services/broadcast.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { MatchBroadcast } from '@app/_models/matchBroadcast';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'

  
  @Component({
    selector: 'app-broadcasts',
    templateUrl: './broadcasts.component.html',
    styleUrls: ['./broadcasts.component.scss'],
  })
  export class BroadcastsComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    broadcastDisplayColumns: string[] = [
      "Name",
      'Tournament Type',
      'Payment',
    ];
    broadcastProperties: string[] = ['name', 'matchTournamentName', 'payment'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['name'];
    totalSize: number;
    searchForm: FormGroup;
    broadcasts: MatchBroadcast[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private broadcastService: BroadcastService,
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
        this.getBroadcasts(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getBroadcasts(params: CompletePaginationParams){
      this.broadcastService.getAll(params).pipe().subscribe(broadcasts => {
        this.broadcasts = broadcasts.page;
    });
    }

    public editBroadcast(broadcast: MatchBroadcast){
      console.log(broadcast);
      this.broadcastService.broadcast = broadcast;
      this.router.navigate(['add-broadcast'], {queryParams: {action: 'edit'}});
    }

    public deleteBroadcast(broadcast: MatchBroadcast){
      this.broadcastService.delete(broadcast.id).subscribe(data => {
        let broadcasts = this.broadcasts.filter(u => u.id !== broadcast.id);
        this.broadcasts = broadcasts;
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

    public addBroadcast(): void {
      this.router.navigate(['add-broadcast'], {queryParams: {action: 'add'}});
    }  
  }
  