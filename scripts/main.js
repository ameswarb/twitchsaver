var featuredRoute = 'https://api.twitch.tv/kraken/streams/featured?' +
                    'limit=12&geo=US&lang=en&on_site=1';

var pluckedChNames = function (channels) {
  var output = [];

  for (var i = 0; i < channels.length; i++) {
    if (output.length < 6 && !channels[i].stream.channel.mature) {
      output.push(channels[i].stream.channel.name);
    }
  }

  return output;
};

var vertPos = function (i) {
  if (i < 3) { return 'top'; } else { return 'bottom'; }
};

var horzPos = ['left', 'middle', 'right'];

var streamRoute = [
  'http://player.twitch.tv/?channel=',
  '&amp;html5&amp;volume=0&amp;muted=true',
];

var embedTemplate = function (channel, order) {
  return '<div class="video ' + vertPos(order) + ' ' + horzPos[order % 3] + '">' +
           '<div class="overlay">' +
             '<iframe src="' + streamRoute[0] + channel + streamRoute[1] + '"></iframe>' +
           '</div>' +
         '</div>';
};

var getParams = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
  function decode(s) {
    return decodeURIComponent(s.split('+').join(' '));
  }

  getParams[decode(arguments[1])] = decode(arguments[2]);
});

$(document).ready(function () {

  if (getParams.theme) {
    $('body').removeClass('tube');
  }

  if (!getParams.promo) {
    $('.promo').hide();
  }

  $.get(featuredRoute, function (data) {
    var myChannels = pluckedChNames(data.featured);

    for (var i = 0; i < myChannels.length; i++) {
      $('body').append(embedTemplate(myChannels[i], i));
    }
  });

  if (window.location.href.indexOf('https://') > -1) {
    $(location).attr('href', 'http' + window.location.href.substring(5));
  }
});
