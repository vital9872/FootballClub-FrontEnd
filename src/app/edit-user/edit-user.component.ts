import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, UserService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'edit-user.component.html' })
export class EditUserComponent implements OnInit {
    editUserForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { 
    }

    public userToEdit:User;

    ngOnInit() {
        this.userToEdit = this.userService.userToEdit;
        this.userToEdit.prevUserName = this.userService.userToEdit.userName;
        console.log(this.userToEdit);
        this.editUserForm = this.formBuilder.group({
            userName: [this.userToEdit.userName, Validators.required],
            role: [this.userToEdit.role, Validators.required]
        });


        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.editUserForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.editUserForm.invalid) {
            return;
        }

        this.loading = true;
        let user = new User();
        user.prevUserName = this.userToEdit.prevUserName;
        user.userName = this.f.userName.value;
        user.role = this.f.role.value;
        console.log(user);
        this.userService.edit(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}
