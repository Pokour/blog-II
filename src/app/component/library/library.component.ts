import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppUtilService } from 'src/app/service/app-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})

export class LibraryComponent implements OnInit {
  public browserRefresh: boolean;
  isOpen = false;
  category: any;
  book;
  categoryList;
  booksList;
  chapterDatachapterData;
  books = [];
  chaptersOfCategory = [];
  blogname: string;
  blogData;
  blogIndex = [];
  elementData = [];
  sanatizedUrl = '';
  chapter: any;
  bodyContentHeadIndex = [];
  bodyContentHeadValue = [];
  blogCategory: any;
  blogHeadName: String;
  blogBook: any;
  blogChapter: any;
  blognameFromUrl: any;

  constructor(
    private crud: CrudService,
    private sanitizer: DomSanitizer,
    private _notification: ToastrService,
    private _apputil: AppUtilService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  /*********************************************************************
   * Recieve the blog details clicked by the user on the child component
   * below 3 functions catch the variable details from the event
   */
  receiveCategoryInfo($event) {
    this.blogCategory = $event
    console.log(this.blogCategory)
  }
  receiveBookInfo($event) {
    this.blogBook = $event
  }
  receiveChapterInfo($event) {
    this.blogChapter = $event
  }
  /****************************************************************
   * This function openSidebar() is used to toggle the sidebar
   */
  openSidebar() {
    this.isOpen = !this.isOpen;
    return this.isOpen;
  }

  /****************************************************************
   * Check the url for if there already exists a blogname.
   * If there exists a blogname, we are calling the function fetchblogwithNumber()
   * to fetch the article.
   * If the name doesn't exist, then we know the user has came here
   * through a blog selection from sidebarlibrary.
   * Hence the fetchBlog() function is called.
   */
  ngOnInit() {
    this.checkURLforBlogName();
  }

  checkURLforBlogName() {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.blognameFromUrl = params['id'];
        this.fetchBlog(this.blognameFromUrl);
      }
    });
  }

  createBlogName(a) {
      //  a(Category) b(Book) c(Chapter) to be retrieved, the variables a b c are converted to string ;
      this.blogCategory = this.blogCategory + '';
      this.blogBook = this.blogBook + '';
      this.blogChapter = this.blogChapter + '';
      // The parameters a b c are concatenated to generate the name of the blog to be fetched 
      //this.blogname = a + '_' + b + '_' + c;
      this.blogname = this.blogCategory + '_' + this.blogBook + '_' + this.blogChapter;
      this.fetchBlog(this.blogname)
      console.log(this.blogname)
    
  }

  fetchBlog(blogname) {
    this._apputil.loadingStarted();
    /*
    * To update the url with the selected blogname. Used Router's pre-defined function 'navigate' to
     update the :name(from app-routing module) with this.blogname.
    */
   if ( !this.blognameFromUrl){
    this.router.navigate(['library', blogname]);
   }
    // the blogname is passed as a parameter to the getblog() in the crud service
    this.crud.getblog(blogname)
      .subscribe(recievedblog => {
        //Recieved blog is in blogData
        if (recievedblog) {
          this._apputil.loadingEnded();
        }
        this.blogData = recievedblog;
        // we extract the index for the blog in blogIndex array which is always the first object in the blogData
        this.blogIndex = this.blogData[0];
        // ckeck index
        console.log(this.blogIndex);

        for (let j = 0; j < this.blogData.length; j++) {
          this.elementData[j] = Object.values(this.blogData[j]);

          if (this.blogIndex[j] == 'youtube') {
            this.sanatizedUrl = this.blogData[j]['youtube'];
            this.elementData[j] = this.sanitizer.bypassSecurityTrustResourceUrl(this.sanatizedUrl)
          }
        }
      });
  }

  getBlogInfo(i, blogInfo) {
    //{} = this.blogData[i][blogInfo]
    const [{ authorImg }, { author }, { publishedOn }, { lastUpdate }, { edits }] = this.blogData[i][blogInfo];
    console.log("Author  Image url", authorImg);
    console.log("Author name is ", author);
    console.log("Date Of publishing this blog is ", publishedOn);
    console.log("This blog was last updated on ", lastUpdate);
    console.log("These are the people helped in updates", edits);
    return true;
  }

  paragraphdig(index, jsonHead) {
    for (let i = 0; i < this.blogData[index][jsonHead].length; i++) {
      this.bodyContentHeadIndex[i] = Object.keys(this.blogData[index][jsonHead][i]);
      this.bodyContentHeadValue[i] = Object.values(this.blogData[index][jsonHead][i]);
    }
    console.log("CONSOLING THE HEAD", this.bodyContentHeadIndex);
    console.log("CONSOLING THE PARA", this.bodyContentHeadValue);
    if (this.bodyContentHeadIndex && this.bodyContentHeadValue) {
      return true;
    }
  }
}
