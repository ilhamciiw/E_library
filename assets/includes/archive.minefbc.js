/*see archive.js in same dir for source*/
/* Copyright(c)2008-2017 Internet Archive. Software license AGPL version 3. */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function jquery_no_conflict($) {
  // convenient, no?  Stateless function, global to all Play objects
  //   eslint-disable-next-line  no-console
  var log = location.host.substr(0, 4) !== 'www-' ? function () {} : console.log.bind(console);

  // class memnonic: Archive JS

  var AJS = function () {
    function AJS() {
      _classCallCheck(this, AJS);
    }

    _createClass(AJS, null, [{
      key: 'tvAD',
      // NOTE: needs to stay in sync w/ archive.less

      /* global  archive_analytics  jwplayer */
      /* eslint no-underscore-dangle: ["error", { "allow": ["_modal_add"] }] */

      value: function tvAD(elm) {
        var in_show = $(elm).parents('.shows');
        var id = void 0;
        var chan = void 0;
        var show = void 0;
        if (in_show.length) {
          // see if we've already gotten and displayed the "Air date" section...
          var opened = $(elm).parent().find('.shows');
          if (opened.length) {
            // ... yes, simply close/open it
            opened.toggle();
            return false;
          }
          chan = in_show.attr('data-chan');
          show = $(elm).text();
        } else {
          chan = $(elm).text();
          id = 'menu-chan-'.concat(chan);
          var div = $('#' + id);
          if (div.length) {
            div.toggle();
            return false;
          }
        }

        var url = location.href + '?channel=' + chan;
        if (in_show.length) url += '&program='.concat(encodeURIComponent(show));
        log(url);

        $.get(url, function (htm) {
          if (in_show.length) {
            $(elm).parent().append('<div data-chan="' + chan + '" class="shows"><h5>Air date</h5><div>' + htm + '</div></div>');
          } else {
            $(elm).parent().append('<div id="' + id + '" data-chan="' + chan + '" class="shows"><h4>Show</h4><div>' + htm + '</div></div>');
          }
        });

        return false;
      } // NOTE: needs to stay in sync w/ archive.less

    }, {
      key: 'nav_tophat_setup',
      value: function nav_tophat_setup() {
        if (!$('#nav-tophat').length) return;

        if (AJS.isTouchDevice()) $('body').addClass('touch');else AJS.logoText

        // TV items, TV top page, and TV 9/11 grid pages have top position:fixed div elements.
        // So, they arent compatible yet w/ the "nav tophat".
        ();if ($('body').hasClass('nav-tophat-over')) {
          var navHT = false;
          var styles = {
            '#nav-tophat': '',
            '.navbar': ''
          };
          $('#nav-tophat').on('show.bs.collapse', function () {
            // save out any current style="..." attr in each element we gonna adjust to open nav
            // tophat so that we can revert back when nav tophat closes
            if (navHT === false) {
              // eslint-disable-next-line  guard-for-in
              for (var i in styles) {
                styles[i] = $(i).attr('style');
              }
            }

            var tmp = $('#nav-tophat').css({
              position: 'fixed',
              width: '100%',
              'z-index': 10000001,
              top: 0
            }).outerHeight();

            if (navHT === false) navHT = tmp;
            $('.navbar').css({
              position: 'fixed',
              width: '100%',
              'z-index': 10000000,
              top: 0,
              'padding-top': navHT
            });
          }).on('hide.bs.collapse', function () {
            $('.navbar').css({ 'padding-top': 0 });
          }).on('hidden.bs.collapse', function () {
            // revert each element's style attr
            // eslint-disable-next-line  guard-for-in
            for (var i in styles) {
              $(i).attr('style', typeof styles[i] === 'undefined' ? '' : styles[i]);
            }
          });
        }

        $('#nav-tophat').on('show.bs.collapse', function () {
          return $('#navwrap1').addClass('hatted');
        }).on('hide.bs.collapse', function () {
          return $('#navwrap1').removeClass('hatted');
        });

        $('.navbar a.navia-link').on('click', function navhat_click(evt) {
          // are we in "mobile nav / xs width" mode?
          var xs = !$('#nav-tophat-helper:visible').length;
          var hat_open = $('#nav-tophat').hasClass('in');
          var navlink = this;

          // determine mediatype from either: (1) user hit text or (2) user hit icon
          var mt = $(evt.target).attr('data-top-kind') || $(evt.currentTarget).attr('data-top-kind');

          var isnow = $('.navbar .dropdown-ia.hatted a').attr('data-top-kind');

          if (!(xs && hat_open && isnow !== mt)) {
            // show the links for mediatype clicked
            $('.toprow').hide();
            $('.toprow.' + mt).show();
          }

          if (!hat_open) {
            $('#nav-tophat').collapse('show' // .. top hat is *not* open.  clicked, so open tophat

            );if (AJS.tophat_dont_count_first_open) {
              delete AJS.tophat_dont_count_first_open;
            } else if (typeof archive_analytics !== 'undefined') {
              // log that a user has opened the nav tophat, yayz
              archive_analytics.send_ping({
                service: 'ao_2',
                kind: 'event',
                ec: 'page_action',
                ea: 'nav_tophat_galactica',
                el: location.pathname,
                cache_bust: Math.random()
              });
            }
          }

          if (typeof isnow !== 'undefined') log('isnow', isnow);
          log('shouldB', mt);

          if (isnow === mt) {
            // 2nd click on same mediatype dropdown -- close tophat!
            $('#nav-tophat').collapse('hide');
            return false;
          }

          if (xs && hat_open && isnow !== mt) {
            // Mobile/xs nav and user has clicked on *another* nav/MT icon.
            // So we want to (animate) close the tophat, and when closed,
            // reopen (animate) to the right open tophat -- this is because
            // mobile/xs makes the tophat heights much more arbitrary
            // and it looks weird hard jumping to other open area at another height!
            $('#nav-tophat').one('hidden.bs.collapse', function () {
              setTimeout(function () {
                return $(navlink).click();
              }, 100);
            });
            $('#nav-tophat').collapse('hide');
            return false;
          }

          $('.navbar .dropdown-ia').removeClass('hatted').has('.' + mt).addClass('hatted');
          $('#nav-tophat').on('hidden.bs.collapse', function () {
            return $('.navbar .dropdown-ia').removeClass('hatted');
          }

          // any click makes tophat hide...
          );$(document).one('click.tophat.nixer', function (event) {
            var $e = $(event.target
            // log($e)
            );if ($e.attr('id') === 'nav-wb-url') return; // ... except clicking on wayback machine form input
            if ($e.is('a')) return; // ... except clicking on a link
            if ($e.hasClass('item-img') || $e.hasClass('item-ia')) return;

            // NOTE: if not open, we wont hide
            $('#nav-tophat.in').collapse('hide');
          });

          return false;
        });
      }
    }, {
      key: 'isTouchDevice',
      value: function isTouchDevice() {
        return 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
      }
    }, {
      key: 'footer',
      value: function footer() {
        if (!AJS.isTouchDevice() && typeof $.fn.tooltip !== 'undefined') {
          $('.navbar [data-toggle="tooltip"], .container-ia [data-toggle="tooltip"], #nav-tray [data-toggle="tooltip"], #cols [data-toggle="tooltip"], #tvbanner [data-toggle="tooltip"]').tooltip({}
          // $('body').addClass('glyphs-as-text')
          );
        }
      }
    }, {
      key: 'wrapdark_watcher',
      value: function wrapdark_watcher() {
        // no longer needed/used but has some handy techniques...
        if (!AJS.$sharedown) {
          AJS.$sharedown = $('#sharedown');
          AJS.$wrapdark = $('#wrapdark');
        }

        // every second, sigh, check/adjust for the wrapdark height
        if (!AJS.wrapdark_watcher_ptr) AJS.wrapdark_watcher_ptr = setInterval(AJS.wrapdark_watcher, 1000);

        if (!AJS.$sharedown.length || !AJS.$wrapdark.length) {
          clearInterval(AJS.wrapdark_watcher_ptr);
          return;
        }

        var wrapdarkHT = AJS.$sharedown.offset().top + AJS.$sharedown.find('.panel-heading').innerHeight();
        if (parseInt(AJS.$wrapdark.css('height'), 10) !== wrapdarkHT) {
          AJS.$wrapdark.css({ height: wrapdarkHT }).show();
          log('       WRAPDARK-ED to ', wrapdarkHT);
        }
      }
    }, {
      key: 'flash_click',
      value: function flash_click(flashy) {
        $.cookie('avpref2', flashy ? null : 'flash', { path: '/' });

        window.top.location.href = location.href;
        return false;
      }
    }, {
      key: 'mute_click',
      value: function mute_click() {
        var mutedNOW = !$.cookie('unmute');

        if (this.emulator) {
          this.emulator.setMute(!mutedNOW);
        } else {
          var player = jwplayer('jw6');
          if (player) {
            var volnow = player.getVolume();
            if (volnow) {
              AJS.mute_click_prior_volume = volnow;
              player.setVolume(0);
            } else {
              player.setVolume(typeof AJS.mute_click_prior_volume === 'undefined' ? 100 : AJS.mute_click_prior_volume);
            }
          }
        }

        $('#theatre-ia .iconochive-mute, #theatre-ia .iconochive-unmute').toggle();

        if (mutedNOW) {
          // sounds is off.  make it loud
          $.cookie('unmute', 1, { path: '/details', expires: 30 });
        } else {
          // sounds is on.  mute it!
          $.cookie('unmute', null, { path: '/details' });
        }

        return false;
      }
    }, {
      key: 'emulate_setup',
      value: function emulate_setup(game) {
        // eslint-disable-next-line  no-param-reassign
        game.toString = function () {
          return game.path;
        };
        AJS.emulator = new IALoader($('#canvas').get(0), game, null, game.scale ? parseFloat(game.scale) : 1, game.module.indexOf('dosbox') === 0 ? '/images/dosbox.png' : '/images/mame.png');

        $('#theatre-ia .iconochive-unmute, #theatre-ia .iconochive-mute').hide();
        if ($.cookie('unmute')) $('#theatre-ia .iconochive-unmute').show();else $('#theatre-ia .iconochive-mute').show();

        AJS.theatre_controls_position();
        $(window).on('resize  orientationchange', function () {
          clearTimeout(AJS.theatre_controls_position_throttler);
          AJS.theatre_controls_position_throttler = setTimeout(AJS.theatre_controls_position, 250);
        });
      }
    }, {
      key: 'emulate',
      value: function emulate() {
        /* global  canvas  IALoader  DOSBOX  JSMESS  Module */

        // move the virtual keyboard thing and give it a "go away!" button
        $('.ui-keyboard').prepend('\n        <button style="position:relative;top:-5px;right:-8px;" type="button" class="close"\n                onclick="$(\'.ui-keyboard\').removeClass(\'showing\').hide()" aria-hidden="true">\n          <span class="iconochive-remove-circle"></span></button>').appendTo($('#emulate .posrel')).addClass('showing');

        $('#jsmessSS').fadeOut('slow');
        $('#canvasholder').css('visibility', 'visible');
        AJS.emulator.start

        // setup the theatre-ia fullscreen button
        ();var EM = JSMESS || DOSBOX || false;
        if (EM && (canvas.webkitRequestFullScreen || canvas.mozRequestFullScreen || canvas.requestFullScreen)) {
          $('#gofullscreen').on('click', function () {
            return Module.requestFullScreen(1, 0);
          }
          /**/);if ('onfullscreenchange' in document) document.addEventListener('fullscreenchange', EM.fullScreenChangeHandler);else if ('onmozfullscreenchange' in document) document.addEventListener('mozfullscreenchange', EM.fullScreenChangeHandler);else if ('onwebkitfullscreenchange' in document) document.addEventListener('webkitfullscreenchange', EM.fullScreenChangeHandler);
        }

        // resize embeds to "vertically center"
        if ($('body').hasClass('embedded')) {
          var embed_vert_center = function embed_vert_center() {
            var blackness = $('body').height() - $('body.embedded #emulate').height();
            if (blackness > 1) {
              // log('blackness', blackness)
              $('body.embedded #emulate').css('margin-top', blackness / 2);
            }
          };
          setTimeout(embed_vert_center, 5000);
          setTimeout(embed_vert_center, 10000);
          setTimeout(embed_vert_center, 20000);
        }

        setTimeout(AJS.theatre_controls_position, 100);
        setTimeout(AJS.theatre_controls_position, 500);
        setTimeout(AJS.theatre_controls_position, 3000);
        setTimeout(AJS.theatre_controls_position, 10000);

        return false;
      }
    }, {
      key: 'theatre_controls_position',
      value: function theatre_controls_position($selectorIn, pegTop, widthIn, heightIn) {
        // We have lots of callers!  video, software, texts.
        // So sort out our args and where we gonna "peg"/glue things to...
        var $selector = $selectorIn;
        var video = heightIn && !$selectorIn;
        if (!video) {
          if (!$selectorIn) $selector = $('#canvas' // software emulation
          );if (!$selector.length) return; // protect against emulated embeds and undef...
        }

        var height = video ? heightIn : $selector.height();
        var width = video ? widthIn : $selector.width();

        if (!video && typeof pegTop !== 'undefined') $('#theatre-controls').offset({ top: pegTop }

        // Subtract out the width of the controls to get total amount of black pixels
        // to the right of the theatre object.
        // We want to position the controls in the middle of the dark pixels / right gutter!
        );var right_gutter_width = Math.round(($('#theatre-ia-wrap').width() - $('#theatre-controls').width() - width) / 2);
        log('width', width);
        log('right_gutter_width', right_gutter_width);

        $('#theatre-controls').css({
          height: height,
          visibility: 'visible',
          right: Math.max(20, right_gutter_width / 2)
        });
      }
    }, {
      key: 'booksize',
      value: function booksize() {
        if (!$('#texty').length) return;

        // Lendable books have a dialog in iframe, and use a different book sizing
        if ($('#texty').hasClass('lendable-book')) {
          var $textyiframe = $('#texty iframe');
          var initialHeight = $textyiframe.height();
          var lendableBooksize = function lendableBooksize() {
            var windowWidth = $(window).width();
            var windowHeight = $(window).height
            // These constants were chosen to be responsive on both axis
            // The values were "eyeballed" with regard to the lending dialogs.
            // Note: The goal is to ensure metadata below the book is visible
            ();if (windowWidth > 1100 && windowHeight > 820) {
              $textyiframe.css('height', 620);
            } else if (windowWidth > 800 && windowHeight > 689) {
              $textyiframe.css('height', 489);
            } else if (windowWidth > 800 && windowHeight <= 689) {
              $textyiframe.css('height', 389);
            } else {
              // The loan ui resizes vertically, so 0.75 is just good ratio visually
              $textyiframe.css('height', initialHeight * 0.75);
            }
          };

          $(window).on('resize  orientationchange', lendableBooksize);
          lendableBooksize

          // Change the bg on archive.org details page
          ();var changeBgColor = function changeBgColor() {
            var $contentDom = $($textyiframe.get(0).contentDocument);
            var $match = $contentDom.find('#BookReader');
            if ($match.length > 0) {
              $contentDom.find('body, #BookReader').css('background-color', 'transparent');
              return true;
            }
            return false;
          };
          if (!changeBgColor()) {
            var bgColorInterval = setInterval(function () {
              if (changeBgColor()) clearInterval(bgColorInterval);
            }, 200);
          }
          return;
        }

        if (!AJS.booksize_watching) {
          AJS.booksize_watching = true;
          $(window).on('resize  orientationchange', function () {
            clearTimeout(AJS.booksize_throttler);
            AJS.booksize_throttler = setTimeout(AJS.booksize, 250);
          });
        }

        // https://en.wikipedia.org/wiki/Book_size
        // Traditional book sizes/formats used in English-speaking countries.
        // Based on the 19"×24" printing paper size
        var aspect = (19 + 19) / 24; // ~1.6
        var metadataHeight = 100; // metadata peekaboo min height!

        var maxH = $(window).height() - $('#texty').offset().top - metadataHeight;
        var maxW = $('#texty').width();
        log('max rect avail', maxW, 'x', maxH);

        var vidW = maxW;
        var vidH = maxH;
        for (vidW = maxW; vidW >= 180; vidW--) {
          vidH = Math.round(vidW / aspect);
          if (vidH <= maxH) break;
        }
        log('fitting into rect', vidW, 'x', vidH

        // We want to vertically "center" books that are "very short" that
        // would otherwise be shorter than the new "minimum height" requirements
        // for the theatre
        );var minH = parseInt($('#theatre-ia-wrap').css('min-height'), 10);
        var padTop = minH > vidH ? Math.round((minH - vidH) / 2) : 0;

        $('#texty').css({ 'padding-top': padTop } // position bookreader vertically
        );$('#texty iframe').css({ width: vidW, height: vidH } // resize bookreader


        );setTimeout(function () {
          return !AJS.booksize_controls_hidden && AJS.booksize_controls();
        }, 500);
        setTimeout(function () {
          return !AJS.booksize_controls_hidden && AJS.booksize_controls();
        }, 750);
        setTimeout(function () {
          return !AJS.booksize_controls_hidden && AJS.booksize_controls();
        }, 1000);
        setTimeout(function () {
          return !AJS.booksize_controls_hidden && AJS.booksize_controls();
        }, 5000);
        setTimeout(function () {
          return !AJS.booksize_controls_hidden && AJS.booksize_controls();
        }, 10000);
      }
      // Hides the book controls, per david!
      // Also positions the "theatre controls"

    }, {
      key: 'booksize_controls',
      value: function booksize_controls() {
        var $iframe = $('iframe:first');
        if (!$iframe.length) return;
        var $iframeDOM = $($iframe.get(0).contentDocument);
        if (!$iframeDOM.length) return;

        if (!AJS.booksize_controls_hidden) {
          if (!$iframeDOM.find('#BRnav').length) {
            log('BOOK NOT READY YET');
            return;
          }
          if ($iframeDOM.find('#BRtwopageview').length > 0) {
            // Only hide nav in 2up. Show it in 1up
            $iframeDOM.find('#BRnav').hide();
          }
          AJS.booksize_controls_hidden = true;
          $('#texty iframe').css('visibility', 'visible');
          log('BOOK CONTROLS HIDDEN!');
        }

        $iframeDOM.find('body, #BookReader').css('background-color', 'transparent'

        // now position the theatre controls
        );var $book = $iframeDOM.find('#BRtwopageview, #BRpageview'
        // find out how much vertical black padding the bookreader put in *OVER* the book,
        // inside the iframe
        );var bookPadTop = $book.offset().top;
        // slide the iframe "up" that amount so that we get the wanted/intended standard
        // black padding above the book (~30px) and not more!
        log('bookPadTop: ', bookPadTop);
        if (bookPadTop > 1) $iframe.css({ 'margin-top': -1 * bookPadTop, 'margin-bottom': -1 * bookPadTop });else $iframe.css({ 'margin-top': '', 'margin-bottom': '' }

        // compute where the logical top point should be for the book and for the controls
        // (which is comparable to A/V items)
        );var $navbar = $('.navbar'
        // NOTE: we *do* check the nav top (almost always 0!) for rare cases we have a banner
        // *ABOVE* the navbar, eg: EOY donate banner campaign (which is above the nav)!
        );var pegTop = $navbar.offset().top + $navbar.height() + parseInt($('#theatre-ia').css('padding-top'), 10);
        AJS.theatre_controls_position($book, pegTop);
        log('book top', $iframe.offset().top + $book.offset().top, ' -v- pegTop', pegTop

        // and now dont overflow negative margin-bottom blackness into metadata section
        );$('#theatre-ia').css({ overflow: 'hidden' });
      }
    }, {
      key: 'popcornsize',
      value: function popcornsize() {
        var resizer = function resizer() {
          var metadataHeight = 100; // metadata peekaboo min height!
          var maxH = $(window).height() - $('iframe:first').offset().top - metadataHeight;
          var maxW = $('#theatre-ia .row').outerWidth
          // make max height at most 16x9 ratio (43px is the popcorn controls height)
          ();var WH = { width: maxW, height: Math.min(maxH, maxW * 9 / 16 + 43) };
          log('popcorn resize: ', WH);
          $('iframe:first').css(WH // resize popcorn
          );
        };
        resizer // page load event is now
        ();$(window).on('resize  orientationchange', function () {
          clearTimeout(AJS.popcorn_throttler);
          AJS.popcorn_throttler = setTimeout(resizer, 250);
        });
      }
    }, {
      key: 'pause',
      value: function pause() {
        var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'jw6';

        var jw = jwplayer(id);
        if (jw && jw.config && jw.getState() === 'PLAYING') jw.pause();
      }
    }, {
      key: 'morf',
      value: function morf(lnk, switchToA2Z) {
        // MORe Facets
        var href = $(lnk).attr('href');

        if (switchToA2Z && switchToA2Z[0] === '-') $.cookie(switchToA2Z.substr(1).concat('A2Z'), 1, { path: '/', expires: 1 });else if (switchToA2Z) $.cookie(switchToA2Z.concat('A2Z'), null, { path: '/', expires: 1 });

        var props = { selectorID: 'morf-modal' };
        var selector = '#' + props.selectorID;

        var contents = React.createElement(
          'div',
          { className: 'modal-dialog' },
          React.createElement(
            'div',
            { className: 'modal-content' },
            React.createElement(
              'div',
              { className: 'modal-header modal-header-std' },
              React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-hidden': 'true' },
                React.createElement('span', { className: 'iconochive-remove-circle' })
              ),
              React.createElement('h2', { className: 'modal-title' })
            ),
            React.createElement('div', { className: 'modal-body', id: props.selectorID.concat('-body') })
          )
        );
        if (!$(selector).length) $('body').prepend($('<div id="' + props.selectorID + '" class="modal fade" role="dialog" aria-hidden="true"/>'));

        ReactDOM.render(contents, $(selector).get(0));
        $(selector).modal('show');

        ReactDOM.render(React.createElement(AJS.MORFreact, { href: href }), $(selector + '-body').get(0));

        return false;
      }
    }, {
      key: 'add2list',
      value: function add2list(lnk) {
        var href = $(lnk).attr('href');

        $.get(href + '&headless=1&titlelist=' + $(lnk).text(), function (htm) {
          // dynamically add modal to page (if isnt there already)
          AJS.modal_go(lnk, {
            title: 'Add To List',
            headerClass: 'modal-header-new-list',
            ignore_lnk: true,
            auto_remove: true,
            body: htm
          });
        });

        return false;
      }
    }, {
      key: 'newlist',
      value: function newlist(lnk) {
        var href = $(lnk).attr('href');

        $.get(href.concat('&headless=1'), function (htm) {
          // dynamically add modal to page (if isnt there already)
          AJS.modal_go(lnk, {
            title: 'Create New List',
            headerClass: 'modal-header-new-list',
            ignore_lnk: true,
            body: htm
          });
        });

        return false;
      }
    }, {
      key: 'newlist_submit',
      value: function newlist_submit() {
        // Strings with SPACE characters will be changed to "camel case".
        // For example:
        //    "my LA roadtrip"
        // will become:
        //    "MyLaRoadtrip"
        // Letters, numbers, periods (.), dashes (-), or underscores (_) are ok, but
        // other characters will be removed.
        var title = $('#new-list-form input[name=title]').val();
        if (!title.length) {
          // eslint-disable-next-line  no-alert
          alert('Please enter a title for your List');
          return false;
        }

        // turn the title into an acceptable identifier
        // (1) remove any "bad" chars
        // (2) trim any *leading* chars like:  - _ .
        var cleaned = title.replace(/[^a-zA-Z0-9_\-.]/g, '').replace(/^[_\-.]+/, '');
        log(cleaned);

        if (!cleaned.length) {
          // eslint-disable-next-line  no-alert
          alert('Please try another title that contains more alphanumeric characters');
          return false;
        }

        return true;
      }
    }, {
      key: 'popover_menu',
      value: function popover_menu(selector, opts) {
        // setup options
        var options = {
          trigger: 'hover focus click', // make accessible
          container: selector,
          content: opts.content,
          html: true
          // do not overwrite values given by the 'data-' attribute
        };if (opts.title) options.title = opts.title;
        if (opts.placement) options.placement = opts.placement;
        if (opts.trigger) options.trigger = opts.trigger;

        // setup popover
        $(selector).popover(options);
      }

      // makes the tooltip show for picking dates

    }, {
      key: 'date_switcher',
      value: function date_switcher(htm) {
        var selector = '#date_switcher';

        // make a tooltip trigger manually, on hover, but then *hold it showing*
        // until they leave area *including* tooltip itself
        $(selector).tooltip({
          html: true,
          trigger: 'manual', // we gonna control hover behaviour
          placement: 'bottom',
          title: htm
        }).on('mouseenter focusin', function date_switcher_hover() {
          // check first if already showing, to avoid "flickering" with "show! .. show!"
          if (!$(selector).parent().find('.tooltip').length) $(this).tooltip('show');
        }

        // the date_switcher lives inside bigger "sortbar".  the date changing tooltip
        // lives inside it (and hangs off it).  So what we *really* want as the trigger
        // to hide the date change tooltip is the entire sortbar itself.  nice!
        );$('.sortbar').on('mouseleave', function () {
          log('not hovering sortbar anymore');
          $(selector).tooltip('hide');
        });

        $(selector).on('shown.bs.tooltip', function () {
          // make any link hit change which one is "in"
          // (just before page starts to reload)  finesse!
          $(selector).parent().find('.date_switcher').on('click', function date_switcher_click() {
            $(this).parents('.tooltip').find('.date_switcher.in').removeClass('in');
            $(this).addClass('in');
          });
        });
      }

      // NOTE: UNUSED BUT KEPT IN CASE WE EVER GO BACK FROM NEWER/BETTER CSS-ONLY SOLUTION!
      //
      // [ Now we use CSS to (max-/)width C2 and C4 *instead* for a much better user experience
      //   AND for a more efficient / kinder to browser non-JS solution! ]

    }, {
      key: 'tiles_to_list',
      value: function tiles_to_list() {
        /*
          First, allow natural HTM/CSS widths of 3 of 5 "table-cell" display type columns
           C1         C234      C5
           VIEWS  ..  DATE  ..  MT-ICON
            Compute width of "C234" - width of C3/DATE.
           Split TITLE (C2) and CREATOR (C4) max-width into
           60% / 40% split of that #pixels.
        */

        // NOTE: there can be 2+ sets of results on a page -- eg: "My Library" page!
        var selector = AJS.selector();
        var $selector = $(selector).first();
        log('lister() SELECTOR', selector);

        var C3 = $selector.find('.results .item-ia:first   .C3').outerWidth();
        var C234 = $selector.find('.results .item-ia:first .C234').outerWidth

        // the "-20" was empirically observed / made up -- get some science, girl!
        ();var availWidth = C234 - C3 - 20;
        var C2 = Math.max(80, Math.round(0.6 * availWidth));
        var C4 = Math.max(80, Math.round(0.4 * availWidth));
        log('C3  ', C3);
        log('C234', C234);
        log('C2  ', C2);
        log('C4  ', C4);
        log(' ==> availWidth: ', availWidth, '(', C2, '+', C4, ')');

        $selector.find('.results .item-ia .C2').css({ width: C2, 'max-width': C2 });
        $selector.find('.results .item-ia .C4').css({ width: C4, 'max-width': C4 });
      }

      // We moved to newer tactic Mar2015...
      // Pages are emitted by default with body classes "lists" and "showdetails".
      // We use JS to toggle/remove them and switch off details or switch to "tiles" mode.

    }, {
      key: 'lists_v_tiles_setup',
      value: function lists_v_tiles_setup(cookie_range) {
        // does user have any cookied preferences?
        var defaults = 'tiles'; // (cookie_range === 'search' ? 'lists' : 'tiles')
        var prefer = $.cookie('view-' + cookie_range);
        var showdetails = $.cookie('showdetails-' + cookie_range);

        var checked = showdetails === 'showdetails' || showdetails === null && defaults === 'lists';

        if (prefer === 'lists' || !prefer && defaults === 'lists') {
          if (checked) return; // perfect, we are already what they want
          $('body').removeClass('showdetails' // they dont want full details right now
          );
        } else {
          // switch to "tiles" mode
          $('body').removeClass('lists'.concat(checked ? '' : ' showdetails')).addClass('tiles');
        }
      }
    }, {
      key: 'showdetails_toggle',
      value: function showdetails_toggle(btn, cookie_range) {
        var $body = $('body');

        var to = $body.hasClass('showdetails') ? '' : 'showdetails';
        log('showdetails_toggle() going to: ', to);

        $.cookie('showdetails-' + cookie_range, to, { path: '/', expires: 30, domain: '.archive.org' });

        $body.toggleClass('showdetails');
      }
    }, {
      key: 'tiles_toggle',
      value: function tiles_toggle(btn, cookie_range) {
        var $body = $('body');

        var to = $body.hasClass('tiles') ? 'lists' : 'tiles';
        log('tiles_toggle() going to', to);

        $body.removeClass('lists tiles').addClass(to);
        AJS.tiler();

        $.cookie('view-' + cookie_range, to, { path: '/', expires: 30, domain: '.archive.org' });

        return false;
      }

      // Returns one of these, like "#ikind-[IKIND]"
      //
      // COLLECTION PAGES, ACCOUNT PAGES:
      //
      //   #ikind--downloads
      //   #ikind--titleSorter
      //   #ikind--publicdate
      //   #ikind--date
      //   #ikind--reviewdate
      //   #ikind--updatedate
      //   #ikind--creatorSorter
      //
      //   #ikind-downloads
      //   #ikind-titleSorter
      //   #ikind-publicdate
      //   #ikind-date
      //   #ikind-reviewdate
      //   #ikind-updatedate
      //   #ikind-creatorSorter
      //
      // ACCOUNT PAGES (additionally):
      //
      //   #ikind-loans-waiting-list
      //   #ikind-loans-on-loan
      //   #ikind-loans-history
      //
      // OTHER:
      //
      //   #ikind-search              (search)
      //

    }, {
      key: 'selector',
      value: function selector() {
        var inTab = $('.welcome .tabby.in .tabby-text').text().toLowerCase().trim();
        if (inTab === 'forum' || inTab === 'posts' || inTab === 'about') return false; // no tab of tiles are showing

        var selector = false;
        if (inTab) {
          // We want to end up with a selector like:
          //    #ikind-collections-title
          //    #ikind--publicdate
          log('inTab', inTab);
          var tmp = '#tabby-' + inTab;
          if (inTab === 'collection' || inTab === 'collections' || inTab === 'uploads') {
            selector = '#'.concat($(tmp.concat(' div.ikind.in:first')).attr('id'));
          } else {
            var ikind = $(tmp.concat(' .ikind.stealth.in:first')).text().toLowerCase().replace(/ /, '-');
            selector = '#ikind-' + inTab + (ikind === '' ? '' : '-') + ikind;
          }
        } else {
          // we want to end up with a selector like:
          //    #ikind-date
          selector = '#ikind-'.concat($('.ikind.stealth.in:first').text().toLowerCase().replace(/ /, '-'));
          if (!$(selector).length) selector = '#ikind-search'; // xxx  SHORE THIS UP, GIRL!
        }

        log('SELECTOR', selector);

        return selector;
      }

      // function that finds alternate (non-AJS.tiler()) sets of item tiles,
      // that are laid out in strips/columns and will hide entire columns
      // if they fall off the right side, in terms of fitting to browser/page width

    }, {
      key: 'tilebars',
      value: function tilebars() {
        // iterate over all row classes that have at least 1 .tilebars .results div in them...
        $('.row .tilebars').find('.results').parents('.row').each(function (k, row) {
          var first = false;
          $(row).find('.results').each(function (key, val) {
            $(val).show().css({ visibility: 'hidden' });
            if (!first) first = $(val).offset();
            if ($(val).offset().top !== first.top) $(val).hide();else $(val).css({ visibility: 'visible' });
          }
          // if (first) $(row).find('.tilebars > h4').css({'padding-left':first.left+10})
          );
        });
      }

      // adds collection parent hovering image and text to tiles

    }, {
      key: 'parent_hover',
      value: function parent_hover($selector) {
        $selector.find('.item-ia:not(.hov):not(.collection-ia):not(.account-ia)').addClass('hov').mouseover(function (e) {
          return $(e.currentTarget).find('.item-parent').addClass('hoverin');
        }).mouseout(function (e) {
          return $(e.currentTarget).find('.item-parent').removeClass('hoverin');
        });
      }
    }, {
      key: 'tiler',
      value: function tiler(selectorIn, noRecall) {
        var tileMarginH = 30;
        var tileMarginW = 17;

        // See lister() for why this is able to be commented out now!
        // $('.results .item-ia .C2, .results .item-ia .C4').css({'width':'','max-width':''});
        if (!$('body').hasClass('tiles')) {
          if ($('body').hasClass('showdetails')) $('.sortbar input[name=showdetails]').prop('checked', true
          // AJS.lister()
          );
        }

        var selector = selectorIn || AJS.selector();
        if (selector === false) return;

        var $selector = $(selector).first();
        var selectorID = $selector.attr('id');
        var $parentRow = $selector.parents('.row');

        if (!$('body').hasClass('tiles')) {
          $parentRow.css({ 'padding-left': '', 'padding-right': '' });
          return;
        }

        if (!AJS.tilerPREV) {
          // first time tiling page!
          AJS.tilerPREV = {
            winW: 0,
            pad: 0,
            nPerRow: 1,
            gutter: tileMarginW,
            tileWidth: AJS.TILE_WIDTH,
            unsourced: {},
            firstLeft: 0
          };

          AJS.parent_hover($selector);
        }

        if ($(window).width() !== AJS.tilerPREV.winW) {
          // First time, or page resize/orientation change.
          // We will effectively "cache" all this adjusting computations, so multiple calls to tiler()
          // can reuse if window width hasnt changed
          // (for efficiency, eg: many images still slowly loading..)
          $parentRow.css({ 'padding-left': '', 'padding-right': '' } // reset (see below)
          );AJS.tilerPREV.firstLeft = 0; // reset (see below)

          var $facets = $parentRow.find('.columns-facets:visible');
          var facetsWidth = $facets.outerWidth() || 0;
          if (facetsWidth) facetsWidth += 1 + parseInt($facets.css('padding-right'), 10 // add columns-items gutter
          );var availWidth = $parentRow.width() - facetsWidth;
          var gutter = availWidth < 400 ? 5 : tileMarginW;
          var tileWidth = $('.item-ia:first').outerWidth() >= AJS.TILE_WIDTH ? AJS.TILE_WIDTH : AJS.TILE_WIDTH_SMALL;
          var nPerRow = Math.max(1, Math.floor((availWidth + gutter) / (tileWidth + gutter)));
          var extra = Math.max(0, availWidth - nPerRow * (tileWidth + gutter) + gutter);

          log('tiling', selectorID, 'parentRowW', $parentRow.width(), 'facetsWidth', facetsWidth, 'availWidth: ', availWidth, 'number per row', nPerRow, '. ', 'With gutter margin', gutter, 'had ', extra, 'extra pixels');
          AJS.tilerPREV.pad = Math.round(extra / 2);

          AJS.tilerPREV.winW = $(window).width();
          AJS.tilerPREV.nPerRow = nPerRow;
          AJS.tilerPREV.gutter = gutter;
          AJS.tilerPREV.tileWidth = tileWidth;
        }

        if (AJS.tilerPREV.nPerRow > 1) $parentRow.css({ 'padding-left': AJS.tilerPREV.pad, 'padding-right': AJS.tilerPREV.pad });else AJS.tilerPREV.firstLeft = AJS.tilerPREV.pad;

        var nImgZeroHeight = 0;
        var nImgZeroHeightAry = [];
        var maxtop = 0;
        var tops = { 0: 0 };
        var lefts = { 0: AJS.tilerPREV.firstLeft };
        for (var i = 1; i < AJS.tilerPREV.nPerRow; i++) {
          lefts[i] = lefts[i - 1] + AJS.tilerPREV.gutter + AJS.tilerPREV.tileWidth;
          tops[i] = 0;
        }

        // Any item tiles w/ unloaded/set src tags get updated and loaded now!
        // Only have to do this pass on a swathe of new results (1st page or infin scroll set added)
        if (!AJS.tilerPREV.unsourced[selectorID]) {
          log('unsourcing', selectorID
          // eslint-disable-next-line  prefer-arrow-callback
          );$selector.find('.item-ia img[source]').each(function tiler_unsourcing(k, v) {
            $(v).attr({
              src: $(v).attr('source'),
              onError: '$(this).attr("src","/images/notfound.png")'
            }).removeAttr('source');
          });
          AJS.tilerPREV.unsourced[selectorID] = 1;
        }

        AJS.colPREV = -1; // we track where previous tile was placed

        $selector.find('.item-ia').not('.mobile-header').css('visibility', 'hidden').each(function (idx, val) {
          var $val = $(val);
          var $valHT = $val.innerHeight
          // log('$valHT', $valHT)

          ();var css = {};
          {
            var col = 0;
            if (AJS.tilerPREV.nPerRow > 1 && idx >= AJS.tilerPREV.nPerRow) {
              // First, cycle from last placed tile column location to "first cycled slot".
              // (That is, move "1 to right" from last placed tile column, but it's a cycle/ring
              // for final column -- go to 1st column in that case).
              // Test place new tile *there* (in "first cycled slot") UNLESS further ahead in
              // cycle/ring of other slots, the tile will fit where its BOTTOM will be above where
              // tile TOP would be in the "first cycled slot".
              // (and pick the "first" in such a case if 2+ slots like that)
              var colTEST = (AJS.colPREV + 1) % AJS.tilerPREV.nPerRow;
              col = colTEST; // fallback/default
              var cmpTEST = tops[colTEST] - $valHT; // [slightly more efficient way 2 compare]
              for (var _i = 0; _i < AJS.tilerPREV.nPerRow; _i++) {
                if (_i !== colTEST && cmpTEST > tops[_i]) {
                  col = _i;
                  break;
                }
              }
            } else {
              col = idx % AJS.tilerPREV.nPerRow;
            }
            AJS.colPREV = col;
            css.visibility = 'visible';
            css.top = tops[col];
            css.left = lefts[col];

            // setup for next tile...
            tops[col] += $valHT + tileMarginH;

            maxtop = Math.max(maxtop, tops[col]);
          }

          $val.css(css

          // track how many tile images are without height
          // (either not loaded or no CSS height style set if img not loading from DB)
          );var tmp = $val.find('.item-img');

          if (tmp.length && !$val.find('.item-img').height()) {
            nImgZeroHeight += 1;
            tmp = $val.attr('data-id');
            if (tmp) nImgZeroHeightAry.push(tmp);
          }
        }

        // we have to manually set the height of the "selector"
        );log('maxtop', maxtop);
        $selector.find('.results').css({ height: maxtop });

        if ($('body').hasClass('manage')) {
          $('.item-ia:not(.removable)').addClass('removable').append('<div class="xer" onclick="return AJS.unmanage(this)" title="remove item from being submitted to item management"></div>');
        }

        if (nImgZeroHeight && !noRecall) {
          log(nImgZeroHeight, ' img (still w/o height); recall tiler(', selector, ')...', nImgZeroHeightAry.join(',')
          // recall ourselves, but not more than once every 1.5 seconds!
          );clearTimeout(AJS.tiler_throttler);
          AJS.tiler_throttler = setTimeout(function () {
            return AJS.tiler(selector, 0);
          }, 1500);
        }
      }
    }, {
      key: 'ikind',
      value: function ikind(lnk, id) {
        var idsel = '#' + id;
        log('ikind', id);
        $(idsel).parent().find('div.ikind.in').hide();
        $(idsel).removeClass('hidden').addClass('in').show();
        $(idsel).parents('.tabby-data').find('a.ikind').removeClass('in');

        $(lnk).addClass('in');

        AJS.tiler(idsel

        // now select the corresponding element in the shadowing select for mobile
        );var $sel = $(idsel).parents('.tabby-data').find('select.ikind-mobile');
        var $new = $sel.find('option:contains('.concat($(lnk).text(), ')'));
        var $now = $sel.find('option:selected');
        if ($new.text().trim() !== $now.text().trim()) {
          log('changing ikind mobile now to ', $new.text());
          AJS.ikind_mobile_change_ignore_next = true;
          $new.attr('selected', 'selected'
          // $now.removeAttr('selected')
          );
        }

        return false;
      }
    }, {
      key: 'ikind_mobile_change',
      value: function ikind_mobile_change(elm) {
        if (AJS.ikind_mobile_change_ignore_next) {
          AJS.ikind_mobile_change_ignore_next = false;
          return;
        }

        var $selopt = $(elm).find('option:selected');
        log('ikind mobile changed to: ', $selopt.text());
        var $ikinds = $(elm).parents('.tabby-data').find('a.ikind');
        if (!$ikinds.length) {
          // NO tabby!  eg: top page or search page
          $ikinds = $('body').find('a.ikind');
        }

        if (!$ikinds.length) return; // uho!

        var $ikind = $ikinds.filter(function (k, v) {
          return $(v).text() === $selopt.text();
        });

        var href = $ikind.attr('href');
        log('goto', href);

        if (href) {
          if (href.substr(0, 1) === '#') {
            // ACCOUNT PAGE (FOR NOW)!  (STILL USES HASH FOR NOW)
            $('a.ikind[data-id=' + href.substr(1) + ']').click();
          } else {
            location.href = href;
          }
        }
      }
    }, {
      key: 'popState',
      value: function popState(pageType) {
        // are we watching history.pushState() and history.popState() calls?
        AJS.pushState = typeof history.pushState !== 'undefined';
        log('popState(', pageType, ') called, modern browser: ', AJS.pushState ? 'y' : 'n');

        if (pageType) // anything custom we need to do based on pageType?
          return;

        var tabPick = function tabPick(hash2arg) {
          var tab = AJS.arg('tab', true);
          if (tab) tab = '#tabby-' + tab + '-finder';else if (hash2arg) tab = '#tabby-' + hash2arg + '-finder';else tab = '.tabby-default-finder';

          if (AJS.pushState) log('goto tab: ', tab, ' ################################################### STATE');
          AJS.tabby_no_pushState_next_click = true;
          $(tab).click();
        };

        if (AJS.pushState) {
          // runs on page load or browser "back":
          $(window).on('popstate', function () {
            return tabPick();
          });
        }
        // else user has an older browser or Opera Mini and doesn't have pushState/popState!

        tabPick();
      }
    }, {
      key: 'tabby',
      value: function tabby(lnk, id) {
        log('AJS.tabby()', id);
        var inTab = id.replace(/tabby-/, '').trim();
        if (inTab === 'uploads' || inTab === 'collections' || inTab === 'loans') {
          // account pages -- we need to fully reload page w/ new/wanted item tiles!
          return true;
        }

        // Only collection pages have tabs / proceed
        // All three tabs have all the markup on the page already.
        // So, for modern browsers, we will simply switch the visibile
        // tab and update-in-place the url in the browser url typein
        // -- WITHOUT refreshing the page.

        $('.tabby-data.in').removeClass('in').hide();
        $('#' + id).removeClass('hidden').addClass('in').show();
        $('.tabby').removeClass('in');
        $(lnk).parents('.tabby').addClass('in');

        if (AJS.tabby_no_pushState_next_click) {
          delete AJS.tabby_no_pushState_next_click;
        } else if (AJS.pushState && typeof history.pushState !== 'undefined') {
          var href = $(lnk).attr('href');
          var locNOW = location.href;
          var locNEW = location.protocol.concat('//', location.host, href);
          if (locNOW !== locNEW) {
            log('pushState: ', href, ' ################################################### STATE');
            history.pushState({}, '', locNEW);
          }
        }

        if (inTab === 'collection' || inTab === 'about') {
          // collection pages
          if (inTab === 'about') AJS.grafs();
          AJS.tiler();
        }

        if (AJS.pushState) return false;
        return true;
      }
    }, {
      key: 'colclick',
      value: function colclick(e) {
        var $e = $(e);
        var id = $e.attr('data-id'

        // *NORMALLY* clicking on a collection tile goes to it.
        // BUT NOT:
        //   * in lists mode (only the identifier link does that -- not other data columns!)
        //   * if in process of removing items (eg: from favorites list)
        );if (id && $('body').hasClass('tiles') && !$e.hasClass('removable')) location.href = '/details/' + id;
      }
    }, {
      key: 'list_remove_item',
      value: function list_remove_item(xer) {
        if ($('body').hasClass('lists')) $('.tiles-button:visible').click // sorry!  only works in tiles mode now...


        ();if (!xer) {
          if (!$('.item-ia .xer').length) {
            // make all items editable
            $('.item-ia').addClass('removable').append('<div onclick="AJS.list_remove_item(this)" class="xer" alt="remove this item from list" title="remove this item from list"></div>');
          } else {
            // cancel editability
            $('.item-ia').removeClass('removable');
            $('.item-ia .xer').remove();
          }
        } else {
          // single item is slated for utter destruction from the list...
          var $item = $(xer).parents('.item-ia');
          var idX = $item.attr('data-id');
          var url = location.href.replace(/#.*$/, '').concat('&remove_item=', idX
          // Use the most recent update date to help uniquely identify the item!
          );if ($item.attr('data-date')) url += '&data-date=' + $item.attr('data-date');
          if (AJS.listkind) url += '&kind=' + AJS.listkind;
          log('GET', url);

          $.get(url, function (htm) {
            log('GOT', url);
            log(htm);
            $item.remove();
            AJS.tiler();
          });
        }
        return false;
      }

      // remove an element from a search results page

    }, {
      key: 'unmanage',
      value: function unmanage(xer) {
        $(xer).parent('.item-ia').next().remove // remove item list portion
        ();$(xer).parent('.item-ia').remove // remove item tile portion
        ();return false;
      }

      // submits search results items to item manager for invoking operations on the list

    }, {
      key: 'manage',
      value: function manage() {
        // get list of all (remaining) identifiers in a search results page
        var ids = $('.item-ia[data-id]').toArray().reduce(function (a, b) {
          var id = $(b).attr('data-id');
          if (id === '__mobile_header__') return a;
          return a.concat(id, ',');
        }, '');
        log('MANAGE', ids);

        if (ids !== '') {
          // now make a form that we can POST to, with all the identifiers,
          // and post to /manage/ page
          var $form = $('\n          <form id="manage-ids" method="POST" action="/manage/"\n                style="visibility:hidden;position:absolute;top:0;left:0;width:1px;height:1px;">\n            <input type="text" name="identifier" value="' + ids + '"/>\n          </form>');
          $('body').append($form // NOTE: firefox needs it in DOM to submit
          );$form.submit();
        }
        return false;
      }
    }, {
      key: 'head_img_dragdrop_setup',
      value: function head_img_dragdrop_setup(identifier) {
        if (AJS.head_img_dragdrop_setup_done) return;
        log('head_img_dragdrop_setup');
        AJS.head_img_dragdrop_setup_done = true;

        $('#file-dropper-wrap').bind('mouseenter', function () {
          log('enter');
          AJS.head_img_replaceable(identifier);
          $('#file-dropper').show();
        }).bind('mouseleave', function () {
          log('ouddie');
          if (!AJS.file_picked) $('#file-dropper').hide();
        });

        $('body').bind('dragover', function (evt) {
          // enable file dropping
          log('dragover');
          evt.stopPropagation();
          evt.preventDefault();

          AJS.head_img_replaceable(identifier);
          $('#file-dropper').addClass('drag_over').show();
          return false;
        });

        $('body').bind('dragleave', function (evt) {
          log('dragleave'

          // are we still over a file-dropper div/img?
          );var over = $('#file-dropper-wrap').is(':hover') || $('#file-dropper     ').is(':hover') || $('#file-dropper-img ').is(':hover');
          var x = evt.pageX || evt.originalEvent.pageX;
          var y = evt.pageY || evt.originalEvent.pageY;
          if (!over) {
            var e = $('#file-dropper-wrap');
            var left = e.offset().left;
            var top = e.offset().top;
            if (x >= left && x <= left + e.outerWidth() && y >= top && y <= top + e.outerHeight()) {
              // still over the file drop target image area!
              over = true;
            }
          }
          if (!over) {
            var _e = $('#file-dropper');
            var _left = _e.offset().left;
            var _top = _e.offset().top;
            if (x >= _left && x <= _left + _e.outerWidth() && y >= _top && y <= _top + _e.outerHeight()) {
              // still over the file drop target image area!
              over = true;
            }
          }

          if (!over) $('#file-dropper').removeClass('drag_over').hide();
        });
      }
    }, {
      key: 'head_img_replaceable',
      value: function head_img_replaceable(identifier) {
        // helpfuls:
        //  https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
        //  http://www.sitepoint.com/html5-ajax-file-upload/
        if ($('#file-dropper').html().trim() !== '') return;

        $('#file-dropper').show().html('\n<div>\n  <button id="file-cancel" type="button" class="close" data-dismiss="alert" aria-hidden="true"\n          title="cancel file upload" alt="cancel file upload">\n    &times;\n  </button>\n  <b>\n    <span style="font-size:40px; color:#aaa" class="iconochive-plus-circle" />\n  </b><br/>\n  <b>\n    Drag & Drop an image file here or\n  </b>\n  <button type="button" class="btn btn-info btn-xs" onclick="$(\'#file-selector\').click();">\n    Pick image to upload\n  </button>\n  <form method="POST" action="/services/post-file.php?submit=1&identifier=' + identifier + '"\n        enctype="multipart/form-data" id="poster">\n    <div class="hidden">\n      <input id="file-selector" name="file" type="file" accept="image/*"/>\n    </div>\n    <input type="hidden" name="identifier" value="' + identifier + '"/>\n    <input id="file-submit" type="submit" name="submit" value="SUBMIT" class="btn btn-success"/>\n    <div id="file-uploading">\n      Uploading your file..\n    </div>\n  </form>\n</div>');

        $('#file-cancel').bind('click', function (evt) {
          AJS.cancelFile();

          evt.stopPropagation();
          evt.preventDefault();
          return false;
        });

        $.event.props.push('dataTransfer' // if not set, dataTransfer is not sent


        );var success = function success() {
          log('success!'
          // AJS.cancelFile()
          );
        };

        // upload an image (typically a collection/list header or account/person profile)  via S3
        // returns '' on success; else string w/ error/fail reason
        var uploadFile = function uploadFile() {
          var fail = false;

          if (typeof XMLHttpRequest === 'undefined') fail = 'browser appears to not have HTML5 functionality';

          if (!fail) fail = AJS.badFile();

          var xhr = new XMLHttpRequest();
          if (!fail) {
            log(AJS.file2post);
            if (!xhr.upload) fail = 'browser submit setup failed';
          }

          if (fail) return fail;

          // start upload
          log('post'
          // if (navigator.userAgent.indexOf('Safari') > 0) xhr.timeout = 10 * 60 * 1000; // 10 min
          );xhr.open('POST.html', location.protocol.concat('//', location.host, 'services/post-file75a5.html?submit=1&amp;identifier=', identifier, '&fname=', encodeURIComponent(AJS.file2post.name)), false // block synchronously on the post!
          // if (!options.sendBoundary) xxx
          );xhr.setRequestHeader('Content-Type', 'multipart/form-data; charset=UTF-8');
          xhr.send(AJS.file2post);

          var reply = xhr.responseText;
          var mat = reply.match(/SUCCESS \(task_id=(\d+)\)/);
          if (mat && mat.length) {
            var task_id = mat[1];
            log('STALKING TASK_ID: ', task_id);

            $('#file-dropper').html('waiting for updates..');
            var stalker_ptr = false;
            var stalker = function stalker() {
              log('STALKING...');
              $.ajax({
                type: 'GET',
                url: '/catalog_status.php?where=task_id='.concat(task_id, '&rand=', Math.random()),
                dataType: 'xml',
                success: function success(xml) {
                  log(xml);
                  var x = {
                    green: parseInt($(xml).find('wait_admin0').text(), 10) || 0,
                    blue: parseInt($(xml).find('wait_admin1').text(), 10) || 0,
                    red: parseInt($(xml).find('wait_admin2').text(), 10) || 0
                  };
                  log(x);
                  var nWait = x.green + x.blue + x.red;
                  $('#file-dropper').html('waiting for ' + nWait + ' tasks to run');
                  if (!nWait) {
                    log('task(s) done!');
                    clearInterval(stalker_ptr);
                    $('#file-dropper').html('reloading page with your image');
                    location.href = location.href; // ready! reload the page!
                  } else if (x.red) {
                    $('#file-dropper').html('<div class="alert alert-danger">status task failure -- an admin will need to resolve</div>');
                    clearInterval(stalker_ptr);
                  }
                }
              });
            };

            // every 2 seconds, check for status
            stalker_ptr = setInterval(stalker, 2000);
          } else {
            log(reply);
          }

          log('post done');
          return '';
        };

        $('#file-selector').bind('click', function () {
          AJS.file_picked = 'selected';
        }).bind('change', function (evt) {
          log('file dropdown selected!');
          $('#file-submit, #file-cancel').show();
          log(evt);
          if (evt.target && evt.target.files && evt.target.files.length) {
            AJS.file2post = evt.target.files[0];
            AJS.previewFile();
          }
        });

        $('#file-dropper').bind('drop', function (evt) {
          // we've been dropped a file (from a drag-and-drop)!
          evt.stopPropagation();
          evt.preventDefault();

          log(evt.dataTransfer.files);
          $('#file-dropper').removeClass('drag_over');

          $('#file-submit, #file-cancel').show();

          if (evt.dataTransfer.files.length) {
            AJS.file_picked = 'dropped';
            AJS.file2post = evt.dataTransfer.files[0];

            AJS.previewFile();
          }
        });

        $('#poster').bind('focusin', function (evt) {
          log(evt.type);
          $('#file-uploading').show();
        }).bind('submit', function (evt) {
          log('submit!');
          $('#file-uploading').show

          // First try the schmancy HTML5 submit via XMLHttpRequest and FileReader.
          // If we fail, we'll fallback to form submit normal action.
          ();var fail = uploadFile();
          if (fail === '') {
            // SUCCESS!  we are done!
            success();
            evt.stopPropagation();
            evt.preventDefault();
            return false;
          }

          if (AJS.file_picked === 'dropped') {
            // we had client drag-n-drop the file -- we can't post it!
            // epic fail...
            AJS.cancelFile
            // eslint-disable-next-line  no-alert
            ();alert('Failure: ' + fail);
            evt.stopPropagation();
            evt.preventDefault();
            return false;
          }

          // OK fallback to normal (selected) file submit (and full page reload)!
          return true;
        }

        // now center file-dropper over current image
        );var w1 = $('#file-dropper-img').outerWidth();
        var h1 = $('#file-dropper-img').outerHeight();
        var w2 = $('#file-dropper').outerWidth();
        var h2 = $('#file-dropper').outerHeight();
        $('#file-dropper').css({
          left: Math.round((w1 - w2) / 2),
          top: Math.round((h1 - h2) / 2)
        });

        if (AJS.ios) {
          $('#file-dropper > form > div.hidden').removeClass('hidden');
          $('#file-dropper > button').addClass('hidden');
        }
      }

      // client-side preview the image directly in the browser!  xxx catch exceptions, etc.

    }, {
      key: 'previewFile',
      value: function previewFile() {
        $('#file-dropper .uppreview').remove // remove any prior upload/preview

        ();if (AJS.badFile()) {
          AJS.cancelFile();
          return false;
        }

        if (typeof FileReader === 'undefined') return false;

        var reader = new FileReader();
        reader.onload = function (evt) {
          log(evt.target);
          var im = new Image();
          im.src = evt.target.result;
          $('#file-dropper').append(im);
          $(im).addClass('uppreview'
          // $('#file-dropper').css(
          //      {'background':'url(' + evt.target.result + ') no-repeat center center'})
          );
        };

        log(AJS.file2post);
        reader.readAsDataURL(AJS.file2post);
        return true;
      }
    }, {
      key: 'cancelFile',
      value: function cancelFile() {
        $('#file-dropper .uppreview').remove // remove any prior upload/preview
        ();$('#file-dropper, file-submit, #file-cancel, #file-uploading').hide();
        if (AJS.file_picked) delete AJS.file_picked;
        if (AJS.file2post) delete AJS.file2post;
      }
    }, {
      key: 'badFile',
      value: function badFile() {
        var fail = false;

        if (!fail && !AJS.file2post) fail = 'file is missing';

        // php upload_max_filesize is 8M
        if (!fail && AJS.file2post.size > 8000000) fail = 'file is over 8MB in size';

        if (!fail) {
          var type = AJS.file2post.type.toLowerCase();
          if (type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/gif') fail = 'file not required format of JPEG or PNG or GIF';
        }

        if (fail)
          // eslint-disable-next-line  no-alert
          alert(fail);

        return fail;
      }

      // for microfilm books with many months of newspapers in PDF
      //   eg: /details/la_caleagle_reel1
      //
      // paginfo is a logical hashmap JSON object of:
      //   YYYYMMDD => [comma separated list of pages]
      // eg:
      //   20080129 =>  "1,2,3,11,17"

    }, {
      key: 'drawPDF',
      value: function drawPDF(identifier, pageinfo) {
        var urlstart = '/download/'.concat(identifier, 'index.html', identifier, '_pdf.zip/index.html', identifier, '_pdf/index.html', identifier, '_');
        var multi_year = false;
        var last_year = false;

        // eslint-disable-next-line  guard-for-in
        for (var key in pageinfo) {
          var year = key.substr(0, 4);
          if (last_year === false) last_year = year;
          if (last_year !== year) {
            multi_year = true;
            break;
          }
        }

        var sep = '';
        var str = sep;
        var lastyearmonth = 666;
        // eslint-disable-next-line  guard-for-in
        for (var _key in pageinfo) {
          // log(key); log(pageinfo[key]);
          var pages = pageinfo[_key].split(',');
          var _year = _key.substr(0, 4);
          var month = parseInt(_key.substr(4, 2), 10);
          var day = parseInt(_key.substr(6, 2), 10);
          var yearmonth = _year.concat('-', month);
          var skip_day = false;

          var monthName = '';
          if (yearmonth !== lastyearmonth) {
            /**/if (month === 1) monthName = 'January';else if (month === 2) monthName = 'February';else if (month === 3) monthName = 'March';else if (month === 4) monthName = 'April';else if (month === 5) monthName = 'May';else if (month === 6) monthName = 'June';else if (month === 7) monthName = 'July';else if (month === 8) monthName = 'August';else if (month === 9) monthName = 'September';else if (month === 10) monthName = 'October';else if (month === 11) monthName = 'November';else if (month === 12) monthName = 'December';else if (month === undefined) monthName = 'Single Page PDFs';else /*             */monthName = 'Unknown_'.concat(month);

            if (multi_year) monthName = _year.concat(' ', monthName

            // make header/a that shows/hides a hidden div after it with the month's data
            );str += str ? '</div><!--mo--><br/>' : '';
            str += '\n<a href="#' + monthName + ',' + _year + '" onclick="$(\'#m' + yearmonth + '\').toggle(); return false">\n  <span class="iconochive-folder" /> ' + monthName + '\n</a>\n<div class="mo" id="m' + yearmonth + '">';
          }

          // make header/a that shows/hides a hidden div after it with the page data
          if (day === undefined || day === '') skip_day = true;
          if (skip_day) {
            str += '<div class="day">';
          } else {
            str += '\n<div class="day">\n  <a href="#' + yearmonth + '-' + day + '"\n     onclick="$(\'#m' + yearmonth + 'd' + day + '\').toggle();return false;">\n    <span class="iconochive-folder" /> ' + day + '\n  </a>\n<div class="pages" id="m' + yearmonth + 'd' + day + '">';
          }

          // drop in the individual page links
          var offset = 1;
          var page = void 0;
          var pnum = void 0;
          for (var j = 0; j < pages.length; j++) {
            page = pages[j];
            if (!page)
              // eslint-disable-next-line  no-continue
              continue;
            if (offset > 0) offset = 1 - page;
            pnum = parseInt(page, 10) + offset;

            // left 0-pad to 4 digits as needed
            page = '0000'.concat(page);
            page = page.substr(page.length - 4, 4);

            var url = urlstart.concat(page, '.pdf');
            str += '<a href="' + url + '">[' + pnum + ']</a> ';
          }

          if (skip_day) str += '</div>';else str += '</div><!--pages--></div><!--day-->';

          lastyearmonth = yearmonth;
        }

        str += '</div><!--mo-->';

        // replace the "pdfs" empty div with our hefty HTML
        $('#pdfs .replaced').html(str);
      }

      // for collection pages, [About] tab

    }, {
      key: 'grafs',
      value: function grafs() {
        var $grafs1 = $('#grafs1');
        var $grafs2 = $('#grafs2');
        if (!$grafs1.length) return;
        if (typeof $grafs1.attr('data-id') === 'undefined') return;

        var identifier = $grafs1.attr('data-id');
        $grafs1.attr('data-id', null);

        log('loading grafs');
        $grafs1.html('<i><small>loading graph <img src="images/loading.gif"/></small></i>').show();
        $grafs2.html('<i><small>loading graph <img src="images/loading.gif"/></small></i>').show();
        var tok = '<h2>';
        $.get('/details/'.concat(identifier, '&grafs=1&v=3'), function (htm) {
          var a = htm.split(tok);
          if (a.length >= 3) {
            $('#activity-reviewsN').html(a[1]).parents('.activity-box').show();
            $('#activity-forumN  ').html(a[2]).parents('.activity-box').show();
          }
          if (a.length === 5) {
            $grafs1.html(tok + a[3]);
            $grafs2.html(tok + a[4]);
          } else {
            $grafs1.html('(graph data not available)');
            $grafs2.html('(graph data not available)');
          }
        });
      }
    }, {
      key: 'quick_down',
      value: function quick_down(id, target) {
        var idsel = '#' + id;

        if (!$('.format-group.in').length) {
          // no set of files for a single format showing... yet!
          var format = $(target).text();
          var $formatGroup = $(idsel).parents('.format-group');

          $('.download-button').html(format.concat(' FILES'));
          $formatGroup.addClass('in'
          // hide the other summary formats (one-liner) clickables
          );$('.format-group:not(.in)').slideUp();
          $(idsel).slideDown();
        } else {
          // re-open all the summary formats (one-liner) clickables
          $('.format-group').slideDown(400
          // close the open set of single files
          );setTimeout(function () {
            // ftw, thx for nothing jquery
            $('.format-group.in').removeClass('in');
            $('.download-button').html('DOWNLOAD OPTIONS');
          }, 400);
          $(idsel).slideUp();
        }

        return false;
      }

      // parse a CGI arg

    }, {
      key: 'arg',
      value: function arg(theArgName, try_full) {
        var sArgs = try_full && location.search === '' ? location.href.slice(1).split('&') : location.search.slice(1).split('&');
        for (var i = 0; i < sArgs.length; i++) {
          if (sArgs[i].slice(0, sArgs[i].indexOf('=')) === theArgName) {
            var r = sArgs[i].slice(sArgs[i].indexOf('=') + 1);
            return r.length > 0 ? unescape(r).split(',') : '';
          }
        }
        return '';
      }
    }, {
      key: 'search_this_list',
      value: function search_this_list() {
        var urlIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var form = arguments[1];

        var url = urlIn;
        if (urlIn.trim() === '') {
          // take the page's current url, minus any hash
          var searchlist_submit_re = new RegExp(location.hash.concat('$'));
          url = location.href.replace(searchlist_submit_re, '');
        }

        // remove any infinite scroll "&page=N" arg
        url = url.replace(/&page=\d+/, '');

        var query = $(form).find('.searchlist').val();

        if (query !== '') url += (location.search === '' ? '?' : '&').concat('and[]=', query

        // add back in any hash (eg: tab selected)
        );url += location.hash;

        location.href = url;
        return false;
      }

      // setup trigger on 1/2 second of hovering over the nav IA logo

    }, {
      key: 'logoText',
      value: function logoText() {
        var hideLogoText = function hideLogoText() {
          $('#internet-archive').fadeOut('slow', function () {
            $('#internet-archive').remove();
            $('#exit-er').show();
          });
        };

        var mousetimer = false;

        // axxx make sure when it opens on TAB, the about li is in the DOM *next*
        $('.navbar-nav:first').on('mouseenter focusin', function (evt) {
          // Only proceed if user is interacting with the logo elements.
          if (!$(evt.target).is('ul, .navbar-brand, .iconochive-logo, .logo-text-hider')) return;

          mousetimer = setTimeout(function () {
            if ($('#internet-archive').length) {
              hideLogoText();
              return;
            }

            $('#exit-er').hide // (gets in the way of xs/mobile!)
            ();$('.navbar-nav:first').prepend(
            // flank the IA logo!
            $('\n<div id="internet-archive" class="hidden-xs logo-text-hider"\n    style="position:absolute; top:10px; width:100%; text-align:center;">\n  <div class="topinblock logo-text-hider" style="width:100px; padding-left:10px;">\n    <div class="logo-text-hider"\n        style="display:none; width:85px; height:30px; background:transparent -35px top no-repeat url(/images/footer.png)" />\n  </div><div class="topinblock logo-text-hider" style="width:35px;height:1px;" /><div class="topinblock logo-text-hider" style="width:100px;">\n    <div class="logo-text-hider" style="display:none; width:85px; height:30px; background:transparent -116px top no-repeat url(/images/footer.png)" />\n  </div>\n</div>')

            // both of the above divs are hidden.  now fade them in
            );$('#internet-archive > div > div').fadeIn('slow');
          }, 1000);
        }).mouseleave(function () {
          if (mousetimer) clearTimeout(mousetimer);
        });
      }
    }, {
      key: 'scrolled',
      value: function scrolled() {
        var newtop = $(window).scrollTop
        // log('scrolled to ', newtop)

        ();var selector = '.more_search:visible';
        var $e = $(selector);
        if (!$e.length) return;

        // make the edge detect for "hit bottom" 40 pixels from the bottom
        var check = $e.offset().top + $e.outerHeight() - $(window).height() - 40;
        // log('-v- check', check)
        if (newtop > check) {
          log('hit rock bottom > ', check);
          if (!AJS.more_searching) $(selector.concat(' > a')).click();
        }
      }
    }, {
      key: 'more_search',
      value: function more_search(lnk, urlIn, page_now) {
        var selector = AJS.selector();
        if (selector === false) return false;

        var ikind = selector.replace(/#ikind-/, '');
        var tumble = ikind === '' && $('.tumbles').length;
        if (tumble) {
          ikind = 'views';
          selector = 'body'; // heh
        }

        var $more_search = $(selector.concat(' .more_search')

        // we stash a reference of what page the client has requested, so we can increment it on
        // each "more_search hit
        );var pageKey = selector;
        if (typeof AJS.page_map[pageKey] === 'undefined') AJS.page_map[pageKey] = page_now || 1;

        if (AJS.page_map[pageKey] < 0) {
          // $more_search.find('.more-search-all').show()
          return false; // all results showing -- no more for the ikind avail so noop/ignore
        }

        AJS.page_map[pageKey] += 1;
        var page = AJS.page_map[pageKey];

        $more_search.find('.more-search-fetching').show();

        AJS.more_searching = true;

        var url = urlIn + page;
        var urlreplace = location.protocol.concat('//', location.host, url);
        url += '&scroll=1';

        log('url: ', url // url to AJAX get next page
        );log('urlreplace', urlreplace // url to change browser location (visually) to


        );if (tumble) {
          var seen = '';
          $('.tumbles').each(function (k, v) {
            seen += $(v).attr('data-idx').concat(',');
          });
          url.concat('&seen=', seen);
        }

        log('more_search(selector=', selector, 'sort=', ikind, 'page=', page, 'url=', url, ')'
        // log(AJS.page_map)


        );$.get(url, function (htm) {
          if (htm.length < 100 && $(htm).find('div.no-results')) {
            // no more results avail/found.  we have reached infinity!
            $more_search.find('.more-search-fetching, a.btn').hide
            // $more_search.find('.more-search-all').show()
            ();AJS.page_map[pageKey] = -1; // flag to ignore future more_search attempts
            AJS.more_searching = false;
            return;
          }

          var selectorID = $(selector).attr('id');
          if (AJS.tilerPREV && AJS.tilerPREV.unsourced && AJS.tilerPREV.unsourced[selectorID]) delete AJS.tilerPREV.unsourced[selectorID];

          if (tumble) {
            $('.results').append(htm);
            $more_search.find('.more-search-fetching').hide();
            AJS.more_searching = false;
            return;
          }

          if (AJS.pushState && typeof history.replaceState !== 'undefined') history.replaceState({}, '', urlreplace);

          var $selector = $(selector.concat(' .results'));
          $selector.append(AJS.addNotes(AJS.addingNotesKind, htm)

          // re-tile and re-flow!  (the force should flow through you)
          );AJS.tiler(selector);
          $more_search.find('.more-search-fetching').hide();
          AJS.more_searching = false;

          AJS.parent_hover($selector

          // OK, this is quite a bit more subtle...  the HTM has been dropped in,
          // *and* we've done a basic re-tiling.  however, it's very likely many
          // of the images are still loading.  so listen for image "is loaded" events
          // if they trickle in, and at most re-tile every 1 second (even if they
          // likely trickling in at a faster rate than that) until they all loaded
          );$(selector.concat(' img')).on('load', function () {
            clearTimeout(AJS.more_search_throttler);
            AJS.more_search_throttler = setTimeout(AJS.tiler, 1000);
          });

          if (typeof archive_analytics !== 'undefined') archive_analytics.send_scroll_fetch_event(page);
        });

        return false;
      }

      // when embed codes are being show, adjust their heights so they show all the content/codes!

    }, {
      key: 'embed_codes_adjust',
      value: function embed_codes_adjust() {
        log('showing embeds!'

        // these are found (only) on /details/ pages
        );var _arr = ['embedcodehere', 'embedcodehereWP'];
        for (var _i2 = 0; _i2 < _arr.length; _i2++) {
          var embid = _arr[_i2];
          var $embid = $('#' + embid);
          $embid.removeAttr('rows').css('height', '');

          var embtxt = $embid.text

          // this is *puke* city -- since textareas are a PITA, make a shadow div w/ the
          // text we want in it, trying to be same width, same font-size, etc.
          // and *then* insert into DOM invisibily so we can calculate its overall height
          // .. and then peg the textarea height to that height
          ();$('body').prepend($('<div/>').attr({
            id: embid + 'Shadow',
            class: 'textarea-invert-readonly roundbox5'
          }).css({
            position: 'absolute',
            visibility: 'hidden',
            top: 60,
            left: 10,
            padding: '5px 15px 5px 15px',
            width: $embid.width(),
            'font-size': $embid.css('font-size')
          }).text(embtxt));

          var bestHT = $('#' + embid + 'Shadow').outerHeight() + 15;
          log(embid, 'bestie height', bestHT, 'for current width', $embid.width());
          $('#' + embid + 'Shadow').remove();

          $embid.height(bestHT);
        }
      }

      // dynamically adds modal to page (if isnt there already)

    }, {
      key: '_modal_add',
      value: function _modal_add(selector, conf) {
        // logically private
        log(conf);

        if ($(selector).length) return;

        var selectorID = selector.replace(/#/, '');

        $('body').prepend('\n<div id="' + selectorID + '" class="modal fade" role="dialog" aria-hidden="true">\n  <div class="modal-dialog modal-lg">\n    <div class="modal-content">\n      <div class="modal-header ' + (conf.headerClass ? conf.headerClass : 'modal-header-std') + '">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n          <span class="iconochive-remove-circle"></span>\n        </button>\n        <h2 class="modal-title">\n          ' + (typeof conf.title === 'undefined' ? 'Confirmed' : conf.title) + '\n        </h2>\n      </div>\n      <div id="' + selectorID + '-body">\n        ' + (typeof conf.body === 'undefined' ? '' : conf.body) + '\n      </div>\n    </div>\n  </div>\n</div>'

        // $('body').addClass('blurry') // exxxperiment!
        );
      }
    }, {
      key: 'modal_beta',
      value: function modal_beta(lnk, confIn) {
        // NOTE: not in use now
        var conf = confIn;
        conf.title = '<center>Give Us Feedback!</center>';

        // Set a cookie *NOW* w/ JS -- so we can absolutely assure that if user hits
        // the exit form *WITHOUT* cookies, that they must be disabling cookies on archive.org
        // (but interestingly have JS enabled (since they are here! ;-))
        // So exit form can give them "you need to enable cookies" fail...
        $.cookie('beta-modal', 'open', { path: '/', expires: 1, domain: '.archive.org' });

        var selector = $(lnk).attr('data-target');
        conf.href = location.href;
        conf.href = conf.href.replace(/&ui3=1$/, '');
        conf.href = conf.href.replace(/\/v2$/, '');

        conf.body = '\n  <style> #fback h4 { margin-top:30px; } </style>\n  <div id="fback" style="padding:20px">\n    <a target="_blank" href="/details/v2tour20150420">\n      <div style="text-align:center; float:right">\n        <img src="download/v2tour20150420/v2tour20150420.thumbs/April202015Tour_000375.jpg"/><br/>\n        TUTORIAL VIDEO\n      </div>\n    </a>\n    <div style="font-size:18px">\n      Please take a moment to give us feedback below.\n      We consider these comments as we make changes to the site.\n    </div>\n    <h5 style="display:none">\n      <br/><br/><br/>\n      THANK YOU for your valuable feedback!\n    </h5>\n    <form id="modal_beta_form" method="POST" action="services/exit.html">\n      <input type="hidden" name="feedback_only" value="1"/><br/>\n\n      <h4>Feedback (details are helpful):</h4>\n      <textarea class="form-control input-sm" name="feedback" rows="4"></textarea>\n\n      <h4>May we contact you about your feedback?</h4>\n      <input type="radio" name="contact" value="yes"/> yes, here\'s my email address:<br/>\n      <input class="form-control input-sm" type="text" name="eml"/> <br/>\n      <input type="radio" name="contact" value="no"/> no<br/>\n      <hr style="border-color:black;background-color:black;color:black" />\n      You can use the classic version of archive.org for a limited period of time.<br/>\n      <a target="_blank" href="https://blog.archive.org/2014/11/05/redesign/">\n        Learn more\n      </a>\n      about why archive.org changed.<br/>';

        if (conf.feedback_only) {
          conf.body += '\n          <input class="btn btn-primary" type="submit" style="margin-top:20px" value="Submit"/>';
        } else {
          conf.body += '\n          <input class="btn btn-primary" type="submit" style="margin-top:20px" value="Submit Feedback"/>\n          <input id="modal_beta_form_exit" class="btn" type="button" style="margin-top:20px" value="Exit to Classic Site"/>';
        }
        conf.body += '\n      <br/><br/>\n      <i>What\'s New?</i>\n      [\n        <a target="top" href="https://blog.archive.org/2015/02/12/whats-new-with-v2/">recent changes</a> |\n        <a target="top" href="CHANGELOG.txt">detailed CHANGELOG</a>\n      ]\n    </form>\n  </div>';

        AJS._modal_add(selector, conf

        // in case it's not obvious, there are FOUR CASES we (have to) handle:
        //   feedback only, hit [submit] button
        //   feedback only, cancel out (no feedback given)
        //   exit beta, hit [submit] button
        //   exit beta, no feedback given
        );$('#modal_beta_form_exit').on('click', function () {
          $('#modal_beta_form input[name=feedback_only]').val(0);
          conf.feedback_only = false;
          conf.exiting = true;
          $('#modal_beta_form').submit();
        });

        $('#modal_beta_form').on('submit', function () {
          log('submit clicked!');

          conf.submitted = true;
          conf.postdata = $('#modal_beta_form').serialize // oh, fkya!

          // we're polite
          ();$(selector.concat(' h5')).fadeIn('slow');
          $(selector.concat(' form')).fadeOut('slow');

          setTimeout(function () {
            // AJAX form post, keeping page where it is
            $.post('services/exit.html', conf.postdata, function () {
              log('POSTED ', conf.postdata);

              if ((!conf.feedback_only || conf.exiting) && document.cookie === '') {
                // user disables cookies, so go directly to exit form where we'll
                // give them more information about that and how we can't "stick"
                // their preference to exit beta...
                log('EXITING BUT HAS NO COOKIES!');
                location.href = 'services/exit.html';
                return;
              }

              $('body').removeClass('blurry');
              $(selector).modal('hide');
            });
          }, 2500);

          return false; // dont do *normal* submit of the form (and drive the page away)
        });

        $(selector).modal('show').on('hidden.bs.modal', function () {
          log('beta modal hidden');

          $('body').removeClass('blurry');
          if (conf.feedback_only || !conf.exiting) {
            $(selector).remove();
            return;
          }

          var exitFN = function exitFN() {
            if (!conf.submitted) {
              // user clicked out of modal or [x] close button -- no form submit
              // but they DO want to exit beta...
              location.href = 'services/exit.html';
            } else {
              $(selector).remove();
              log('going to ', conf.href);
              location.href = conf.href;
            }
          };

          if (typeof archive_analytics !== 'undefined') {
            archive_analytics.send_ping({
              service: 'ao_2',
              kind: 'event',
              ec: 'in_beta',
              ea: 'exit',
              cache_bust: Math.random()
            }, exitFN // once analytics GIF is loaded, invoke our callback!
            );
          } else {
            log('uho analytics not defined!'
            // should never happen, but just to be safe!!
            );exitFN();
          }
        });
        return false;
      }

      // gives us ability to have JS intercept an href click and instead do a bootstrap modal.
      // eg: when someone Favorites a list or item - a kind of confirmation box.
      //     In that case, we want it to just say Favorited with a big black star in the middle.
      //     We don't take user to the href target.
      //     The modal disappears if the user clicks anywhere and returns to page they were on.
      //     Timeout of a few seconds to close modal if they do nothing.
      // config is a hashmap with optional keys:
      //   auto_close, auto_remove, body, center, favorite, ignore_lnk, titlen,
      //   headerClass, shown, follow_link_on_dismiss

    }, {
      key: 'modal_go',
      value: function modal_go(lnk, confIn) {
        var conf = confIn; // sigh

        if (conf.favorite) {
          // this flicks on a bunch of config options
          conf.center = true;
          conf.auto_close = true;
          conf.title = 'Favorited';
          conf.body = '<center><span style="font-size:100px;" class="iconochive-favorite"></span></center>';
          conf.login = true; // must be logged in!
        }

        var selector = $(lnk).attr('data-target');
        var href = $(lnk).attr('href');

        AJS._modal_add(selector, conf);

        if (conf.shown) {
          $(selector).on('shown.bs.modal', function () {
            conf.shown();
          });
        }

        if (conf.follow_link_on_dismiss) {
          $(selector).on('hidden.bs.modal', function () {
            log('modal hidden, going to ', href, '..');
            $('body').removeClass('blurry');
            location.href = href;
          });
        }

        $(selector).modal('show');

        if (conf.login && $.cookie('logged-in-user') === null) {
          if (location.protocol !== 'index.html') {
            // make absolutely sure we never login with http!
            location.href = 'account/login.html';
            return false;
          }
          var url = 'account/login.html';
          $.get(url, function (htmIn) {
            $(selector.concat(' .modal-title')).text('Nearly there!  Please login first');

            $(selector).modal('show'
            // this allows us to effectively rip off the header/nav and footer
            // if we are accessing a full page (eg: account login page)
            );var htm = $(htmIn).find('.container-ia > div').length ? $(htmIn).find('.container-ia > div').get(0) : htmIn;

            $(selector.concat('-body')).html(htm);

            var $form = $(selector.concat('-body form:has(input[type=submit])'));

            if ($form.length) {
              $form.on('submit', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();

                var keyvals = {};
                $form.find('input').each(function (k, v) {
                  if ($(v).attr('name').length) keyvals[$(v).attr('name')] = $(v).val();
                }
                // log('POST', url)
                // log(keyvals)
                );$.post(url, keyvals, function () {
                  log('SUBMITTED');
                  if ($.cookie('logged-in-user') !== null) {
                    // SUCCESS!
                    // We are going to hide the login modal now, and need
                    // to proceed only *after* the modal animation is done
                    // and modal is gone.  So setup listener now, *then* hide.
                    // Once login modal is gone, remove the modal, and
                    // invoke the originally intended modal in fresh environment!
                    $(selector).on('hidden.bs.modal', function () {
                      $(selector).remove();
                      log('SUCCESS');
                      AJS.modal_go(lnk, conf // invoke original modal!
                      );
                    });
                    $('body').removeClass('blurry');
                    $(selector).modal('hide');
                  } else {
                    // eslint-disable-next-line  no-alert
                    alert('Please try logging in again');
                  }
                });

                return false;
              });
            }
          });
          return false;
        }

        if (conf.auto_remove) {
          conf.auto_close = true;
          $(selector).on('hidden.bs.modal', function () {
            $(selector).remove();
            $('body').removeClass('blurry');
          });
        }

        if (!conf.ignore_lnk) {
          var _url = lnk.href;
          // log('submit', url)
          $.get(_url, function () {
            if (conf.favorite && typeof archive_analytics !== 'undefined') {
              archive_analytics.send_ping({
                service: 'ao_2',
                kind: 'event',
                ec: 'page_action',
                ea: 'favorite',
                el: location.pathname,
                cache_bust: Math.random()
              });
            }

            $(selector).modal('show');
            if (conf.favorite) $('#favorite-button').addClass('favorited');
            if (conf.auto_close) setTimeout(function () {
              return $(selector).modal('hide');
            }, 2000);
          });
        } else {
          $(selector).modal('show');
        }

        if (conf.center) $(selector.concat(' .modal-dialog')).center // vertically center

        ();if (conf.auto_close && conf.ignore_lnk) setTimeout(function () {
          return $(selector).modal('hide');
        }, 2000);

        return false;
      }

      // handy little method to ensure only 1 checkbox is checked

    }, {
      key: 'check1',
      value: function check1(obj, selector) {
        if (!obj.checked) return;

        // toggle others to unchecked
        var $selector = selector ? $(selector) : $(obj).parents('form');

        // uncheck all; the re-check the checked one
        $selector.find('input[type=checkbox]').attr('checked', false

        // eslint-disable-next-line  no-param-reassign
        );obj.checked = true;
      }
    }, {
      key: 'addCommas',
      value: function addCommas(nStr) {
        // http://www.mredkj.com/javascript/numberFormat.html
        var x = ('' + nStr).split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.'.concat(x[1]) : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1,$2');
        }return x1 + x2;
      }
    }, {
      key: 'suffixFmt',
      value: function suffixFmt(val, axis) {
        if (axis.min >= 0.0 && axis.max <= 5)
          // give a little bit more granularity of 1 decimal point...
          return Math.round(val * 10, 1) / 10;

        if (val >= 1000000) return (val / 1000000).toFixed(0).concat(' M');
        if (val >= 1000) return (val / 1000).toFixed(0).concat(' K');
        return val.toFixed(0);
      }
    }, {
      key: 'suffixFmtPercent',
      value: function suffixFmtPercent(val, axis) {
        return AJS.suffixFmt(val, axis).concat('%');
      }
    }, {
      key: 'descript',
      value: function descript() {
        var d = $('#descript').get(0);
        if (d && d.offsetHeight < d.scrollHeight) {
          // we overflowed the short descript at the top of the collection page.
          // so show the little MORE button..
          $('#descript-more').show
          // $('#descript').css({'border-bottom':'1px solid #ccc'})
          ();
        }
      }

      // this allows easy setup for resize/orientation triggers for all graphs
      // on a page that use this!

    }, {
      key: 'plotter',
      value: function plotter(callback) {
        if (typeof AJS.plotters === 'undefined') AJS.plotters = [];

        if (callback) {
          // stash a copy of the callback for resize/orientationchange triggers
          AJS.plotters.push(callback

          // now do the actual plotting (eg: page load)
          );callback();
        } else {
          // step through each graph and rerun them
          log('plotter() resize/orient change', AJS.plotters.length, 'graphs to resize');
          for (var i = 0; i < AJS.plotters.length; i++) {
            AJS.plotters[i]();
          }
        }
      }

      // Graphing for archive.org/services/views.php and TV

    }, {
      key: 'plot',
      value: function plot(id, cfgIn, fmt_fn, pts, many) {
        var cfg = cfgIn;
        if (!cfg.xaxis) cfg.xaxis = { mode: 'time', color: cfg.dark ? '#ccc' : '#545454' };
        if (!cfg.yaxis) cfg.yaxis = { color: cfg.dark ? '#ccc' : '#545454' };

        var barWidth = void 0;
        if (many && cfg.barWidth) barWidth = cfg.barWidth;else if (cfg.barWidth) barWidth = cfg.barWidth * 86400 * 1000;else barWidth = (cfg.dayBarsNoPoints ? 1 : 7) * 86400 * 1000; // 1day|1week

        cfg.series = {
          bars: {
            show: true,
            barWidth: barWidth,
            fill: 0.6,
            color: '#385C74'
          },
          color: '#385C74',
          points: { show: !cfg.dayBarsNoPoints }
        };

        if (typeof cfg.grid === 'undefined') {
          cfg.grid = {
            borderColor: cfg.dark ? '#333' : '#aaa',
            hoverable: true
          };
        }
        // log(cfg.series.bars)


        if (cfg.dark) cfg.grid.backgroundColor = '#002b36';

        if (!cfg.tip) cfg.tip = {};
        if (!cfg.tip.id) cfg.tip.id = id;

        if (typeof window.GraphPriorIndex === 'undefined') window.GraphPriorIndex = {};

        // eslint-disable-next-line  no-nested-ternary
        var ary = many ? pts : typeof pts.data === 'undefined' ? [{ data: pts }] : [pts];
        if (cfg.dayBarsNoPoints && !cfg.noLabel) ary[0].label = id;

        var selid = '#' + id;
        $.plot($(selid), ary, cfg);

        if (!fmt_fn) return;

        $(selid).bind('plothover', function (event, pos, item) {
          if (!item) {
            window.GraphPriorIndex[id] = -666;
            $('#gtip').remove();
            return;
          }
          if (window.GraphPriorIndex[id] !== item.dataIndex) {
            window.GraphPriorIndex[id] = item.dataIndex;
            $('#gtip').remove();

            var str = fmt_fn(item.datapoint[0], item.datapoint[1]);
            var $graf = $(selid);
            var off = $graf.offset

            // figure out which way from the "dot"/bar in the graph the
            // tooltip should go -- left or right!
            ();var pegTo = cfg.tip.pegTo;
            if (!pegTo) pegTo = pos.pageX - off.left > $graf.width() / 2 ? 'right' : 'left';

            var pegToVal = pegTo === 'right' ? $graf.width() - (pos.pageX - off.left - 20) : pos.pageX - off.left + 20;
            log(pegTo, pegToVal);

            $('#' + cfg.tip.id).append('\n<div id="gtip" class="roundbox2"\n  style="position: absolute;\n         top: ' + (pos.pageY - off.top) + 'px;\n         ' + pegTo + ': ' + pegToVal + 'px;\n         padding: 2px 5px;\n         border: 1px solid gray;\n         background-color: #D8DEDE;\n         color: #385C74;\n         opacity: 0.9;">' + str + '</div>');
          }
        });
      }

      // Use a color sampling 3rd party piece of code, to find the 1st/primary image in the "welcome"
      // area, and find the "dominant color".  (internally, uses canvas to color sample).
      // Adjust text/foreground color as well as any "selected tab" background color.
      // NOT USED ANYMORE -- GONE SERVERSIDE!

    }, {
      key: 'welcome_recolor',
      value: function welcome_recolor(e) {
        if (typeof ColorThief === 'undefined' || !e.length) return;

        if (AJS.welcome_recolored) return;
        AJS.welcome_recolored = true;

        var img = $(e)[0];
        log('welcome_recolor', img.src

        /* global ColorThief */
        );var ct = new ColorThief();
        var palette = ct.getPalette(img, 5);
        log(palette);
        if (!palette) return;
        var dominantColorRGB = palette[0]; // 3 element array!

        if (!dominantColorRGB) return;
        log(dominantColorRGB

        // if dominant color is uh, kinda in the lighter range -- txt should be black
        );var avgVal = Math.round($(dominantColorRGB).map(function (k, v) {
          return v;
        }).toArray().reduce(function (a, b) {
          return a + b;
        }) / dominantColorRGB.length);
        var color = avgVal >= 128 ? 'black' : 'white';
        log('avgVal', avgVal);

        $('.welcome').css({
          color: color,
          'background-color': 'rgb(' + dominantColorRGB.join(',') + ')'
        });
        $('.welcome .stealth:not(.tabby .stealth)').css({ color: color });
      }

      /**
       * Use the following function to make an image, div, etc focusable, and 'click'-able.
       * Function adds a tabindex for 'focus' and listens for a keydown/keypress of enter or space,
       * then triggers a click.
       *
       * var element: String used for jquery capture of non-acessible & mouse-only element.
       *    ex: "#AmazonPayButton img"
       * Triggers 'click' on element.
       */

    }, {
      key: 'makeMouseElementAccessible',
      value: function makeMouseElementAccessible(element) {
        $(element).attr('tabindex', '0').on('keypress keydown', function makeMouseElementAccessibleGo(e) {
          if (e.type !== 'click') {
            var code = e.keyCode || e.which;
            var k_space = 32; // space bar pressed
            var k_enter = 13; // enter key pressed
            if ([k_space, k_enter].indexOf(code) !== -1) $(this).click();
          }
        });
      }

      // use something like ',' for the optional 3rd arg if you want to allow
      // for appending 2+ values into a field, etc...

    }, {
      key: 'autocomplete',
      value: function autocomplete(selector, options, multiValSplitChar) {
        $(selector).autocomplete({
          appendTo: '#autocompletee',
          minLength: 0,
          source: function source(request, response) {
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(options, request.term.split(/,\s*/).pop()));
          },
          focus: function focus() {
            return false;
          }, // prevent value inserted on focus
          select: function autocomplete_select(event, ui) {
            if (multiValSplitChar) {
              var terms = this.value.split(/,\s*/
              // remove the current input
              );terms.pop
              // add the selected item
              ();terms.push(ui.item.value
              // add placeholder to get the comma-and-space at the end
              );terms.push('');
              this.value = terms.join(', ');
            } else {
              this.value = ui.item.value;
            }
            return false;
          }
        });
      }
    }, {
      key: 'addNotes',
      value: function addNotes(kind, htm) {
        // flag lists have multiple users so the "rights" there
        // is a bit to thorny right now so for simplicity and
        // the main feature to go live, skipping them...
        if (kind !== 'favorite' && kind !== 'list') return htm;

        if (!htm && $('body').hasClass('editable')) AJS.addingNotesKind = kind;
        if (!AJS.addingNotesKind) return htm;

        AJS.addNoteHTM = $('\n  <div class="note">\n    <span class="edit">\n      <a href="#" onclick="return AJS.editNote(this)">Add a Note</a>\n    </span>\n  </div>');

        log('addNotes'

        // Next, we are going to do a global DOM search and insert (where needed)
        // for basically the first page load.  But we're also called in "infinite scroll"
        // page 2+ mode, and in that case, we want to modify (JUST) the HTM when that's
        // for page 2+ and about to be inserted into the DOM, *instead* of another global
        // DOM search.
        );if (htm) {
          // (Basically we are now doing page 2+ in infinite scroll)
          // OK this is sorta wild/maybe not obvi...a
          // (Kinda like a jQuery replace_regexp()...)
          // Take the *string* of HTM we are passed, convert it to a "findable" jQuery object
          // then insertd "addNoteHTM" where needed.
          // Finally, convert back to string and return this modified version to caller.
          var $htm = $('<div>' + htm + '</div>');
          $htm.find('.details-ia .C234:not(:has(".note"))').append(AJS.addNoteHTM);
          return $htm.html();
        }

        // this is initial page load
        // NOTE: return value irrelevant here
        return $('.details-ia .C234:not(:has(".note"))').append(AJS.addNoteHTM);
      }
    }, {
      key: 'editNote',
      value: function editNote(e) {
        var $e = $(e);
        var identifier = $e.parents('.details-ia').prev().attr('data-id');
        if (!identifier) return false;

        var $note = $e.parents('.note');

        var val = '';
        if ($e.text() === 'edit') {
          val = $note.find('span:first').text();
          val = val.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        $note.hide();
        $note.parent().append($('\n  <form class="form form-horizontal note" role="form" onsubmit="AJS.editedNote(this);return false">\n    <div class="form-group">\n      <div class="col-xs-2 col-md-1 col-lg-1">\n        <b>Note:</b>\n      </div>\n      <div class="col-xs-10 col-md-6 col-lg-7">\n        <textarea class="form-control" name="comments">' + val + '</textarea>\n        <div class="clearfix visible-xs-block"></div>\n      </div>\n      <div class="clearfix visible-xs-block"></div>\n      <div class="col-xs-12 col-md-5 col-lg-4 btns">\n        <button type="button" onclick="AJS.editedNote(this)" class="btn btn-success btn-xs">Save</button>\n        <button type="button" onclick="AJS.editedNote(this)" class="btn btn-info btn-cancel btn-xs">Cancel</button>\n        <button type="button" onclick="AJS.editedNote(this)" class="btn btn-danger btn-xs ' + (val ? '' : 'hidden') + '">Remove</button>\n      </div>\n    </div>\n  </form>'));

        return false;
      }
    }, {
      key: 'editedNote',
      value: function editedNote(e) {
        var $e = $(e);

        var identifier = $e.parents('.details-ia').prev().attr('data-id');
        if (!identifier) return;

        // if user hit [return] and submitted form, etc.
        // treat it like they hit the [Save] button
        if ($e.is('form')) $e = $e.find('button:contains("Save")');

        var action = $e.text();
        var $parent = $e.parents('.note');
        var $origNote = $parent.prev();

        if (action === 'Save' || action === 'Remove') {
          var val = action === 'Save' ? $parent.find('textarea').val() : '';
          var url = '/bookmarks.php?identifier='.concat(identifier, '&kind=', AJS.addingNotesKind, '&add_comment=', encodeURIComponent(val));
          log('get ', url);
          $.get(url, function () {
            var htm = val ? 'Note: "<span>' + val.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>"\n                        <span class="edit">(<a href="#" onclick="return AJS.editNote(this)">edit</a>)</span>' : AJS.addNoteHTM.html();
            // show the "Note: ..." section again (with now appropriately updated innards)
            $origNote.html(htm).show();
            $parent.remove // lose the form
            ();
          });
          return;
        }
        // else Cancel does nothing but below...

        $origNote.show // show the "Note: ..." section again
        ();$parent.remove // lose the form
        ();
      }
    }, {
      key: 'thumbzilla',
      value: function thumbzilla(id) {
        /* global  TV2  TV3 */
        // cover entire screen with new div...
        var TV = $('body').hasClass('tv');
        if (TV) TV2.unplay('thumbzilla'

        // get list of thumbs
        );var htm = '';
        $(AJS.thumbzillas).each(function (key, val) {
          var start = parseInt(val, 10);
          if (TV) {
            var startend = '/start/' + start + '/end/' + (start + TV3.CLIP_SEC_MAX2);
            htm += '<a onclick="$(\'#opscreen1M\').fadeOut(\'slow\'); TV2.seekURL(\'' + startend + '\')" href="' + startend + '">';
          } else {
            var locNEW = '/details/' + id + '&start=' + start;
            htm += '<a onclick="$(\'#opscreen1M\').fadeOut(\'slow\'); return Play.seek(this)" href="' + locNEW + '">';
          }
          htm += '<img src="/download/' + id + '/' + id + '.thumbs/' + id + '_' + val + '.jpg"/></a>';
        });

        if (htm === '') {
          // eslint-disable-next-line  no-alert
          alert('coming soon!');
          return false;
        }

        $('#opscreen1M').remove();
        $('body').prepend($('<div />').attr({ id: 'opscreen1M' }));

        var $imgs = $('<div/>').attr({ id: 'thumbzilla' }).html('<div>' + htm + '</div>');
        $imgs.appendTo('#opscreen1M');
        $('#opscreen1M').css('visibility', 'hidden').show();
        var winH = $(window).height() + (AJS.ios ? 60 : 0); // plus iOS bleah
        for (var w = 160; w >= 10; w -= 10) {
          var h = Math.round(w * (110 / 160.0));
          log('TRYING', w, 'x', h);
          $('#thumbzilla img').css({ width: w, height: h });
          if ($('#thumbzilla img:last').offset().top + h <= winH) break;
        }

        $('#thumbzilla div').center();
        $('#opscreen1M').hide().css('visibility', 'visible').fadeIn('slow').one('click.opscreen1M.nixer', function () {
          return $('#opscreen1M').fadeOut('slow');
        });
        return false;
      }

      /* Wayback Machine form type-ahead setup: it presents a list of sites
         matching the text as user types. */

    }, {
      key: 'nav_tophat_wb_setup',
      value: function nav_tophat_wb_setup() {
        // Configuration
        var WAYBACK = 'https://web.archive.org/';
        var HOSTS_ENDPOINT = WAYBACK + '/__wb/search/host?q=';
        var ANCHORS_ENDPOINT = WAYBACK + '/__wb/search/anchor?q=';
        var REDIRECT_URL = WAYBACK + '/web/*/';
        var REDIRECT_SEARCH = WAYBACK + '/web/*/';

        function search_or_calendar(query) {
          if (query.indexOf('http://') === 0 || query.indexOf('https:///') === 0 || query.match(/[\w.]{2,256}\.[a-z]{2,4}/gi)) document.location.href = REDIRECT_URL + query;else document.location.href = REDIRECT_SEARCH + encodeURIComponent(query);
        }

        var $input = $('#nav-wb-url');
        var $form = $input.parent('form');
        $form.submit(function (e) {
          var query = $input.val();
          search_or_calendar(query);
          e.preventDefault();
          return false;
        });
        $input.on('focus input paste', function () {
          if (typeof $input.typeahead === 'undefined') {
            $.ajax({
              url: '/includes/node_modules/bootstrap-3-typeahead/bootstrap3-typeahead.min.js',
              dataType: 'script',
              cache: true
            }).done(function () {
              $input.typeahead({
                source: function source(query, process) {
                  $input.focus // bugfix https://github.com/bassjobsen/Bootstrap-3-Typeahead/issues/150#issuecomment-197949899
                  ();return $.get(HOSTS_ENDPOINT + encodeURIComponent(query), function (data) {
                    if (typeof data.hosts !== 'undefined' && data.hosts.length > 0) {
                      return process(data.hosts);
                    } else if (typeof data.isUrl !== 'undefined' && data.isUrl === true && typeof data.excluded === 'undefined') {
                      return process([{
                        display_name: query
                      }]);
                    }

                    return $.get(ANCHORS_ENDPOINT + encodeURIComponent(query), function (data2) {
                      if (typeof data2 !== 'undefined' && data2.length > 0) return process(data2.slice(0, 5));
                      return undefined;
                    });
                  });
                },
                matcher: function matcher() {
                  return true;
                },
                displayText: function displayText(item) {
                  return item.display_name;
                },
                autoSelect: false,
                delay: 400,
                fitToElement: false, /* not good with long URLs */
                minLenght: 3,
                items: 8
              }).change(function () {
                var current = $input.typeahead('getActive');
                if (current && current.display_name === $input.val()) $form.submit();
              }).on('keyup', function (e) {
                if (e.which === 10 || e.which === 13) {
                  var query = $input.val();
                  search_or_calendar(query);
                  e.preventDefault();
                  return false;
                }
                return undefined;
              });
            });
          }
        });
      }

      /* eslint-disable */

      /**
       * React Component, a link that opens its href in a popup instead of the same window.
       * Height and width of the popup can be customized via props.
       */

    }, {
      key: 'PopupLink',
      value: function PopupLink() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            children = _ref.children,
            href = _ref.href,
            height = _ref.height,
            width = _ref.width,
            title = _ref.title;

        function openPopup(event) {
          event.preventDefault();

          var params = {
            height: height,
            width: width,
            scrollbars: 'yes',
            resizable: 'yes',
            toolbar: 'no',
            directories: 'no',
            location: 'yes',
            menubar: 'no',
            status: 'yes'
          };

          // Options must be expressed as comma-separated key-value pairs.
          var options = Object.keys(params).filter(function (key) {
            return params[key];
          }).reduce(function (paramPairs, key) {
            return paramPairs.concat(key + '=' + params[key]);
          }, []).join(',');

          window.open(href, 'popup', options);
        }

        // Include href for semantics.
        return React.createElement(
          'a',
          { href: href, title: title, onClick: openPopup },
          children
        );
      }

      /**
       * Render the CreativeCommonsLicenseLink React component to a DOM node with the
       * appropriate ID.
       */

    }, {
      key: 'setUpCreativeCommonsLicenseLink',
      value: function setUpCreativeCommonsLicenseLink() {
        var root = document.querySelector('#creative_commons_license_link_react');

        if (!root) {
          return;
        }

        ReactDOM.render(React.createElement(AJS.CreativeCommonsLicenseLink, {
          href: root.dataset.href,
          licenseName: root.dataset.licenseName,
          licenseSelected: root.dataset.licenseSelected === 'true'
        }), root);
      }
      /* eslint-enable */

      /**
       * Sets up listeners on search forms to handle opening/closing the search options.
       *
       * @see SearchOptions.inc
       */

    }, {
      key: 'setUpSearchForms',
      value: function setUpSearchForms() {
        var body = $(document.body);
        var searchForms = $('.js-search-form'

        /**
         * Sets up an individual form, isolating its event listeners from the other ones.
         *
         * @param {HTMLFormElement} formNode
         */
        );function setUpSearchForm(formNode) {
          var form = $(formNode);
          var searchBar = form.find('.js-search-bar');
          var searchOptions = form.find('.js-search-options');
          var fieldsContainer = searchOptions.find('.js-search-options__fields');
          var keepOpenWhenChanged = searchOptions.data('keepOpenWhenChanged');
          var formChanged = false;

          /**
           * Catches web searches and redirects them to Wayback Machine. The search form must have a
           * "data-wayback-machine-search-url" attribute set in order for this method to work (and the
           * method assumes the query can be tacked onto the end of this URL). For all other kinds of
           * searches, does nothing.
           *
           * @param {Event} event
           */
          function redirectWaybackSearches(event) {
            var waybackMachineSearchUrl = this.dataset.waybackMachineSearchUrl;
            var elements = $(this.elements);
            var checkedInput = elements.filter('[name="sin"]:checked');
            var searchInput = elements.filter('[name="search"]');
            var sinValue = checkedInput.length ? checkedInput[0].value : '';
            var searchValue = searchInput.length ? searchInput[0].value : '';

            if (waybackMachineSearchUrl && sinValue === 'WEB') {
              event.preventDefault();

              window.location = [
              // Remove trailing slash just in case.
              waybackMachineSearchUrl.replace(/\/$/, ''), searchValue].join('index.html');
            }
          }

          function openOptions() {
            searchOptions.addClass('is-open');
            fieldsContainer.attr('aria-hidden', false).attr('aria-expanded', true);
          }

          function closeOptions() {
            searchOptions.removeClass('is-open');
            fieldsContainer.attr('aria-hidden', true).attr('aria-expanded', false);
          }

          /**
           * Closes options if the newly focused element is outside of the form and the form
           * is configured to close when it is no longer active.
           *
           * @param {HTMLElement} targetElement element being clicked or receiving focus
           */
          function handleFocusChange(targetElement) {
            if (!targetElement || form[0].contains(targetElement) || keepOpenWhenChanged && formChanged) return;

            closeOptions();
          }

          if (form.length) {
            form.on('submit', redirectWaybackSearches);

            if (!searchOptions.hasClass('is-open')) {
              body.on('click', function (event) {
                handleFocusChange(event.target);
              });

              form.on('change', function () {
                formChanged = true;
              }).on('focusout', function (event) {
                handleFocusChange(event.relatedTarget);
              });

              searchBar.on('focusin', function () {
                openOptions();
              });
            }
          }
        }

        searchForms.each(function (index, node) {
          return setUpSearchForm(node);
        });
      }

      /**
       * Attaches handlers for link click tracking.
       * To enable click tracking for a link, add a data attribute containing the
       * Google Analytics Event Category and Action, separated by a vertical pipe (|).
       * e.g. `<a href="foobar" data-event-track-category-action="TopNav|FooBar">`
       */

    }, {
      key: 'setUpLinkTracking',
      value: function setUpLinkTracking() {
        var trackingAttributeName = 'event-track-category-action';
        $(document.body).on('click', '[data-' + trackingAttributeName + ']', function (event) {
          if (typeof archive_analytics !== 'undefined') {
            var categoryAction = $(event.target).data(trackingAttributeName).split('|');
            archive_analytics.send_ping({
              service: 'ao_2',
              kind: 'event',
              ec: categoryAction[0],
              ea: categoryAction[1],
              el: location.pathname,
              cache_bust: Math.random()
            });
          }
        });
      }
    }]);

    return AJS;
  }(); // end class AJS

  /* eslint-disable */

  /**
   * React component, Creative Commons license selector link.
   * Shows a "remove" link when a license is selected.
   */


  AJS.TILE_WIDTH = 180;
  AJS.TILE_WIDTH_SMALL = 150;
  AJS.ios = navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPod') > 0;
  AJS.page_map = {};
  AJS.CreativeCommonsLicenseLink = React.createClass({
    displayName: 'CreativeCommonsLicenseLink',

    DEFAULT_LINK_TEXT: 'Choose license',

    defaultProps: {
      licenseName: undefined,
      licenseSelected: false
    },

    getInitialState: function getInitialState() {
      return {
        licenseSelected: this.props.licenseSelected,
        linkText: this.props.licenseName || this.DEFAULT_LINK_TEXT,
        oldLicenseName: this.props.licenseName
      };
    },
    componentWillReceiveProps: function componentWillReceiveProps(newProps) {
      this.setState({
        licenseSelected: newProps.licenseSelected,
        linkText: newProps.licenseName || this.DEFAULT_LINK_TEXT
      });
    },
    removeLicense: function removeLicense() {
      this.setState({
        licenseSelected: false,
        linkText: this.DEFAULT_LINK_TEXT
      });

      this.removeRetainLicenseInput();
    },


    /**
     * This is left over from the old, non-React version of this widget, so
     * we need to reach outside of the React component and change another DOM node.
     */
    removeRetainLicenseInput: function removeRetainLicenseInput() {
      var formItem = document.getElementById('retaincclicense');
      formItem.parentNode.removeChild(formItem);
    },
    wasLicensedChanged: function wasLicensedChanged() {
      return this.state.oldLicenseName !== this.state.linkText;
    },
    getLicenseChangeMessage: function getLicenseChangeMessage() {
      if (this.state.oldLicenseName && this.wasLicensedChanged()) {
        return 'Change license (currently ' + this.state.oldLicenseName + ')';
      }

      return '';
    },
    render: function render() {
      return React.createElement(
        'span',
        null,
        React.createElement(
          AJS.PopupLink,
          {
            href: this.props.href,
            height: '600',
            width: '600',
            title: this.getLicenseChangeMessage()
          },
          this.state.linkText
        ),
        ' ',
        this.state.licenseSelected && React.createElement(
          'span',
          null,
          '(',
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'creativecommons-remove-license-button',
              onClick: this.removeLicense
            },
            'remove'
          ),
          ')'
        )
      );
    }
  }
  /* eslint-enable */

  );AJS.MORFreact = React.createClass({
    displayName: 'MORFreact',

    FACETS_PER_PAGE: 100,

    getInitialState: function getInitialState() {
      return {
        page: 1,
        href: '',
        mounted: false,
        hdr: '',
        options: []
      };
    },
    getFacets: function getFacets() {
      var self = this;
      // xxxx Math.rand anti-browser caching etc??
      $.getJSON(this.props.href + '&headless=1&output=json', function (ret) {
        // eslint-disable-next-line  no-param-reassign
        ret.href = self.props.href;
        // eslint-disable-next-line  no-param-reassign
        ret.mounted = true;
        log(ret);

        self.setState(ret

        // now check all the boxes that user has previously/currently checked
        );for (var j = 0; j < ret.checked.length; j++) {
          for (var i = 0; i < self.state.options.length; i++) {
            var val = self.state.options[i].val;
            // NOTE: == not === so "1970"==1970 (eg: year facet)
            // eslint-disable-next-line  eqeqeq
            if (ret.checked[j] == val) {
              self.refs[val].checked = true;
              break;
            }
          }
        }
      });
    },
    componentDidMount: function componentDidMount() {
      // Our component is visible in page now, effectively empty
      // Now ask server for facets to render in
      log('mounted');
      this.getFacets();
    },
    pageClick: function pageClick(e) {
      e.stopPropagation();
      e.preventDefault

      // if user clicked on the |> "next page" icon, advance one page;
      // else they clicked on a specific page number to go to
      ();var page = $(e.target).text() === '' ? this.state.page + 1 : parseInt($(e.target).text(), 10);
      this.setState({ page: page });
    },
    submitClick: function submitClick() {
      log('submitted');
      var url = this.state.submit;
      for (var i = 0; i < this.state.options.length; i++) {
        var val = this.state.options[i].val;
        if (this.refs[val].checked) {
          var tmp = '&and[]=' + this.state.morf + '%3A"' + encodeURIComponent(val) + '"';
          log('checked', val, '=>', tmp);
          url += tmp;
        }
      }
      log(url);
      location.href = url;
    },
    render: function render() {
      var _this = this;

      log('rendering..'
      // log(this.props.href)
      // log(this.state.href)

      );var loading = !this.state.mounted;
      if (this.state.href !== '' && this.props.href !== this.state.href) {
        loading = true;
        this.getFacets();
      }

      $('#morf-modal .modal-title').html(loading ? '' : this.state.hdr);

      var min = (this.state.page - 1) * this.FACETS_PER_PAGE;
      var max = min + this.FACETS_PER_PAGE - 1;
      var options = this.state.options.map(function (option, n) {
        return React.createElement(
          'div',
          { className: n >= min && n <= max && !loading ? 'farow' : 'farow hidden', key: option.val },
          React.createElement(
            'div',
            { className: 'facell' },
            React.createElement('input', {
              onClick: _this.handleClick,
              type: 'checkbox',
              name: option.val,
              value: option.val,
              ref: option.val
            })
          ),
          React.createElement(
            'div',
            { className: 'facell' },
            AJS.addCommas(option.n)
          ),
          React.createElement(
            'div',
            { className: 'facell' },
            option.txt ? option.txt : option.val
          )
        );
      });

      var paging = [];
      var npages = Math.ceil(this.state.options.length / this.FACETS_PER_PAGE);
      var loadnote = '';
      if (loading) {
        loadnote = React.createElement(
          'div',
          { style: { 'font-style': 'italic', margin: '25px', 'text-align': 'center' } },
          'loading filters...',
          React.createElement('img', { alt: '', style: { width: '25px' }, key: loading, src: '/images/loading.gif' })
        );
      } else {
        var page = 1;
        for (page = 1; page <= npages; page++) {
          if (this.state.page === page) paging.push(React.createElement(
            'div',
            { key: 'p'.concat(page), className: 'topinblock' },
            page
          ));else paging.push(React.createElement(
            'a',
            { href: '#'.concat(page), key: 'p'.concat(page), onClick: this.pageClick },
            page
          ));
          paging.push(' ');
        }
        if (this.state.page < npages) {
          paging.push(React.createElement(
            'a',
            { href: '#'.concat(page), key: 'pp'.concat(page), onClick: this.pageClick },
            React.createElement('span', { className: 'iconochive-right-solid' })
          ));
        }
      }
      return React.createElement(
        'div',
        { id: 'morf-page' },
        React.createElement(
          'form',
          null,
          React.createElement(
            'div',
            { className: 'fatable facet-subject' },
            options
          ),
          loadnote,
          React.createElement(
            'div',
            { id: 'morf-paging' },
            paging
          ),
          React.createElement(
            'center',
            null,
            React.createElement('input', { className: loading ? 'btn-primary hidden' : 'btn-primary', type: 'button', value: 'Apply your filters', onClick: this.submitClick })
          )
        )
      );
    }
  } // end MORFreact


  /** ******************************************************************************************
   *
   *
   *    THIRD PARTY INCLUDES WE CANT LIVE WITHOUT! 8-)
   *
   *
   ******************************************************************************************** */

  /* eslint-disable */
  /**
   * Cookie plugin
   *
   * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
   * Dual licensed under the MIT and GPL licenses:
   * http://www.opensource.org/licenses/mit-license.php
   * http://www.gnu.org/licenses/gpl.html
   *
   */

  /**
   * Create a cookie with the given name and value and other optional parameters.
   *
   * @example $.cookie('the_cookie', 'the_value');
   * @desc Set the value of a cookie.
   * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
   * @desc Create a cookie with all available options.
   * @example $.cookie('the_cookie', 'the_value');
   * @desc Create a session cookie.
   * @example $.cookie('the_cookie', null);
   * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
   *       used when the cookie was set.
   *
   * @param String name The name of the cookie.
   * @param String value The value of the cookie.
   * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
   * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
   *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
   *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
   *                             when the the browser exits.
   * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
   * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
   * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
   *                        require a secure protocol (like HTTPS).
   * @type undefined
   *
   * @name $.cookie
   * @cat Plugins/Cookie
   * @author Klaus Hartl/klaus.hartl@stilbuero.de
   */

  /**
   * Get the value of a cookie with the given name.
   *
   * @example $.cookie('the_cookie');
   * @desc Get the value of a cookie.
   *
   * @param String name The name of the cookie.
   * @return The value of the cookie.
   * @type String
   *
   * @name $.cookie
   * @cat Plugins/Cookie
   * @author Klaus Hartl/klaus.hartl@stilbuero.de
   */
  );$.cookie = function (name, value, options) {
    if (typeof value != 'undefined') {
      // name and value given, set cookie
      options = options || {};
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
          date = new Date();
          date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
      }

      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      var path = options.path ? '; path=' + options.path : '';
      var domain = options.domain ? '; domain=' + options.domain : '';
      var secure = options.secure ? '; secure' : '';

      if (navigator.userAgent.indexOf('MSIE 9.') > 0) {
        // IE9 sucks and can kiss it (tracey may2012)
        domain = '';
        path = '';
      }

      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
      return true;
    } else {
      // only name given, get cookie
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = $.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == name + '=') {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  };
  /* eslint-enable */

  // (adapted) from http://www.queness.com/code-snippet/6853/center-an-element-on-the-screen-using-jquery
  // then you can use it like:
  //      $("#gridmini").center()

  // eslint-disable-next-line  no-param-reassign
  $.fn.center = function jquery_extension_center() {
    var myheight = this.height() + parseInt(this.css('padding-top'), 10) + parseInt(this.css('padding-bottom'), 10);

    log('myheight', myheight);
    log('mywidth', this.width());
    log('w.height', $(window).height(), 'w.width', $(window).width(), 'w.scrollTop', $(window).scrollTop(), 'w.scrollLeft', $(window).scrollLeft());

    var top = void 0;
    var left = void 0;
    if (AJS.ios) {
      var vpW = window.innerWidth;
      var vpH = window.innerHeight;

      log('vpH', vpH);
      log('vpW', vpW);

      top = (vpH - myheight) / 2 + $(window).scrollTop();
      left = (vpW - this.width()) / 2 + $(window).scrollLeft();
    } else {
      top = ($(window).height() - myheight) / 2;
      left = ($(window).width() - this.width()) / 2;
    }

    // for small viewports like iphone, when centering popups, ensure minimally +20px
    top = Math.max(20, top);
    left = Math.max(20, left);

    this.css({
      position: AJS.ios ? 'absolute' : 'fixed',
      display: 'block',
      top: top,
      left: left });

    return this;
  }; // end $.fn.center


  $(function () {
    // Use this global hack, by adding class 'accessible-link' to any mouse-only element div/img
    AJS.makeMouseElementAccessible('.accessible-link');

    AJS.nav_tophat_setup();
    AJS.nav_tophat_wb_setup();
    AJS.setUpCreativeCommonsLicenseLink();
    AJS.setUpSearchForms();
    AJS.setUpLinkTracking

    /* global  archive_setup */
    ();if (typeof archive_setup !== 'undefined') {
      // when DOM loaded/stable, do some setup
      $(function () {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = archive_setup[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fn = _step.value;

            fn();
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
      });
    }

    AJS.footer();
  });

  window.AJS = AJS; // promote to global
})(jQuery);

