import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

import {describeMemory, describeTimeInSeconds, ExamOverview, JudgeStatus, QuestionItem} from '../../models';
import {ExamService, StudentService} from '../../services/Services';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {initHighlight, parseMarkdown} from 'src/utils/markdownUtils';

@Component({
  selector: 'app-exam-problems',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit, AfterViewInit {

  constructor(private examService: ExamService,
              private studentService: StudentService,
              private route: ActivatedRoute,
              private router: Router,
              private renderer: Renderer2) {
  }

  private exam$: Observable<ExamOverview>;
  public exam: ExamOverview;

  @ViewChild('examDescriptionPanel') set content(content: ElementRef) {
    if (content) {
      this.renderMarkdown(content, this.exam.description);
    }
  }

  ngOnInit(): void {
    initHighlight();
    this.exam$ = this.route.parent.params.pipe(switchMap(params =>
      this.examService.getExamProgressOverview(this.studentService.currentStudent.id, +params.examId)
    ));
  }

  ngAfterViewInit(): void {
    // Use setTimeout(...) to run code asynchronously to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.exam$.subscribe(e => {
        this.exam = e;
      });
    });
  }

  private renderMarkdown(element: ElementRef, mdString: string) {
    this.renderer.setProperty(element.nativeElement, 'innerHTML',
      parseMarkdown(mdString));
  }

  public toCharactorIndex(i: number) {
    return String.fromCharCode(i + 65);
  }

  public getTotalScore() {
    return this.exam.questions.reduce((p, e) => p + e.yourScore, 0);
  }

  public getTotalMaxScore() {
    return this.exam.questions.reduce((p, e) => p + e.maxScore, 0);
  }

  public routeToQuestion(question: QuestionItem) {
    this.router.navigateByUrl(`exams/${this.exam.id}/problems/${question.problemId}`);
  }

  getQuestionStatus(question: QuestionItem): string {
    return question.bestRecord ? question.bestRecord.status : '';
  }

  getQuestionBestRecord(question: QuestionItem): string {
    const bestRecord = question.bestRecord;
    if (!bestRecord) {
      return `--`;
    }
    if (bestRecord.status === JudgeStatus.AC) {
      return `(${describeTimeInSeconds(bestRecord.maximumRuntime)}, ${describeMemory(bestRecord.maximumMemoryUsage)})`;
    }
    return `(score: ${bestRecord.score})`;
  }
}