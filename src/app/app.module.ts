import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './users/login/login.component';
import {AppComponent} from './app.component';
import {ProblemListComponent} from './problem-list/problem-list.component';
import {ExamListComponent} from './exam/exam-list/exam-list.component';
import {ExamHomeComponent} from './exam/exam-home/exam-home.component';
import {ExamQuestionsComponent} from './exam/exam-questions/exam-questions.component';
import {ExamScoreboardComponent} from './exam/exam-scoreboard/exam-scoreboard.component';
import {ExamSubmissionsComponent} from './exam/exam-submissions/exam-submissions.component';
import {BrokerService, ExamService, ProblemService, StudentService} from './services/Services';
import {IdeComponent} from './ide/ide.component';
import {ProblemDescriptionComponent} from './ide/problem-description/problem-description.component';
import {CodeUploadPanelComponent} from './ide/code-panel/code-upload-panel.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LdCircleComponent} from './items/spinners/ld-circle.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {BlockUIModule, MessageService, MessagesModule, ToastModule} from 'primeng';
import {ProblemTagDropDownComponent} from './items/problem-tag-drop-down/problem-tag-drop-down.component';
import {HttpProblemService} from './services/impl/HttpProblemService';
import {HttpExamService} from './services/impl/HttpExamService';
import {HttpStudentService} from './services/impl/HttpStudentService';
import {HttpSubmissionService} from './services/impl/HttpSubmissionService';
import {CookieModule} from './services/cookie/cookie.module';
import {CookieService} from './services/cookie/cookie.service';
import {TestcasesComponent} from './testcases/testcases.component';
import {AngularSplitModule} from 'angular-split';
import {ChangePasswordComponent} from './users/change-password/change-password.component';
import {FormsModule} from '@angular/forms';
import {StompBrokerService} from './services/impl/StompBrokerService';
import {RxStompConfig} from '@stomp/rx-stomp';
import {EventBus} from './services/EventBus';
import {HttpExamQuestionSubmissionService} from './services/impl/HttpExamQuestionSubmissionService';
import {QuestionBanner} from './exam/question-banner/question-banner.component';
import {LdSpinnerComponent} from './items/spinners/ld-spinner.component';


const DOMAIN = 'api.judgegirl.beta.pdlab.csie.ntu.edu.tw';
const HTTP_HOST = `http://${DOMAIN}`;

const rxStompConfig = new RxStompConfig();
rxStompConfig.brokerURL = `ws://${DOMAIN}/broker`;
rxStompConfig.reconnectDelay = 200;

@NgModule({
  declarations: [
    /*Pages*/
    AppComponent,
    LoginComponent,
    ChangePasswordComponent,
    ProblemListComponent,
    ExamListComponent,
    IdeComponent,
    ProblemDescriptionComponent,
    CodeUploadPanelComponent,
    SubmissionsComponent,

    ExamHomeComponent,
    ExamQuestionsComponent,
    ExamSubmissionsComponent,
    ExamScoreboardComponent,

    QuestionBanner,

    /*items*/
    LdCircleComponent,
    LdSpinnerComponent,

    ProblemTagDropDownComponent,

    /*directives*/
    TestcasesComponent,
  ],
  imports: [
    CookieModule.forRoot(),
    AngularSplitModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    /*primeNG*/
    BlockUIModule, ToastModule, FileUploadModule, MessagesModule
  ],
  providers: [
    HttpClient,
    MessageService,
    CookieService,
    {provide: StudentService, useClass: HttpStudentService},
    {provide: ProblemService, useClass: HttpProblemService},
    {provide: ExamService, useClass: HttpExamService},
    {provide: BrokerService, useClass: StompBrokerService},
    {provide: RxStompConfig, useValue: rxStompConfig},
    {provide: EventBus, useClass: EventBus},
    {provide: 'SUBMISSION_SERVICE', useClass: HttpSubmissionService},
    {provide: 'EXAM_QUESTION_SUBMISSION_SERVICE', useClass: HttpExamQuestionSubmissionService},
    {provide: 'STUDENT_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'PROBLEM_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'SUBMISSION_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`},
    {provide: 'EXAM_SERVICE_BASE_URL', useValue: `${HTTP_HOST}`}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
