var $e = {};
var $f = {};
var $a = {};

$f.parseUrlToParameters = function(url){
    var params = {};
    if (/^.+?\?./.test(url)) {
        var pairs = url.replace(/^.+?\?/, '').split('&');
        var i, pair;
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i].split('=');
            params[pair[0]] = ((pair[1] !== undefined)? pair[1]: "");
        };
    };
    return params;
}

$a.LAST_CACHED_AT_KEY = 'last_cached_at';
$a.GITHUB_USER_EVENTS_DATA_KEY = 'github_user_events_data';
$a.CACHE_LIFETIME = 60 * 10 * 1000; // 10 mins
$a.GITHUB_API_URL = 'https://api.github.com';
$a.urlParams = $f.parseUrlToParameters(document.URL);
$a.githubUsername = $a.urlParams.u;
$a.frameWidth = ~~$a.urlParams.w;
$a.frameHeight = ~~$a.urlParams.h;
$a.frameBorderWidth = 1;
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
$a.getGithubUserEventsApiUrl = function(username){
    return $a.GITHUB_API_URL + '/users/' + username + '/events';
}
$a.githubUserEventsData = null;
$a.isEnabledCache = function(){
    var lastCachedAt;
    var userEventsData;
    if (window.localStorage === undefined) {
        return false;
    } else {
        lastCachedAt = parseInt(localStorage.getItem($a.LAST_CACHED_AT_KEY));
        userEventsData = $.evalJSON(localStorage.getItem($a.GITHUB_USER_EVENTS_DATA_KEY));
        if (
            isNaN(lastCachedAt) ||
            userEventsData === null ||
            lastCachedAt + $a.CACHE_LIFETIME < (new Date()).getTime()
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
        localStorage.setItem($a.LAST_CACHED_AT_KEY, (new Date()).getTime());
        $.ajax(
            $a.getGithubUserEventsApiUrl($a.githubUsername),
            { dataType:'jsonp', callback:'callback' }
        ).then(function(data){
            $a.githubUserEventsData = data;
            localStorage.setItem($a.GITHUB_USER_EVENTS_DATA_KEY, $.toJSON(data));
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

$a.init = function(){
    $a.adjustStyles([$a.frameWidth, $a.frameHeight]);

    $.Deferred().resolve().then(function(){
        var d = $a.loadData();
        return $.when(d.promise()).done(function(){
            /* no process */
        }).fail(function(){
            throw new Error('Failed request to github api');
        });
    }).then(function(){
        if ($a.isSuccessedGettingData() === false) return;

        $('#header a').attr({
            href: 'https://github.com/' + $a.githubUsername
        }).text($a.githubUsername);

        $('#header img').attr('src', $a.getAvatarUrl());
    }).then(function(){
        console.log($a.githubUserEventsData);
    });
}
