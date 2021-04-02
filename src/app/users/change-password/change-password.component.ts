import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IncorrectPasswordFoundError, StudentService} from '../../services/Services';
import {Router} from '@angular/router';
import {MessageService} from 'primeng';
import {NgModel} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './change-password.component.html',
  styleUrls: ['../../../animations.css', './change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  CHANGE_NOTIFY_KEY = 'password-change-notify';

  errorMessage = '';

  constructor(private studentService: StudentService,
              private router: Router,
              private messageService: MessageService) {
  }

  @ViewChild('spinner') spinner: ElementRef;
  @ViewChild('currentPasswordField') currentPasswordField: NgModel;
  @ViewChild('newPasswordField') newPasswordField: NgModel;

  currentPassword: string;
  newPassword: string;

  showErrorMessage: boolean;

  ngOnInit(): void {
    this.studentService.authenticate();
  }

  keyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.changePassword();
    }
  }

  changePassword(): void {
    this.showErrorMessage = true;
    this.errorMessage = '';

    if (this.newPasswordField.invalid || this.currentPasswordField.invalid) {
      return;
    }

    this.spinner.nativeElement.style.display = 'inline-block';
    this.studentService.changePassword(this.currentPassword, this.newPassword)
      .subscribe({
        complete: () => {
          this.spinner.nativeElement.style.display = 'none';
          this.messageService.add({
            key: this.CHANGE_NOTIFY_KEY,
            life: 2500,
            severity: 'success',
            detail: 'Your password has been changed',
          });

          setTimeout(() => this.router.navigateByUrl('/'), 3000);
        },
        error: err => {
          this.spinner.nativeElement.style.display = 'none';
          if (err instanceof IncorrectPasswordFoundError) {
            this.errorMessage = 'The password is incorrect';
          } else {
            throw err;
          }
        },
      });
  }
}