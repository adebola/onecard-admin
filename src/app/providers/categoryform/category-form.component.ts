import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {ProviderService} from '../../shared/service/provider.service';
import {NotificationService} from '../../shared/service/notification.service';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {DatePipe} from '@angular/common';
import {ProviderCategory} from '../../shared/model/provider.model';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit, OnDestroy {
    public busy = false;
    public editMode = false;
    private id: string = null;
    public categoryForm: FormGroup;
    private subscription: Subscription;

    constructor(private router: Router,
                private fb: FormBuilder,
                private datePipe: DatePipe,
                private route: ActivatedRoute,
                public providerService: ProviderService,
                private notificationService: NotificationService) {}

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.editMode = !!this.id;
        this.createForm();
    }

    onSubmit(form: FormGroup) {
        if (!form.valid) {
            return this.notificationService.error('Please fill out the form properly');
        }

        if (!form.touched) {
            return this.notificationService.info('You have not made any changes to this form, consequently it has not been saved');
        }

        const name: string = form.value.name;

        let obs$: Observable<any>;

        if (this.editMode) {
            obs$ = this.providerService.updateProviderCategory(this.id, {
                categoryName: name
            });
        } else {
            obs$ = this.providerService.saveProviderCategory({
                categoryName: name,
            });
        }

        obs$.pipe(
            catchError(err => this.handleError(err)),
            finalize(() => this.busy = false)
        ).subscribe((p) => this.handleSuccess(p));

    }

    private createForm() {
        if (this.id) {
            this.categoryForm = this.fb.group({
                categoryId: [null],
                name: [null, Validators.required],
                createdby: [null],
                createdon: [null],
            });

            this.subscription = this.providerService.getProviderCategory(this.id).pipe(
                catchError(err => {
                    return throwError(err);
                })
            ).subscribe(category => {
                if (category == null) {
                    this.notificationService.error('Error Loading Category : ' + this.id + '. It might not exist, please contact Technical Support');
                    return this.router.navigate(['/providers/category']);
                }

                console.log(category);

                this.categoryForm.patchValue({
                    categoryId: category.id,
                    name: category.categoryName,
                    createdby: category.createdBy,
                    createdon: this.datePipe.transform(new Date(category.createdDate), 'mediumDate')
                });
            });
        } else {
            this.categoryForm = this.fb.group({
                name: [null, Validators.required],
            });
        }
    }

    private handleSuccess(category: ProviderCategory) {
        this.router.navigate(['/providers/categoryform/', (category && category.id) ? category.id : this.id]);
        this.notificationService.success('The Category Save/Update was successfull');
    }

    private handleError(err) {
        this.notificationService.error(err.error.message);
        console.log(err);
        return throwError(err);
    }
}
