import { Component, OnInit, NgZone } from '@angular/core';
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

	public urlPathname;
	public user;
	public userAwards;
	public userAwardsInput: Array<any>;
	public videoUrl;
	public dataLoaded;

	constructor(private afs: AngularFirestore, private sanitizer: DomSanitizer, private _ngZone: NgZone) {
		this.user = {profileIsPublic: false};

		this.urlPathname = window.location.pathname.substr(1);
		console.log("URL " + this.urlPathname);
		
		if(this.urlPathname == ""){
			// root path "/"
			this.urlPathname = false;
			this.user = {profileIsPublic: false};
			this.dataLoaded = true;
		} else {
			let query = afs.collection('user', ref => ref.where('userUrl', '==', this.urlPathname)).valueChanges();
			let result = query.subscribe(queriedItems => {
				if(queriedItems.length > 0) {

					console.log("RESULT: " + JSON.stringify(queriedItems));
					console.log(queriedItems[0]);  
					this.user = queriedItems[0];

					this.initUser();
					
				} else {
					// User not found
					this.urlPathname = false;
					this.user = {profileIsPublic: false};
					this.dataLoaded = true;
					console.log("user not found");
				}
			});
		}

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

	initUser(){

		// If userAwards exist => Split into Array
		if(this.user.userAwards != ""){
			this.userAwards = [];
			this.userAwardsInput = [];
			this.userAwardsInput = String(this.user.userAwards).split(",");


				for(let i = 0; i < this.userAwardsInput.length; i++) {
				let awardYear = 0;

				// Search String for Year (19XX / 20XX)
				if(this.userAwardsInput[i].match(/\b(19|20)\d{2}\b/g)){
					awardYear = this.userAwardsInput[i].match(/\b(19|20)\d{2}\b/g)
					console.log("MATCH in AWARD nr " + i + " with value: " + awardYear);
				}

				if(this.userAwardsInput[i] != ""){
					if(this.userAwardsInput[i].includes(" - ")){
						// Piano Competition 2018 - 1st Prize
						let userAward = this.userAwardsInput[i].split(" - ");
						this.userAwards.push({
							competition: userAward[0],
							prize: userAward[1],
							year: awardYear
						});
					} else {
						this.userAwards.push({
							competition: this.userAwardsInput[i],
							prize: false,
							year: awardYear
						});
					}
				}

				// Sort Awards by year (descending)
				this.userAwards.sort((a, b) => {
					return b.year - a.year;
				});

				this.dataLoaded = true;
			}
		} else {
			this.userAwards = false;
			this.dataLoaded = true;
		}

		// If YT-Video-ID exists, bypass security
		if(this.user.userVideoLink != ""){
			let videoLink = 'https://www.youtube.com/embed/' + this.user.userVideoLink;
			this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
		} else {
			this.videoUrl = false;
		}
	}

}
