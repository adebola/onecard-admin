import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {DatePipe} from '@angular/common';
import {UserService} from '../../shared/service/user.service';
import {NotificationService} from '../../shared/service/notification.service';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../../shared/model/user.model';
import {KeycloakService} from 'keycloak-angular';
import {UploadService} from '../../shared/service/upload.service';
import {HttpEventType} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-profile-form',
    templateUrl: './profileform.component.html',
    styleUrls: ['./profileform.component.css']
})
export class ProfileFormComponent implements OnInit, OnDestroy {
    public busy = false;
    public userForm: FormGroup;
    private subscription: Subscription;
    public user: User;
    public imageError = false;
    private currentFileUpload: File;
    private selectedFiles: FileList;
    public inputFileName = './assets/img/faces/default-avatar.png';

    constructor(private datePipe: DatePipe,
                private router: Router,
                private fb: FormBuilder,
                private uploadService: UploadService,
                private keycloak: KeycloakService,
                private userService: UserService,
                private notificationService: NotificationService) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.userForm = this.fb.group({
            userId: [null],
            createdon: [null],
            firstname: [null, Validators.required],
            lastname: [null, Validators.required],
            username: [null],
            email: [null],
            balance: [null]
        });

        this.subscription = this.userService.findSelf().pipe(
            catchError(err => {
                return throwError(err);
            })
        ).subscribe(user => {
            if (user == null) {
                // tslint:disable-next-line:max-line-length
                this.notificationService.error('Error Loading User : ' + this.keycloak.getUsername() + '. It might not exist, please contact Technical Support');
                // return this.router.navigate(['/users/user']);
            }

            this.user = user;

            if (user.profilePicture) {
                this.inputFileName = user.profilePicture;
            }

            const formatter = new Intl.NumberFormat('en-NG', {
                style: 'currency',
                currency: 'NGN',
            });

            this.userForm.patchValue({
                userId: user.id,
                createdon: this.datePipe.transform(new Date(user.createdDate), 'mediumDate'),
                firstname: user.firstName,
                lastname: user.lastName,
                username: user.username,
                email: user.email,
                balance: formatter.format(user.account?.balance)
            });
        });
    }

    onSubmit(userForm: FormGroup) {
        if (!userForm.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (this.imageError) {
            return this.notificationService.error('Invalid Image Type Please select either of JPG, JPEG or PNG');
        }

        const firstName = userForm.value.firstname;
        const lastName = userForm.value.lastname;

        // No Image Selected saving other Non-Image elements
        if (!this.selectedFiles) {
            return this.subscription = this.userService.updateSelf({
                firstName: firstName,
                lastName: lastName
            }).pipe(
                catchError(err => this.handleError(err)),
            ).subscribe((b) => this.handleSuccess(b));
        }

        this.currentFileUpload = this.selectedFiles.item(0);
        this.uploadService.pushFileToAWSStorage(this.currentFileUpload).subscribe(event => {
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
                this.userService.updateSelf({
                    firstName: firstName,
                    lastName: lastName,
                    profilePicture: event.body as string,
                }).pipe(
                    catchError(err => this.handleError(err))
                ).subscribe(x => this.handleSuccess(x));
            }

            this.selectedFiles = undefined;
        });
    }

    private handleSuccess(x) {
        this.router.navigate(['/dashboard']);
        this.notificationService.success('The User has been updated successfully');
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }

    onFileChange($event) {
        this.selectedFiles = $event.target.files;

        if (!(this.selectedFiles[0].type === 'image/jpg' || this.selectedFiles[0].type === 'image/jpeg' || this.selectedFiles[0].type === 'image/png')) {
            return this.imageError = true;
        }

        this.imageError = false;
    }
}
