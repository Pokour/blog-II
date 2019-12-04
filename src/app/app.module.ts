import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './component/footer/footer.component';
import { FormComponent } from './component/form/form.component';
import { LandingComponent } from './component/landing/landing.component';
import { LibraryComponent } from './component/library/library.component';
import { LoaderComponent } from './component/loader/loader.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { ProfileComponent } from './component/profile/profile.component';
import { QuizComponent } from './component/quiz/quiz.component';
import { SidebarlibraryComponent } from './component/library/sidebarlibrary/sidebarlibrary.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    FormComponent,
    LandingComponent,
    LibraryComponent,
    LoaderComponent,
    NavbarComponent,
    ProfileComponent,
    QuizComponent,
    SidebarlibraryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
