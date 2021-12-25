import {Injectable} from '@angular/core';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private showNotification(message: string, type: string, title: string) {

        $.notify({
            icon: 'notifications',
            message: '<b>' + title +  '</b> - ' + message
        }, {
            type: type,
            timer: 3000,
            placement: {
                from: 'top',
                align: 'right'
            },
            template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
                '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
                '<i class="material-icons" data-notify="icon">notifications</i> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
    }

    public error(message: string) {
        return this.showNotification(message, 'danger', 'ERROR');
    }

    public warning(message: string) {
        return this.showNotification(message, 'warning', 'WARNING');
    }

    public info(message: string) {
        return this.showNotification(message, 'info', 'INFO');
    }

    public success(message: string) {
        return this.showNotification(message, 'success', 'SUCCESS');
    }
}
