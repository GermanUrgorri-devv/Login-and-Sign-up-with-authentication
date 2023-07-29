import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public disclaimerHeight?: string;
  public showText = false;

  private destroy$ = new Subject<void>();

  public catRole = false;
  public dogRole = false;

  constructor(
    public navigationService: NavigationService,
    public userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  async ngOnInit() {
    this.userService.userDetailsUpdated.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateUserRoles();
    });
  
    await this.updateUserRoles();
  }

  private updateUserRoles() {
    this.userService.getUserRoles().pipe(takeUntil(this.destroy$)).subscribe(roles => {
      this.catRole = roles.includes('cats');
      this.dogRole = roles.includes('dogs');
    });
  }

  public toggleDisclaimer() {
    const disclaimer = this.el.nativeElement.querySelector('#disclaimer');
    if (disclaimer.classList.contains('show')) {
      this.renderer.removeClass(disclaimer, 'show');
    } else {
      this.renderer.addClass(disclaimer, 'show');
    }
    this.showText = !this.showText;
  }
  

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
