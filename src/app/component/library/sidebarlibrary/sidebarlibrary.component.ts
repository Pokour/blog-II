import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { browserRefreshforApp } from 'src/app/app.component';

@Component({
  selector: 'app-sidebarlibrary',
  templateUrl: './sidebarlibrary.component.html',
  styleUrls: ['./sidebarlibrary.component.scss']
})
export class SidebarlibraryComponent implements OnInit {

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


  constructor(private crud: CrudService) { }

  ngOnInit() {
    this.browserRefresh = browserRefreshforApp;
    console.log(this.browserRefresh);
    if (this.browserRefresh) {
      this.getLibrary();
    }
  }

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
        this.booksList = recievedbooks;

        for (let i = 0; i < this.booksList.length; i++) {

          this.chaptersOfCategory[i] = Object.values(this.chapterData[i]);

          this.books[i] = Object.values(this.booksList[i])
        }

      });
  }

  selected(item) {
    this.selectedItem = item;
  }

  selectedBookItem(item) {
    this.selectedBook = item;
  }

  sendtofetchblog(i,j,k,chapter){
    this.blogCategory.emit(i);
    this.blogBook.emit(j);
    this.blogChapter.emit(k);
    this.blogName.emit(chapter);
    this.fetchBlogFunctionCall.emit('call');
    this.currentblog = chapter;
  }

}
