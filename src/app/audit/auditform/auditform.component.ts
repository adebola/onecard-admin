import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuditService} from '../../shared/service/audit.service';
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs';
import {Audit} from '../../shared/model/audit.model';

@Component({
    selector: 'app-audit-form',
    templateUrl: './auditform.component.html',
})
export class AuditFormComponent implements OnInit, OnDestroy {
    private id: string = null;
    private subscription: Subscription;
    private auditSubject = new BehaviorSubject<Audit>(null);
    public audit$ = this.auditSubject.asObservable();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private auditService: AuditService) {}

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.auditSubject.complete();
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.subscription = this.auditService.findById(this.id).subscribe(this.auditSubject.next);
    }

    back() {
        this.router.navigate(['/audit/audit']);
    }
}
