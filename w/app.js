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
$a.githubUserData = null;
$a.githubUserEventsData = null;
$a.githubApiUrl = 'https://api.github.com';
$a.githubUserApiUrl = $a.githubApiUrl + '/users/' + $a.githubUsername;
$a.githubUserEventsApiUrl = $a.githubUserApiUrl + '/events';

$a.init = function(){
    $a.adjustStyles([$a.frameWidth, $a.frameHeight]);

    $.Deferred().resolve().then(function(){
        var d1 = $.Deferred();
        $.ajax($a.githubUserApiUrl, { dataType:'jsonp', callback:'callback' }).then(function(data){
            $a.githubUserData = data;
            d1.resolve();
        });
        var d2 = $.Deferred();
        $.ajax($a.githubUserEventsApiUrl, { dataType:'jsonp', callback:'callback' }).then(function(data){
            $a.githubUserEventsData = data;
            d2.resolve();
        });
        return $.when(d1.promise(), d2.promise()).done(function(){
            /* no process */
        }).fail(function(){
            throw new Error('Failed request to github api');
        });
    }).then(function(){
        $('#header a').attr({
            href: 'https://github.com/' + $a.githubUsername
        }).text($a.githubUsername);
        $('#header img').attr('src', $a.githubUserData.data.avatar_url);
    }).then(function(){
        console.log($a.githubUserData);
        console.log($a.githubUserEventsData);
    });
}
