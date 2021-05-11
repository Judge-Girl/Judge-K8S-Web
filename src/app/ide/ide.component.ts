import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {StudentService} from '../services/Services';
import {SplitComponent} from 'angular-split';

export enum Tab {
  TESTCASES,
  PROBLEM, SUBMISSIONS
}

@Component({
  selector: 'app-multi-tabs-panel',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.css']
})
export class IdeComponent implements OnInit, AfterViewInit {
  private routePrefixing: (routeParams: Params) => string;

  readonly TAB_SUBMISSIONS = Tab.SUBMISSIONS;

  readonly TAB_PROBLEM = Tab.PROBLEM;
  readonly TAB_TESTCASES = Tab.TESTCASES;
  @ViewChild('problemTab') problemTab: ElementRef;

  @ViewChild('testcasesTab') testcasesTab: ElementRef;
  @ViewChild('submissionsTab') submissionsTab: ElementRef;
  @ViewChild('splitter') splitter: SplitComponent;
  private allTabs: ElementRef[];
  private routeParams: Params;
  private problemId: number;

  constructor(private elementRef: ElementRef, public studentService: StudentService,
              private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(params => {
      this.routeParams = params;
      this.problemId = +params.problemId;
    });
    this.routePrefixing = route.snapshot.data.routePrefixing;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.allTabs = [this.problemTab, this.testcasesTab, this.submissionsTab];
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.refreshTabState();
      }
    });
    this.refreshTabState();
    this.effectResponsiveSplitter();
  }

  get isInExam(): boolean {
    return !!this.route.snapshot.params.examId;
  }


  switchTab(tab: Tab): boolean {
    const routePrefix = this.routePrefixing(this.routeParams);
    if (tab === Tab.PROBLEM) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}`]);
      this.activateTabAndDeactivateOthers(this.problemTab);
    } else if (tab === Tab.TESTCASES) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}/testcases`]);
      this.activateTabAndDeactivateOthers(this.testcasesTab);
    } else if (tab === Tab.SUBMISSIONS) {
      this.router.navigate([`${routePrefix}problems/${this.problemId}/submissions`]);
      this.activateTabAndDeactivateOthers(this.submissionsTab);
    }
    return false;  // avoid <a>'s changing page
  }

  private activateTabAndDeactivateOthers(tab: ElementRef) {
    if (this.allTabs) {
      for (const t of this.allTabs) {
        if (t === tab) {
          t.nativeElement.classList.add('active');
        } else {
          t.nativeElement.classList.remove('active');
        }
      }
    }
  }

  private refreshTabState() {
    if (window.location.pathname.endsWith('testcases')) {
      this.switchTab(Tab.TESTCASES);
    } else if (window.location.pathname.endsWith('submissions')) {
      this.switchTab(Tab.SUBMISSIONS);
    }
  }

  onResize($event: UIEvent) {
    this.effectResponsiveSplitter();
  }

  private effectResponsiveSplitter() {
    if (this.splitter) {
      if (window.innerWidth <= 1000) {
        this.splitter.direction = 'vertical';
      } else {
        this.splitter.direction = 'horizontal';
      }
    }
  }
}

