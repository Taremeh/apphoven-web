import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  private urlPathname;
  private user;
  private userAwards;
  private videoUrl;

  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;

  constructor(private afs: AngularFirestore, private sanitizer: DomSanitizer) {
    this.urlPathname = window.location.pathname.substr(1);
    console.log("URL " + this.urlPathname);

    let query = afs.collection('user', ref => ref.where('userUrl', '==', this.urlPathname)).valueChanges();
    let result = query.subscribe(queriedItems => {
      if(queriedItems.length > 0) {

        console.log("RESULT: " + JSON.stringify(queriedItems));
        console.log(queriedItems[0]);  
        this.user = queriedItems[0];

        // If userAwards exist => Split into Array
        if(this.user.userAwards != ""){
          this.userAwards = [];
          this.userAwards = this.user.userAwards.split(",");
        } else {
          this.userAwards = false;
        }

        // If YT-Video-ID exists, bypass security
        if(this.user.userVideoLink != ""){
          let videoLink = 'https://www.youtube.com/embed/' + this.user.userVideoLink;
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
        } else {
          this.videoUrl = false;
        }
        
      } else {
        console.log("user not found");
      }
      
    });

    // this.items = afs.collection('user/'+this.urlPathname).valueChanges();
    // this.items = afs.collection('user/'+this.urlPathname).valueChanges();
    // this.itemDoc = afs.doc<any>('user/1MKg1ouhlXdjO8YeGQpiq9k48tg2');
    // this.item = this.itemDoc.valueChanges();

    /*let query2 = afs.collection('user', ref => ref.where('piece.*.', '==', 1708)).valueChanges();
    let result2 = query2.subscribe(queriedItems2 => {
      console.log("RESULT 1212 " + queriedItems2);
      if(queriedItems2.length > 0) {
        console.log("RESULT22222: " + JSON.stringify(queriedItems2));
        console.log(queriedItems2[0]);
      }
    });*/
  }

  ngOnInit(){
    console.log(window.location.pathname);
  }

}
