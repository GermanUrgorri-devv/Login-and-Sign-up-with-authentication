import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public actionSheetButtons = [
    {
      text: 'Go Home',
      icon: 'home',
      handler: () => {
        this.navigationService.navigateTo('home'); 
      }
    },
    {
      text: 'Edit profile',
      icon: 'settings-outline',
      handler: () => {
        this.navigationService.navigateTo('user-profile'); 
      }
    },
    {
      text: 'Log out',
      icon: 'log-out-outline',
      handler: () => {
        this.userService.logOut(); 
      }
    },
    {
      text: 'Cancel',
      role: 'Cancel',
      icon: 'close-circle-outline',
    },
  ];

  @Input() title!: string;
  private data: any;
  public user?: string;

  private destroy$ = new Subject<void>();

  constructor(
    public navigationService: NavigationService,
    public userService: UserService,
    public actionSheetController: ActionSheetController,
  ) { }


  async ngOnInit() {
    this.userService.userDetailsUpdated.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateUserDetails();
    });

    this.updateUserDetails();
  }
  
  private updateUserDetails() {
    this.userService.getUserName().then(data => {
      this.data = data;
      this.userService.getUserRoles().pipe(takeUntil(this.destroy$)).subscribe(roles => {
        this.user = 'Name: ' + this.data.displayName + ', Roles: ' + (roles || []).join(" and ")
      });
    });
  }
  

  public async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: this.user,
      buttons: this.actionSheetButtons
    });
    await actionSheet.present();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}