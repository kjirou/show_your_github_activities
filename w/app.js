var $e = {
    productionSiteUrl: 'http://syga.kjirou.net'
};
var $f = {};
var $a = {};

(function(){

$f.parseUrlToParameters = function(url){
    var params = {};
    if (/^.+?\?./.test(url)) {
        url = url.replace(/#[^#]*$/, '');
        var pairs = url.replace(/^.+?\?/, '').split('&');
        var i, pair;
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i].split('=');
            params[pair[0]] = ((pair[1] !== undefined)? pair[1]: "");
        };
    };
    return params;
}
$f.getBrowser = function(){
    var browsers = [
        ['ipad', /iPad/],
        ['iphone', /iPhone/],
        ['android', /Android/],
        ['ie9', /MSIE 9\./],
        ['ie8', /MSIE 8\./],
        ['ie7', /MSIE 7\./],
        ['ie6', /MSIE 6\./],
        ['chrome', /Chrome/],
        ['firefox', /Firefox/],
        ['safari', /Safari/],
        ['opera', /Opera/]//,
    ];
    var i;
    for (i = 0; i < browsers.length; i++) {
        if (browsers[i][1].test(window.navigator.userAgent)) return browsers[i][0];
    };
    return 'unknown';
}

// Const variables
$a.GITHUB_URL = 'https://github.com';
$a.GITHUB_API_URL = 'https://api.github.com';
$a.LAST_CACHED_AT_KEY = 'last_cached_at';
$a.GITHUB_USER_EVENTS_DATA_KEY = 'github_user_events_data';
$a.CACHE_LIFETIME = 60 * 10 * 1000; // 10 mins
$a.ALLOWED_LAZY_DAY_COUNT = 7;

// Computed variables
$a.browser = $f.getBrowser();
$a.isActive = (function(){
    var supported = ['chrome', 'safari', 'firefox', 'ie9', 'opera'];
    return supported.indexOf($a.browser) !== -1;
}());
$a.urlParams = $f.parseUrlToParameters(document.URL);
$a.githubUsername = $a.urlParams.u;
$a.frameWidth = ~~$a.urlParams.w;
$a.frameHeight = ~~$a.urlParams.h;
$a.frameBorderWidth = 1;
$a.maxItemCount = 5;

// Functions
$a.adjustStyles = function(size){
    var style = {
        width: size[0] - $a.frameBorderWidth * 2,
        height: size[1] - $a.frameBorderWidth * 2//,
    };
    $('html').css(style);
    $('body').css(style);
    $('#container').css({
        border: $a.frameBorderWidth + 'px solid #DDD'
    });
}
$a.getGithubUserEventsApiUrl = function(){
    return $a.GITHUB_API_URL + '/users/' + $a.githubUsername + '/events';
}
$a.githubUserEventsData = null;
$a.getUserEventsCacheData = function(){/** @return obj | null */
    return $.evalJSON(localStorage.getItem($a.GITHUB_USER_EVENTS_DATA_KEY));
}
$a.isEnabledCache = function(username){
    var lastCachedAt;
    var userEventsData;
    if (window.localStorage === undefined) {
        return false;
    } else {
        lastCachedAt = parseInt(localStorage.getItem($a.LAST_CACHED_AT_KEY));
        userEventsData = $a.getUserEventsCacheData();
        if (
            isNaN(lastCachedAt) ||
            userEventsData === null ||
            lastCachedAt + $a.CACHE_LIFETIME < (new Date()).getTime() ||
            userEventsData.data.length === 0 ||
            $a.githubUsername !== userEventsData.data[0].actor.login
        ) {
            return false;
        }
    }
    return true;
}
$a.loadData = function(){
    var d = $.Deferred();
    if ($a.isEnabledCache()) {
        $a.githubUserEventsData = $.evalJSON(localStorage.getItem($a.GITHUB_USER_EVENTS_DATA_KEY));
        setTimeout(function(){ d.resolve(); }, 1);
    } else {
        $.ajax(
            $a.getGithubUserEventsApiUrl(),
            { dataType:'jsonp', callback:'callback' }
        ).then(function(data){
            // Wrong username etc
            if (data.meta.status === 200) {
                localStorage.setItem($a.LAST_CACHED_AT_KEY, (new Date()).getTime());
                localStorage.setItem($a.GITHUB_USER_EVENTS_DATA_KEY, $.toJSON(data));
                $a.githubUserEventsData = data;
            }
            d.resolve();
        });
    }
    return d;
}
$a.getAvatarUrl = function(){
    if (
        $a.githubUserEventsData === null ||
        ~~$a.githubUserEventsData.data.length === 0
    ) return null;
    return $a.githubUserEventsData.data[0].actor.avatar_url;
}
$a.isSuccessedGettingData = function(){
    return !!$a.getAvatarUrl();
}
$a.isLazy = function(){
    if ($a.isSuccessedGettingData() === false) return false;
    return Date.create($a.githubUserEventsData.data[0].created_at)
        .addDays($a.ALLOWED_LAZY_DAY_COUNT).isBefore();
}
/**
 * Create '<li>' for each Github events
 * ref) http://developer.github.com/v3/activity/events/types/
 *
 * Ignored:
 *   DeleteEvent
 *   DownloadEvent
 *   FollowEvent
 *   ForkApplyEvent
 *   MemberEvent
 *   PublicEvent
 *   TeamAddEvent
 *   WatchEvent
 *
 * @return <li> | null=Ignored type
 */
$a.eventDataToListItem = function(eventData){

    // Common
    var dateString = eventData.created_at;
    var createdAt = Date.create(eventData.created_at);
    var dateText = createdAt.relative();
    var isRecent = createdAt.addDays(+1).isFuture();
    var dateElement = $('<span class="date" />').text(dateText)
    if (isRecent) dateElement.addClass('date-color-recent');

    var commentText;
    var linkText = '';
    var linkHref = $a.GITHUB_URL;

    // Common mostly
    //   "GistEvent" don't have repo data, only
    if (eventData.repo.name !== '/') {
        linkText = eventData.repo.name.split('/')[1];
        if (linkText.length > 12) linkText = linkText.slice(0, 12) + '..';
        linkHref = $a.GITHUB_URL + '/' + eventData.repo.name;
    }

    // Each type
    if (
        eventData.type === 'CommitCommentEvent' ||
        eventData.type === 'IssueCommentEvent' ||
        eventData.type === 'PullRequestReviewCommentEvent'
    ) {
        commentText = 'Commented on ';
    } else if (eventData.type === 'CreateEvent') {
        commentText = 'Created ';
    } else if (eventData.type === 'ForkEvent') {
        commentText = 'Forked to ';
    } else if (eventData.type === 'GistEvent') {
        commentText = 'Created ';
        linkText = 'gist:' + eventData.payload.gist.id;
        linkHref = 'https://gist.github.com/' + eventData.payload.gist.id;
    } else if (eventData.type === 'GollumEvent') {
        commentText = 'Edited wiki for ';
    } else if (eventData.type === 'IssuesEvent') {
        commentText = 'Opened issue for ';
    } else if (eventData.type === 'PullRequestEvent') {
        commentText = 'Pull-Requested to ';
    } else if (eventData.type === 'PushEvent') {
        commentText = 'Pushed to ';
    } else {
        return null;
    }

    var commentElement = $('<span class="comment" />').text(commentText);
    var linkElement = $('<a target="_blank" />').text(linkText).attr({
        href: linkHref
    });

    var li = $('<li />');
    li.append(dateElement);
    li.append($('<br />'));
    li.append(commentElement);
    li.append(linkElement);

    return li;
}


$a.init = function(){
    $a.adjustStyles([$a.frameWidth, $a.frameHeight]);

    $('#visit_site').attr('href', $e.productionSiteUrl);

    if ($a.isActive === false) return;

    $.Deferred().resolve().then(function(){
        var d = $a.loadData();
        return $.when(d.promise()).done(function(){
            /* no process */
        }).fail(function(){
            throw new Error('Failed request to github api');
        });
    }).then(function(){
        if ($a.isSuccessedGettingData() === false) return;

        $('#header img').attr('src', $a.getAvatarUrl());

        $('#header a').attr({
            href: $a.GITHUB_URL + '/' + $a.githubUsername
        }).text($a.githubUsername);

        if ($a.isLazy()) {
            $('#header').append(
                $('<span class="is_lazy" />').text('is lazy')
            );
        }

        var ul = $('<ul />').appendTo('#activities_container');
        var itemCount = 0;
        $a.githubUserEventsData.data.each(function(eventData){
            var li = $a.eventDataToListItem(eventData);
            if (li !== null) {
                ul.append(li);
                itemCount += 1;
            }
            if (itemCount >= $a.maxItemCount) {
                return false;
            }
        });
    }).then(function(){
        //console.log($a.githubUserEventsData);
    });
}

}());
