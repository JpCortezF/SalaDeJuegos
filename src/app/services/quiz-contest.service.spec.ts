import { TestBed } from '@angular/core/testing';

import { QuizContestService } from './quiz-contest.service';

describe('QuizContestService', () => {
  let service: QuizContestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizContestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
