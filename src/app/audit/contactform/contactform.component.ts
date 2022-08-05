import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs';
import {Contact} from '../../shared/model/contact.model';
import {ContactService} from '../../shared/service/contact.service';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contactform.component.html',
})
export class ContactFormComponent implements OnInit, OnDestroy {
    private id: string = null;
    private subscription: Subscription;
    private contactSubject = new BehaviorSubject<Contact>(null);
    public contact$ = this.contactSubject.asObservable();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private contactService: ContactService) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.contactSubject.complete();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.subscription = this.contactService.findById(this.id).subscribe(contact => {
            this.contactSubject.next(contact);
        });
    }

    back() {
        this.router.navigate(['/audit/contact']);
    }
}
