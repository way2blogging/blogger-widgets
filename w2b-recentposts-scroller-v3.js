/*
 *	Advenced Recent Posts Scroller Version 3 For Blogger
 *	Widget By Way2Blogging
 *	Url: http://www.way2blogging..org/
 *	Copyright © 2011, by Harish (way2blogging)
 */

function w2bAdvRecentPostsScrollerv3(json) {
	var w2brecentposts;
	var w2bpostlink;
	var w2bobj;
	var w2bmarqueehtml;
	var w2bmarqueehtml2;
	var byWay2blogging;
	var w2blinkgap;
	var w2bposttargetlink;
	var w2bBullet;
	try {
		w2bmarqueehtml = "\<marquee behavior=\"scroll\" onmouseover=\"this.stop();\" onmouseout=\"this.start();\" ";

		if (w2bScrollAmount) {
			w2bmarqueehtml = w2bmarqueehtml + " scrollamount = \"" + w2bScrollAmount + "%\"";
		} 
		if (w2bWidth) {
			w2bmarqueehtml = w2bmarqueehtml + " width = \"" + w2bWidth + "%\"";
		} else {
			w2bmarqueehtml = w2bmarqueehtml + " width = \"100%\"";
		}
		if (w2bScrollDelay) {
			w2bmarqueehtml = w2bmarqueehtml + " scrolldelay = \"" + w2bScrollDelay + "\"";
		}
		if (w2bDirection) {
			w2bmarqueehtml = w2bmarqueehtml + " direction = \"" + w2bDirection + "\"\>";
			if (w2bDirection == "left" || w2bDirection == "right") {
				w2blinkgap = "&nbsp;&nbsp;&nbsp;";
			} else {
				w2blinkgap = "\<br/\>";
			}
		}
		if (w2btargetlink == "yes") {
			w2bposttargetlink = " target= \"_blank\" ";
		} else {
			w2bposttargetlink = " ";
		}
		if (w2bimagebullet == "yes") {
			w2bBullet = " \<img class=\"w2bbulletbimg\" src=\"" + w2bimgurl + "\" />";
		} else {
			w2bBullet = w2bBulletchar;
		}
		w2bmarqueehtml2 = "\</marquee\>"
		w2brecentposts = "";
		for (var w2brp = 0; w2brp < w2bnumPosts; w2brp++) {
			var w2bobj = json.feed.entry[w2brp];
			if (w2brp == json.feed.entry.length) break;
			for (var w2bcc = 0; w2bcc < w2bobj.link.length; w2bcc++) {
				if (w2bobj.link[w2bcc].rel == 'alternate') {
					w2bpostlink = w2bobj.link[w2bcc].href;
					break;
				}
			}
			w2brecentposts = w2brecentposts + w2bBullet + " \<a " + w2bposttargetlink + " href=\"" + w2bpostlink + "\">" + w2bobj.title.$t + "\</a\>" + w2blinkgap;
		}
		byWay2blogging = "\<a tareget =\"_blank\" href=\"http://www.way2blogging.org/2011/01/add-auto-scrolling-recent-posts-widget.html\"\>+  Grab this Widget\</a\> on \<a tareget =\"_blank\" href=\"http://www.way2blogging.org/\"\>Way2Blogging\</a\>";
		if (w2bDirection == "left") {
			w2brecentposts = w2brecentposts + "&nbsp;&nbsp;&nbsp;" + byWay2blogging;
		} else if (w2bDirection == "right") {
			w2brecentposts = byWay2blogging + "&nbsp;&nbsp;&nbsp;" + w2brecentposts;
		} else if (w2bDirection == "up") {
			w2brecentposts = w2brecentposts + "\<br/\>" + byWay2blogging;
		} else {
			w2brecentposts = byWay2blogging + "\<br/\>" + w2brecentposts;
		}
		document.write("\<style style=\"text/css\"\>.way2blogging-srp{font-size:" + w2bfontsize + "px;background:#" + w2bbgcolor + ";font-weight:bold;}.way2blogging-srp a{color:#" + w2blinkcolor + ";text-decoration:none;}.way2blogging-srp a:hover{color:#" + w2blinkhovercolor + ";}img.w2bbulletbimg{vertical-align:middle;border:none;}\</style\>")
		document.write("\<div class=\"way2blogging-srp\"\>" + w2bmarqueehtml + w2brecentposts + w2bmarqueehtml2 + "\</div\>")
	} catch (exception) {
		alert(exception);
	}
}