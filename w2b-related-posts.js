//<![CDATA[
var relatedTitles = new Array();
var relatedTitlesNum = 0;
var relatedUrls = new Array();

function related_results_labels(json)
{
    for (var i = 0; i < json.feed.entry.length; i++)
    {
        var entry = json.feed.entry[i];
        relatedTitles[relatedTitlesNum] = entry.title.$t;
        for (var k = 0; k < entry.link.length; k++)
        {
            if (entry.link[k].rel == 'alternate')
            {
                relatedUrls[relatedTitlesNum] = entry.link[k].href;
                relatedTitlesNum++;
                break;
            }
        }
    }
}

function removeRelatedDuplicates()
{
    var tmp = new Array(0);
    var tmp2 = new Array(0);
    for (var i = 0; i < relatedUrls.length; i++)
    {
        if (!contains(tmp, relatedUrls[i]))
        {
            tmp.length += 1;
            tmp[tmp.length - 1] = relatedUrls[i];
            tmp2.length += 1;
            tmp2[tmp2.length - 1] = relatedTitles[i];
        }
    }
    relatedTitles = tmp2;
    relatedUrls = tmp;
}

function contains(a, e)
{
    for (var j = 0; j < a.length; j++) if (a[j] == e) return true;
    return false;
}

function printRelatedLabels(currenturl)
{
    for (var i = 0; i < relatedUrls.length; i++)
    {
        if (relatedUrls[i] == currenturl)
        {
            relatedUrls.splice(i, 1)
            relatedTitles.splice(i, 1)
        }
    }
    var r = Math.floor((relatedTitles.length - 1) * Math.random());
    var i = 0;
    if (relatedTitles.length > 1) document.write('<h2>' + relatedpoststitle + '</h2>');
    document.write('<ul>');
    while (i < relatedTitles.length && i < 20 && i < maxresults)
    {
        document.write('<li><a href="' + relatedUrls[r] + '">' + relatedTitles[r] + '</a></li>');
        if (r < relatedTitles.length - 1)
        {
            r++;
        }
        else
        {
            r = 0;
        }
        i++;
    }
    document.write('</ul>');
    relatedUrls.splice(0, relatedUrls.length);
    relatedTitles.splice(0, relatedTitles.length);
}
//]]>