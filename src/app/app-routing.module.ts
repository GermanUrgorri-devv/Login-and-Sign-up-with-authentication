import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AuthGuard } from '@angular/fire/auth-guard';
import { RolesGuard } from 'src/app/guards/auth.guard';  

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginPageModule)
}, {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login'])),
    canActivate: [RolesGuard],
    data: { roles: ['cats','dogs'], redirect: 'user-profile' }
},
{
    path: 'user-profile',
    loadChildren: () => import('./pages/user/user-profile/user-profile.module').then(m => m.UserProfilePageModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
},
{
    path: 'cat',
    loadChildren: () => import('./pages/animals/cat/cat.module').then( m => m.CatPageModule),
    canActivate: [RolesGuard],
    data: { roles: ['cats'], redirect: 'home' }
},
{
    path: 'dog',
    loadChildren: () => import('./pages/animals/dog/dog.module').then( m => m.DogPageModule),
    canActivate: [RolesGuard],
    data: { roles: ['dogs'], redirect: 'home' }
},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
