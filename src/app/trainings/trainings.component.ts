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
import { TrainingService } from '@app/_services/training.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { Training } from '@app/_models/training';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'

  
  @Component({
    selector: 'app-trainings',
    templateUrl: './trainings.component.html',
    styleUrls: ['./trainings.component.scss'],
  })
  export class TrainingsComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    trainingDisplayColumns: string[] = [
      "Training type",
      'Date',
      'Duration'
    ];
    trainingProperties: string[] = ['trainingType', 'dateString', 'duration'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['trainingType'];
    totalSize: number;
    searchForm: FormGroup;
    trainings: Training[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private trainingService: TrainingService,
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
        this.getTraining(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getTraining(params: CompletePaginationParams){
      this.trainingService.getAll(params).pipe().subscribe(trainings => {
        this.trainings = trainings.page;
        this.trainings.forEach(p => p.dateString = this.datepipe.transform(p.date, 'dd-MM-yyyy, H:mm'));
    });
    }

    public editTraining(training: Training){
      console.log(training);
      this.trainingService.training = training;
      this.router.navigate(['add-training'], {queryParams: {action: 'edit'}});
    }

    public deleteTraining(training: Training){
      this.trainingService.delete(training.id).subscribe(data => {
        let trainings = this.trainings.filter(u => u.id !== training.id);
        this.trainings = trainings;
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

    public onViewButtonClicked(training: Training) {
        this.router.navigate(['training', training.id]);
    }

    public addTraining(): void {
      this.router.navigate(['add-training'], {queryParams: {action: 'add'}});
    }  
  }
  