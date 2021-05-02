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
import { IncomeService } from '@app/_services/income.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { Income } from '@app/_models/income';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'
import * as jspdf from 'jspdf';  
  
import html2canvas from 'html2canvas'; 

  
  @Component({
    selector: 'app-incomes',
    templateUrl: './incomes.component.html',
    styleUrls: ['./incomes.component.scss'],
  })
  export class IncomesComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    incomeDisplayColumns: string[] = [
      "Amount",
      'Date',
      'Description'
    ];
    incomeProperties: string[] = ['amount', 'date', 'description'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['description'];
    totalSize: number;
    searchForm: FormGroup;
    incomes: Income[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private incomeService: IncomeService,
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
        this.getIncome(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getIncome(params: CompletePaginationParams){
      this.incomeService.getAll(params).pipe().subscribe(incomes => {
        this.incomes = incomes.page;
        this.incomes.forEach(p => p.dateString = this.datepipe.transform(p.date, 'dd-MM-yyyy, H:mm'));
    });
    }

    public editIncome(income: Income){
      console.log(income);
      this.incomeService.income = income;
      this.router.navigate(['add-income'], {queryParams: {action: 'edit'}});
    }

    public deleteIncome(income: Income){
      this.incomeService.delete(income.id).subscribe(data => {
        let incomes = this.incomes.filter(u => u.id !== income.id);
        this.incomes = incomes;
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

    public onViewButtonClicked(income: Income) {
        this.router.navigate(['income', income.id]);
    }

    public addIncome(): void {
      this.router.navigate(['add-income'], {queryParams: {action: 'add'}});
    }  

    public addPlayerIncome(): void {
        this.incomeService.postPlayerIncome().subscribe(
          (data: Income) => {
            this.getIncome(this.queryParams);
          },
        );
      }

      public addMatchIncome(): void {
        this.incomeService.postMatchIncome().subscribe(
          (data: Income) => {
            this.getIncome(this.queryParams);
          },
        );
      }

      public printIncome(){
        var data = document.getElementById('contentToConvert');  
        html2canvas(data).then(canvas => {  
          // Few necessary setting options  
          var imgWidth = 208;   
          var pageHeight = 295;    
          var imgHeight = canvas.height * imgWidth / canvas.width;  
          var heightLeft = imgHeight;  
      
          const contentDataURL = canvas.toDataURL('image/png')  
          let pdf = new jspdf.jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
          var position = 0;  
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
          pdf.save('MYPdf.pdf'); // Generated PDF   
        }); 
      }
  }
  