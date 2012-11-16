var flag;

function randomposts(json) {
	var total = parseInt(json.feed.openSearch$totalResults.$t, 10);
	for (i = 0; i < numofpost;) {
		flag = 0;
		randarray.length = numofpost;
		l = Math.floor(Math.random() * total);
		for (j in randarray) {
			if (l == randarray[j]) {
				flag = 1
			}
		}
		if (flag == 0 && l != 0) {
			randarray[i++] = l
		}
	}
	document.write('<ul>');
	for (n in randarray) {
		var p = randarray[n];
		var entry = json.feed.entry[p - 1];
		for (k = 0, g = 0; k < entry.link.length; k++) {
			if (entry.link[k].rel == 'alternate') {
				document.write('<li><a href=\'' + entry.link[k].href + '\'>' + entry.title.$t + '</a></li>')
			}
		}
		if ("content" in entry) {
			var postcontent = entry.content.$t
		} else if ("summary" in entry) {
			var postcontent = entry.summary.$t
		} else var postcontent = "";
		var re = /<\S[^>]*>/g;
		postcontent = postcontent.replace(re, "");
		for (w = 0; w < postcontent.length; w++) {
			if (postcontent[w] == ' ') {
				g++
			}
			document.write(postcontent[w]);
			if (g == wordnumber) {
				document.write("..");
				break
			}
		}
		document.write('<br/>')
	}
	document.write('</ul>')
}