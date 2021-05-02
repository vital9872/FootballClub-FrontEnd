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
import { PaymentService } from '@app/_services/payment.service';
import { FilterParameters } from '@app/_models/Pagination/filterParameters';
import { Payment } from '@app/_models/payment';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common'
import * as jspdf from 'jspdf';  
  
import html2canvas from 'html2canvas'; 

  
  @Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss'],
  })
  export class PaymentsComponent implements OnInit {
    @ViewChild(RefDirective, { static: false }) refDir: RefDirective;
  
    paymentDisplayColumns: string[] = [
      "Amount",
      'Date',
      'Description'
    ];
    paymentProperties: string[] = ['amount', 'date', 'description'];
    queryParams: CompletePaginationParams = new CompletePaginationParams();
    fieldsForSearch: string[] = ['name', 'paymentTournamentName'];
    totalSize: number;
    searchForm: FormGroup;
    payments: Payment[];
    selectedRows: any = [];
  
    constructor(
      private routeActive: ActivatedRoute,
      private router: Router,
      private paymentService: PaymentService,
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
        this.getPayment(this.queryParams);
      });
    }
  
    private buildSearchForm(searchText: string): void {
      this.searchForm = new FormGroup({
        searchField: new FormControl(searchText, Validators.maxLength(40)),
      });
    }

    public getPayment(params: CompletePaginationParams){
      this.paymentService.getAll(params).pipe().subscribe(payments => {
        this.payments = payments.page;
        this.payments.forEach(p => p.dateString = this.datepipe.transform(p.date, 'dd-MM-yyyy, H:mm'));
    });
    }

    public editPayment(payment: Payment){
      console.log(payment);
      this.paymentService.payment = payment;
      this.router.navigate(['add-payment'], {queryParams: {action: 'edit'}});
    }

    public deletePayment(payment: Payment){
      this.paymentService.delete(payment.id).subscribe(data => {
        let payments = this.payments.filter(u => u.id !== payment.id);
        this.payments = payments;
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

    public onViewButtonClicked(payment: Payment) {
        this.router.navigate(['payment', payment.id]);
    }

    public addPayment(): void {
      this.router.navigate(['add-payment'], {queryParams: {action: 'add'}});
    }  

    public addPlayerPayment(): void {
        this.paymentService.postPlayerPayment().subscribe(
          (data: Payment) => {
            this.getPayment(this.queryParams);
          },
        );
      }

      public addMatchPayment(): void {
        this.paymentService.postMatchPayment().subscribe(
          (data: Payment) => {
            this.getPayment(this.queryParams);
          },
        );
      }

      public printPayment(){
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
  