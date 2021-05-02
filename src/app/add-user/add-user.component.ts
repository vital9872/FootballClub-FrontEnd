import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, UserService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'add-user.component.html' })
export class AddUserComponent implements OnInit {
    addUserForm: FormGroup;
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

    ngOnInit() {
        this.addUserForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
            role: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.addUserForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.addUserForm.invalid) {
            return;
        }

        this.loading = true;
        let user = new User();
        user.userName = this.f.userName.value;
        user.password = this.f.password.value;
        user.role = this.f.role.value;
        this.userService.create(user)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
        this.router.navigate['/admin'];
    }
}
