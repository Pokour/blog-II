import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  // ************************links for JSON from Github starts here
  categorylink = '/json/category.json'
  booklink = '/json/books.json'
  chapterlink = '/json/chapters.json'
  bloglink: string;
  // **************************links for JSON from Github ends here

  // **************************Google sheets parameters starts here

  scriptUrl = "https://script.google.com/macros/s/AKfycbwe_QNIq6iTpY9QLEs6AhoW0lhJ1j8nhAJXrLHQqaEprdriIFk/exec";

  // **************************Google sheets parameters starts here

  constructor(private http: HttpClient) { }

  getcategory() {
    return this.http.get(this.categorylink);
  }

  getbooks() {
    return this.http.get(this.booklink)
  }

  getchapters() {
    return this.http.get(this.chapterlink)
  }

  getblog(blogname) {
    this.bloglink = '/json/blogs/' + blogname + '.json'
    return this.http.get(this.bloglink)
  }

  //....................User query Functions.....................
  readGsData(queryParameter) {
    var url = this.scriptUrl + queryParameter;
    console.log(url);
    return this.http.get(url);
  }

  updateGsData(qString) {
    var url = this.scriptUrl + qString;
    return this.http.get(url);
  }

  writeGsData(qString) {
    var url = this.scriptUrl + qString;
    return this.http.get(url);
  }

  pingToGsSheet(scriptLink, qParam) {
    var url = scriptLink + qParam;
    console.log('User request URL ',url);
    return this.http.get(url);
  }
}
