import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, User } from '@app/_models';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-admin',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public isSideBarOpened = false;
  public showTableManagement = false;
  public showTimeSpans = false;
  constructor(private router: Router, private routeActive: ActivatedRoute, 
    private authenticationService: AuthenticationService) {}
    currentUser: User;
  public ngOnInit(): void {
    const activeChild = this.routeActive.children.length;
    if (activeChild === 0) {
      this.router.navigate(['dashboard'], { relativeTo: this.routeActive });
    }
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  public ngOnDestroy(): void {}

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
}


get isAccountant() {
  return this.currentUser && this.currentUser.role === Role.Accountant;
}

get isManager() {
  return this.currentUser && this.currentUser.role === Role.Manager;
}


}
