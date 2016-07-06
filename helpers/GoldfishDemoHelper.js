/*
  Demo helper for launching goldfish on a non-sharepoint site (for demo purposes).
*/
var heightOfDemo = document.body.getBoundingClientRect().bottom;

//var styles = '#outer-space { padding-left:15px; width:410px; -webkit-perspective: none; } div.goldfishSnapTop #component-results, div.goldfishSnapBottom #component-results { position: relative; } div.goldfishSnapTop #component-favourites div.sortable-item, div.goldfishSnapBottom #component-favourites div.sortable-item { float: left; width: 400px; margin-left: 10px; } div.goldfishSnapTop #component-favourites div.sortable-item:first-child,  div.goldfishSnapBottom #component-favourites div.sortable-item:first-child { border-width: 0px; } div.goldfishSnapTop #component-results div.person-card-holder, div.goldfishSnapBottom #component-results div.person-card-holder { width:100% !important; } div.goldfishSnapTop #component-results div.person-card, div.goldfishSnapBottom #component-results div.person-card { margin: 0 0 10px 10px; width: 400px; float:left; } #component-paging { float: none; clear: both; } div.goldfishSnapTop { -webkit-box-shadow: 15px 13px 29px -15px rgba(0,0,0,0.75); -moz-box-shadow: 15px 13px 29px -15px rgba(0,0,0,0.75);  box-shadow: 15px 13px 29px -15px rgba(0,0,0,0.75); } div.goldfishSnapBottom { -webkit-box-shadow: 3px -11px 21px -10px rgba(0,0,0,0.75); -moz-box-shadow: 3px -11px 21px -10px rgba(0,0,0,0.75); box-shadow: 3px -11px 21px -10px rgba(0,0,0,0.75); } div.goldfishSnapLeft { -webkit-box-shadow: 20px 20px 30px -18px rgba(0,0,0,0.75); -moz-box-shadow: 20px 20px 30px -18px rgba(0,0,0,0.75); box-shadow: 20px 20px 30px -18px rgba(0,0,0,0.75); } div.goldfishSnapRight { -webkit-box-shadow: 0px 10px 24px -20px rgba(0,0,0,0.75); -moz-box-shadow: 0px 10px 24px -20px rgba(0,0,0,0.75); box-shadow: 0px 10px 24px -20px rgba(0,0,0,0.75); } #component-ghostpane { background-color: #188efb; } #component-holder { width:100%; } #outer-space { top:0; height:' + heightOfDemo + 'px; } #component, #component-favourites, #component-layout, #component-settings { width: inherit !important; } #component-tabs { right:inherit; } #component .input input[type="text"] { background-color: #ffffff; }';
var styles = '#outer-space { padding-left:15px; width:410px; -webkit-perspective: none; } div.goldfishSnapTop #component-results, div.goldfishSnapBottom #component-results { position: relative; } div.goldfishSnapTop #component-favourites div.sortable-item, div.goldfishSnapBottom #component-favourites div.sortable-item { float: left; width: 400px; } div.goldfishSnapTop #component-favourites div.sortable-item:first-child,  div.goldfishSnapBottom #component-favourites div.sortable-item:first-child { border-width: 0px; } div.goldfishSnapTop #component-results div.person-card-holder, div.goldfishSnapBottom #component-results div.person-card-holder { width:100% !important; } div.goldfishSnapTop #component-results div.person-card, div.goldfishSnapBottom #component-results div.person-card { margin: 0 0 10px 10px; width: 400px; float:left; } #component-paging { float: none; clear: both; } div.goldfishSnapTop { -webkit-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); -moz-box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75);  box-shadow: -4px 13px 29px -15px rgba(0,0,0,0.75); } div.goldfishSnapBottom { -webkit-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); box-shadow: -4px -5px 29px -8px rgba(0,0,0,0.75); } div.goldfishSnapLeft { -webkit-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: 10px 2px 29px -8px rgba(0,0,0,0.75); } div.goldfishSnapRight { -webkit-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); -moz-box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); box-shadow: -8px 2px 29px -8px rgba(0,0,0,0.75); } #component-ghostpane { background-color: #188efb; } #component-holder { width:100%; } #outer-space { top:0; height:' + heightOfDemo + 'px; } #component, #component-favourites, #component-layout, #component-settings { width: inherit !important; } #component-tabs { right:inherit; } #component .input input[type="text"] { background-color: #ffffff; }';

Goldfish.Create({
  menu: 'alternate-tabs',
  css: {
    primary: '#188efb',
    overrides: styles
  }
});

var clickers = ['dragSnapinGoldfish','dragSnapinGoldfishLayout','dragSnapinGoldfishSettings','dragSnapinGoldfishFavourites'];

/*
 * Resize Snapin - based on the work done by @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */
"use strict";

(function(namespace) {
  // Minimum resizable area (width and height)
  var minWidth = 450;
  var minHeight = 450;

  // Thresholds - leave these alone
  var FULLSCREEN_MARGINS = -10;
  var MARGINS = 4;

  // End of what's configurable.
  var clicked = null;
  // Resizing booleans indicating if we are resizing from one of these points
  var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;
  var currentClicker = null;

  var rightScreenEdge, bottomScreenEdge;

  var preSnapped;

  var b, x, y;

  var redraw = false;

  // The app holding div element (that we move to the snappin) - pane
  // The ghost panel demonstrating the drop point for the move - ghostpane
  var pane, ghostpane;

  var clickers;

  function setBounds(element, x, y, w, h) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = w + 'px';
    element.style.height = h + 'px';
  }

  function getCurrentClicker(e) {
    return e.target || e.srcElement;
  }

  function hintHide() {
    ghostpane.style.opacity = 0;
  }

  function onTouchDown(e) {
    onDown(e.touches[0]);
    e.preventDefault();
  }

  function onTouchMove(e) {
    onMove(e.touches[0]);
  }

  function onTouchEnd(e) {
    if (e.touches.length === 0) { onUp(e.changedTouches[0]); }
  }

  function onMouseDown(e) {
    onDown(e);
    e.preventDefault();
  }

  function setCurrentClickerHighlight(el, highlight) {
  	el.style.color = highlight ? Goldfish.GetPrimaryColour() : '';

  	el.className = highlight ? el.className + ' animated pulse' : el.className.replace(/ animated pulse/g, '');

  	document.getElementById('outer-space').style.border = highlight ? '2px dashed #cccccc' : '';
  }

  function onDown(e) {
    ghostpane.style.display = '';

    calc(e);

    var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

    clicked = {
      x: x,
      y: y,
      cx: e.clientX,
      cy: e.clientY,
      w: b.width,
      h: b.height,
      currentClicker: getCurrentClicker(e),
      isResizing: isResizing,
      isMoving: !isResizing && canMove(),
      onTopEdge: onTopEdge,
      onLeftEdge: onLeftEdge,
      onRightEdge: onRightEdge,
      onBottomEdge: onBottomEdge
    };

    setCurrentClickerHighlight(clicked.currentClicker, true);
  }

  function canMove() {
    //return x > 0 && x < b.width && y > 0 && y < b.height && y < 30;
    return x > 0 && x < b.width && y > 0 && y < b.height;
  }

  function calc(e) {
    b = pane.getBoundingClientRect();
    x = e.clientX - b.left;
    y = e.clientY - b.top;

    onTopEdge = y < MARGINS;
    onLeftEdge = x < MARGINS;
    onRightEdge = x >= b.width - MARGINS;
    onBottomEdge = y >= b.height - MARGINS;

    rightScreenEdge = window.innerWidth - MARGINS;
    bottomScreenEdge = window.innerHeight - MARGINS;
  }

  var e;

  function onMove(ee) {
    calc(ee);

    e = ee;

    redraw = true;
  }

  function getApplyBounds(el, drop, snapped) {
    var compiledWidth = pane.getBoundingClientRect().width > (window.innerWidth - 1) ? minWidth : pane.getBoundingClientRect().width;
    var region = null;

    if (b.top < MARGINS) {
      region = 'top';
      setBounds(el, 0, 0, window.innerWidth, minHeight);
    } else if (b.left < MARGINS) {
      region = 'left';
      //setBounds(el, 0, 0, compiledWidth, window.innerHeight);
      setBounds(el, 0, 0, 410, window.innerHeight);
    } else if (b.right > rightScreenEdge) {
      region = 'right';
      //setBounds(el, window.innerWidth - compiledWidth, 0, compiledWidth, window.innerHeight);
      setBounds(el, window.innerWidth - 410, 0, 410, window.innerHeight);
    } else if (b.bottom > bottomScreenEdge) {
      region = 'bottom';
      //setBounds(el, 0, window.innerHeight / 2, window.innerWidth, minHeight);
      setBounds(el, 0, window.innerHeight - minHeight, window.innerWidth, minHeight);
    } else {
      if (drop) {
        return null;
      } else {
        hintHide();
        return;
      }
    }

    if (drop) { return { 'region': region, 'snapped': snapped }; }

    el.style.opacity = 0.2;
  }

  function getCursorState() {
    // style cursor
    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
      return 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
      return 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
      return 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
      return 'ns-resize';
    } else if (canMove()) {
      return 'move';
    } else {
      return 'default';
    }
  }

  function setSnappinClass(region) {
  	const snap = region.charAt(0).toUpperCase() + region.slice(1);
    // We set a spacial class to the containing div so that we can manipulate the css for the snapped layout
  	pane.className = 'animated bounceInRight goldfishSnap' + snap;
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!redraw) return;

    redraw = false;

    if (clicked && clicked.isResizing) {

      if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
      if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

      if (clicked.onLeftEdge) {
        var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
        if (currentWidth > minWidth) {
          pane.style.width = currentWidth + 'px';
          pane.style.left = e.clientX + 'px';
        }
      }

      if (clicked.onTopEdge) {
        var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
        if (currentHeight > minHeight) {
          pane.style.height = currentHeight + 'px';
          pane.style.top = e.clientY + 'px';
        }
      }

      hintHide();

      return;
    }

    if (clicked && clicked.isMoving) {
      getApplyBounds(ghostpane, false, null);

      if (preSnapped) {
        setBounds(pane,
          e.clientX - preSnapped.width / 2,
          e.clientY - Math.min(clicked.y, preSnapped.height),
          preSnapped.width,
          preSnapped.height
        );
        return;
      }

      // moving
      pane.style.top = (e.clientY - clicked.y) + 'px';
      pane.style.left = (e.clientX - clicked.x) + 'px';

      return;
    }

    // This code executes when mouse moves without clicking
    const curs = getCursorState();

    clickers.forEach(function(clicker) {
      // Set the cursor style for the drag to snapin element
      document.getElementById(clicker).style.cursor = curs;
    });
  }

  function onUp(e) {
    calc(e);

    if (clicked && clicked.isMoving) {
      // Snap
      var snapped = {
        width: b.width,
        height: b.height
      };

      var boundParams = getApplyBounds(pane, true, snapped);
      preSnapped = boundParams.snapped;

      setSnappinClass(boundParams.region);
      setCurrentClickerHighlight(clicked.currentClicker, false);

      hintHide();
    }

    clicked = null;

    ghostpane.style.display = 'none';
  }

  function setEventListeners() {
    clickers.forEach(function(clicker) {
      const clickElement = document.getElementById(clicker);

      if (clickElement !== null) {
        // Mouse events
        clickElement.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);

        // Touch events
        clickElement.addEventListener('touchstart', onTouchDown);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
      }
    });
  }

  function setElements(el, ghost) {
    pane = document.getElementById(el);
    ghostpane = document.getElementById(ghost);

    clickers = clickers;
  }

  namespace.Start = function Start(el, ghost, clickerElements) {
    if (typeof clickerElements !== 'undefiend') {
      clickers = clickerElements;

      setElements(el, ghost);
      setEventListeners();
      animate();
    } else {
      console.log('Goldfish.ResizeSnapin Please provide the clickers parameter (array) when calling the ResizeSnappin extension. Exiting...');
    }
  };

})(Goldfish.ResizeSnapin = Goldfish.ResizeSnapin || {});

Goldfish.ResizeSnapin.Start('outer-space', 'component-ghostpane', clickers);