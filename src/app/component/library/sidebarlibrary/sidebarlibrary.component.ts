import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { browserRefreshforApp } from 'src/app/app.component';
import { AppUtilService } from 'src/app/service/app-util.service';

@Component({
  selector: 'app-sidebarlibrary',
  templateUrl: './sidebarlibrary.component.html',
  styleUrls: ['./sidebarlibrary.component.scss']
})
export class SidebarlibraryComponent implements OnInit {

  /*************************************************************************
   * Created the below 5 variables to send the details of the selected file to the parent
   * library component. Child to parent component communication is always done using event emitters.
   */
  @Output() blogCategory = new EventEmitter<string>();
  @Output() blogBook = new EventEmitter<string>();
  @Output() blogChapter = new EventEmitter<string>();
  @Output() blogName = new EventEmitter<string>();
  @Output() fetchBlogFunctionCall = new EventEmitter<string>();

  public browserRefresh: boolean;
  categoryList;
  booksList;
  chapterData;
  books = [];
  chaptersOfCategory = [];
  blogname: string;
  currentblog: String;
  selectedItem: String;
  selectedBook: String;


  constructor(private crud: CrudService, private _apputil: AppUtilService) { }

  ngOnInit() {
    this._apputil.loadingStarted();
    // this.browserRefresh = browserRefreshforApp;
    // console.log(this.browserRefresh);
    // if (this.browserRefresh) {
    this.getLibrary();
    // }
  }

  /*************************************************************************
   * getLibrary() is a function to load the entire list of categories, chapters and books from the service.
   */
  getLibrary() {
    this.crud.getcategory()
      .subscribe(recievedCategory => {
        this.categoryList = recievedCategory;
      });

    this.crud.getchapters()
      .subscribe(recievedchapters => {
        this.chapterData = recievedchapters;

      });

    this.crud.getbooks()
      .subscribe(recievedbooks => {
        if (recievedbooks) {
          this._apputil.loadingEnded();
          this.booksList = recievedbooks;
          for (let i = 0; i < this.booksList.length; i++) {
            this.chaptersOfCategory[i] = Object.values(this.chapterData[i]);
            this.books[i] = Object.values(this.booksList[i])
          }
        }
      });
  }

  selected(item) {
    /*************************************************************************
   * this function is used to colour code the selected item, so as to differentiate it from the other
   * names in that list.
   */
    this.selectedItem = item;
  }

  
  selectedBookItem(item) {
    /*************************************************************************
   * this function is used to colour code the selected item, so as to differentiate it from the other
   * names in that list.
   */
    this.selectedBook = item;
  }

  sendtofetchblog(i, j, k, chapter) {
    /*************************************************************************
   * This function is used to send the selected blog's details across to it's parent component.
   */
    this.blogCategory.emit(i);
    this.blogBook.emit(j);
    this.blogChapter.emit(k);
    this.blogName.emit(chapter);
    this.fetchBlogFunctionCall.emit('call');
    this.currentblog = chapter;
  }

}
