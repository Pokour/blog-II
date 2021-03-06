import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './component/landing/landing.component';
import { FormComponent } from './component/form/form.component';
import { LibraryComponent } from './component/library/library.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LoginComponent } from './component/login/login.component';
import { AuthguardService } from './service/authguard.service';
import { NotFoundComponent } from './component/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'form', component: FormComponent },
  { path: 'library', component: LibraryComponent, canActivate: [AuthguardService] },
  { path: 'library/:id', component: LibraryComponent, canActivate: [AuthguardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthguardService] },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**',redirectTo: '/not-found' }
  // {path: 'blog', component: BlogComponent},
  // {path: 'quiz', component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
