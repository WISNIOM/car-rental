import { TestBed } from '@angular/core/testing';
import { PageNotFoundComponent } from './page-not-found.component';
import { CommonModule } from '@angular/common';

describe('PageNotFoundComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PageNotFoundComponent], // Import the standalone component
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PageNotFoundComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the correct content', () => {
    const fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Page Not Found'
    );
    expect(compiled.querySelector('p')?.textContent).toContain(
      "We couldn't find that page! Not even with x-ray vision."
    );
  });
});
