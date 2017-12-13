/*see playset.js in same dir for source*/
/* Copyright(c)2008-2017 Internet Archive. Software license AGPL version 3. */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Class that iterates over A/V items, playing them in a playlist.
// JS file can be added to a page and will try to find a place to append a "Play All" link.
// Whatever items the user sees in their page, when they click "Play All", will get added to a new
// playlist and their browser gets redirected to the first item.
// After each item is finished playing, the browser will redirect to next item, until done.
// User is free to move around the playlist at any time.
//
// xxx better theatre shift code?
// xxx share/link as modal?
// xxx cleanup/improve descriptions for description-less items?


// convenient, no?  Stateless function, global to all Play objects
//   eslint-disable-next-line  no-console
var log = location.host.substr(0, 4) !== 'www-' ? function () {} : console.log.bind(console);

/* global  jwplayer */

var Playset = function () {
  function Playset() {
    _classCallCheck(this, Playset);

    this.id = false;
    this.selector_play_items = false;
    this.selector_playlist = false;

    // only proceed for folks w/ modern browsers..
    if (typeof localStorage === 'undefined') return;

    // Check for, in this order:
    //   "SIMILAR ITEMS" (AKA "Also Found") on items /details/ page (at bottom)
    //   search results page
    //   collection item page
    // We can add a nice "Play All" link to any of them.
    //
    // NOTE: for "SIMILAR ITEMS", IFF we wanted _more_ than 10, we could add a simple
    // PHP /services/ new script with something like:
    //   $rel_ids = (new RelatedItemsFetcher())->fetch($id,$collections,75 0,'5s','production');

    this.selector_play_items = $('#also-found h5,   #search-actions, .welcome-right');
    this.selector_playlist = $('#theatre-ia-wrap, #search-actions, .welcome-right'

    // basically, give up, but in case somehow "show_playlist()" fires, dont fatal:
    );if (!this.selector_playlist.length) this.selector_playlist = 'body';

    if (!this.selector_play_items.length) {
      this.selector_play_items = false;
    } else {
      $(this.selector_play_items).append('<span id="playplayset"/>');
      var htm = React.createElement(
        'a',
        { className: 'stealth', href: '#play-items', onClick: Playset.create_playlist_goto_first_item },
        React.createElement('span', { className: 'iconochive-play', 'aria-hidden': 'true' }),
        React.createElement(
          'span',
          { className: 'sr-only' },
          'play'
        ),
        React.createElement(
          'span',
          { className: 'hidden-xs-span' },
          ' Play All'
        ),
        React.createElement('br', null)
      );

      ReactDOM.render(htm, $('#playplayset').get(0)

      /* this makes it so people can conveniently pass around/share playlists! eg:
           https://archive.org/details/georgeblood&and[]=blues&autoplay=1
      */
      );if (Playset.arg('autoplay') && !Playset.arg('playset')) setTimeout(Playset.create_playlist_goto_first_item, 2500);
    }

    if (Playset.arg('playset')) {
      // proceed when item OR collection /details/ page!
      this.id = location.href.match(/archive\.org\/details\/([^/&?]+)/)[1];
      if (!this.id) return;

      // setup mobile area
      if (!$('#playset-xs').length) $('#theatre-ia-wrap').after('<div id="playset-xs" class="hidden-sm hidden-md hidden-lg"><div/></div>');

      this.show_playlist();
      Playset.skip_unplayable_item();

      Playset.resizer();
    }

    log('playset ready');
  }

  _createClass(Playset, [{
    key: 'show_playlist',
    value: function show_playlist() {
      var _this = this;

      var playset = Playset.get_playset();
      var found = false;

      var list = '';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = playset.list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          list += Playset.playlist_item(v[0], v[1], v[2], v[3]);
          if (this.id === v[0]) found = true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!found) return; // browser _has_ a playlist, but current item /details/ page isnt in playlist

      var htm = '\n' + Playset.playlist_header(playset) + '\n<div class="playset-list">\n  ' + list + '\n</div>\n';
      $('body').addClass('playset');
      $('body').addClass($('#theatre-ia-wrap').length ? '' : ' playset-hdr-only');
      $(this.selector_playlist).prepend('<div id="playset-ia">' + htm + '</div>');

      setTimeout(function () {
        _this.autoscroll_playlist();
      }, 500

      // per request, clicking on a bookreader should "pause"
      );$(document).ready(function () {
        $('#texty iframe').on('load', function () {
          // Make sure iframe is loaded
          $('#texty iframe').contents().click(Playset.pause);
        });
      });
    }
  }, {
    key: 'autoscroll_playlist',
    value: function autoscroll_playlist() {
      // scroll the playlist to the entry that is the /details/item we are are at now
      var off = $('#playset-ia div[data-id="' + this.id + '"').offset();
      if (off) {
        var bump = $('#playset-xs:visible').length ? 10 : $('#navwrap1').height();

        var top = off.top - bump - $('#playset-ia .playset-hdr').height();

        log('scrolling playset to ', top);
        $('#playset-ia .playset-list').scrollTop(top);
      }
    }
  }], [{
    key: 'create_playlist_goto_first_item',
    value: function create_playlist_goto_first_item(evt) {
      log('create_playlist_goto_first_item()');
      var playlist = [];
      var also_found_clicked = $('#also-found').length;
      var selector_tile_finder = also_found_clicked ? '#also-found .item-ia' : '.item-ia:visible';

      $(selector_tile_finder).each(function (key, val) {
        var $val = $(val);
        var id = $val.attr('data-id');
        if (id.match(/^__/)) return; // skip non-items -- eg: __mobile_header__

        // find tile title (for either item tile or collection tile)
        var ttl = Playset.truncate($val.find('.item-ttl,.collection-title a').text(), 35);
        var by = Playset.truncate($val.find('.byv').text(), 75);
        var year = $val.attr('data-year');
        var desc = Playset.truncate($val.next().find('.C234 > span:first').text(), 75);
        playlist.push([id, ttl, by.length ? by : desc, year]);
      });

      Playset.set_playset(playlist);

      if (Playset.mobile) Playset.play_mobile(playlist);else location.href = '/details/' + playlist[0][0] + '&autoplay=1&playset=1';

      evt.preventDefault();
      evt.stopPropagation();
      return false;
    }
  }, {
    key: 'play_mobile',
    value: function play_mobile(playlist) {
      // For best experience on iOS, only way to step through a bunch of A/V _automatically_ and in
      // a locked home screen is a (carefully constructed) full-on single M3U playlist.
      // We use a back-end service to construct that for us, and filter out non-audio items
      var ids = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = playlist[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var e = _step2.value;
          // ES6!
          ids.push(e[0]);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      location.href = '../services/playset30e8.html?ids=' + ids.join(',');
    }
  }, {
    key: 'resizer',
    value: function resizer() {
      // setup a browser resize / orient change listener
      if (!Playset.resizer_listening) {
        Playset.resizer_listening = true;
        $(window).on('resize  orientationchange', function () {
          clearTimeout(Playset.throttler);
          Playset.throttler = setTimeout(Playset.resizer, 250);
        });
      }

      // now see where playset "should be" -vs- where it is placed right now
      // first see if xs div is visible
      var should_be = $('#playset-xs:visible').length ? 'playset-xs' : 'theatre-ia-wrap';
      var at_now = $('#playset-ia').parent().attr('id');
      log('browser resize: ', should_be, ' -v- ', at_now);

      if (should_be === at_now) return; // all set!

      if (should_be === 'playset-xs') $('#playset-ia').appendTo('#playset-xs > div');else $('#playset-ia').prependTo('#' + should_be);
      log('playset moved');
    }
  }, {
    key: 'playlist_header',
    value: function playlist_header(playset) {
      var src = playset.src + '&autoplay=1';
      return '\n<div class="playset-hdr">\n  <div>\n    <a href=' + src + '>Playlist</a>\n    ' + Playset.glyph('beta') + '\n  </div>\n  <div id="playset-pp">\n    <a href="#" onClick="return Playset.pause()">\n      ' + Playset.glyph('Pause') + '\n    </a>\n    <a href="#" onClick="return Playset.play()" style="display:none">\n      ' + Playset.glyph('play') + '\n    </a>\n  </div>\n  <div>\n    <a href=' + src + '>\n      ' + Playset.glyph('share') + '\n    </a>\n  </div>\n</div>\n';
    }
  }, {
    key: 'playlist_item',
    value: function playlist_item(id, ttl, desc, year) {
      return '\n<div class="playset-item" data-id=' + id + '>\n  <a href="/details/' + id + '&autoplay=1&playset=1">\n    <div class="topinblock playset-img">\n      <img src="/services/img/' + id + '"/>\n    </div><div class="topinblock">\n      ' + Playset.item_year(year) + '\n      <b>\n        ' + ttl + '\n      </b><br/>\n      ' + desc + '\n    </div>\n  </a>\n</div>';
    }
  }, {
    key: 'item_year',
    value: function item_year(year) {
      if (!year) return '';

      return '\n<div style="float:right">\n  (' + year + ')\n</div>';
    }
  }, {
    key: 'skip_unplayable_item',
    value: function skip_unplayable_item() {
      // after 3 seconds, see if item even tried to load an A/V player.
      // if not, auto-advance to next item
      Playset.unplayable_timer = setTimeout(function () {
        if (typeof jwplayer === 'undefined' || !$(Playset.avplayer).length) Playset.goto_next_item();
      }, 3000);
    }
  }, {
    key: 'goto_next_item',
    value: function goto_next_item() {
      var id = location.href.match(/\/details\/([^/&?]+)/)[1];
      var playlist = Playset.get_playlist();
      var prev = '';
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = playlist[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var v = _step3.value;

          if (id === prev) location.href = '/details/' + v[0] + '&autoplay=1&playset=1';
          prev = v[0];
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'onComplete',
    value: function onComplete(jw, evt) {
      // We're in a playlist on an item /details/ page, and A/V player just finished playing a
      // track.  If we're "done" (whatever that means for an item -- sometimes "done" means before
      // all tracks have played!):
      //   then auto-advance to next /details/ page item in playlist, with full browser page
      //        refresh to it.
      //   else noop
      var idx = jw.getPlaylistIndex();
      var len = jw.getPlaylist().length;
      var done = idx + 1 >= len || evt && evt.done;
      if (!done) return; // keep playing until item is finished

      Playset.goto_next_item();
    }
  }, {
    key: 'get_playlist',
    value: function get_playlist() {
      // Retrieves current playlist from browser local storage;  or null if none or parse errors
      var playset = Playset.get_playset();

      if (typeof playset.list === 'undefined') return playset; // version 0.9

      return playset.list; // version 1.0
    }
  }, {
    key: 'get_playset',
    value: function get_playset() {
      // Retrieves (entire) playlist (object) from browser local storage;
      // or null if no list or parse errors, etc.
      return JSON.parse(localStorage.getItem('playset'));
    }
  }, {
    key: 'set_playset',
    value: function set_playset(playlist) {
      // Stores playlist into browser local storage.
      // Stamps creation times in case we ever want to expire/trim them if we allow for 2+ playsets.
      var date = new Date();
      var item = {
        version: '1.1',
        src: (location.pathname + location.search).replace(/&autoplay=1/, ''),
        created: date.toJSON(),
        createdTS: Math.round(date.getTime() / 1000),
        list: playlist };
      localStorage.setItem('playset', JSON.stringify(item));
    }

    // parse a CGI arg

  }, {
    key: 'arg',
    value: function arg(theArgName) {
      var try_full = true;
      var sArgs = location.search.slice(1).split('&');
      if (try_full && location.search === '') sArgs = location.href.slice(1).split('&');

      var r = '';
      for (var i = 0; i < sArgs.length; i++) {
        if (sArgs[i].slice(0, sArgs[i].indexOf('=')) === theArgName) {
          r = sArgs[i].slice(sArgs[i].indexOf('=') + 1);
          break;
        }
      }
      return r.length > 0 ? unescape(r).split(',') : '';
    }
  }, {
    key: 'pause',
    value: function pause() {
      log('playset pause');

      if (typeof jwplayer !== 'undefined' && $(Playset.avplayer).length) {
        var jw = jwplayer(Playset.avplayer.substr(1));
        if (jw && jw.getState()) {
          if (jw.getState().toUpperCase() === 'PLAYING') jw.pause();else jw.play
          // toggle play to pause icon
          ();$('#playset-pp a').toggle();
          return false;
        }
        return false;
      }

      if (Playset.unplayable_timer) {
        clearTimeout(Playset.unplayable_timer);
        Playset.unplayable_timer = null;
        $('#playset-pp a').toggle();
      }

      return false;
    }
  }, {
    key: 'play',
    value: function play() {
      log('play/resume');

      if (typeof jwplayer !== 'undefined' && $(Playset.avplayer).length) {
        var jw = jwplayer(Playset.avplayer.substr(1));
        if (jw && jw.getState()) {
          if (jw.getState().toUpperCase() !== 'PLAYING') jw.play
          // toggle pause to play icon
          ();$('#playset-pp a').toggle();
          return false;
        }
        return false;
      }

      if (!Playset.unplayable_timer) {
        Playset.skip_unplayable_item();
        $('#playset-pp a').toggle();
      }

      return false;
    }
  }, {
    key: 'glyph',
    value: function glyph(name) {
      return '<span class="iconochive-' + name + '" aria-hidden="true"></span>\n             <span class="sr-only">' + name + '</span>';
    }
  }, {
    key: 'truncate',
    value: function truncate(str, n) {
      var ret = str.trim().replace(/\s+/g, ' ');
      if (ret.length <= n) return ret;
      return ret.substr(0, n) + '..';
    }
  }]);

  return Playset;
}();

// on DOM ready, invoke constructor to setup


Playset.avplayer = '#jw6';
Playset.resizer_listening = false;
Playset.unplayable_timer = null;
Playset.mobile = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
$(function () {
  return new Playset();
});

