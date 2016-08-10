
/*
 * Resize Snapin - based on the work done by @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */
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
var pane, ghostpane, ticker;

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
  var leftRightTopOffset = typeof window.fakeAjaxCalls === 'undefined' ? 85 : 0;
  var compiledWidth = pane.getBoundingClientRect().width > (window.innerWidth - 1) ? minWidth : pane.getBoundingClientRect().width;
  var region = null;

  if (b.top < MARGINS) {
    region = 'top';
    setBounds(el, 0, 0, window.innerWidth, minHeight);
  } else if (b.left < MARGINS) {
    region = 'left';
    setBounds(el, 0, leftRightTopOffset, 410, window.innerHeight);
  } else if (b.right > rightScreenEdge) {
    region = 'right';
    setBounds(el, window.innerWidth - 410, leftRightTopOffset, 410, window.innerHeight);
  } else if (b.bottom > bottomScreenEdge) {
    region = 'bottom';
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
  if (document.getElementById(clickers[0]) !== null) {
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
    } else {
      return;
    }
}

function onUp(e) {
  if (document.getElementById(clickers[0]) !== null) {
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
}

function setEventListeners(add) {
  clickers.forEach(function(clicker) {
    const clickElement = document.getElementById(clicker);

    if (clickElement !== null) {
      // Mouse and touch events
      [{'mousedown':onMouseDown, 'element':clickElement},{'mousemove':onMove, 'element':document},{'mouseup':onUp, 'element':document},{'touchstart':onTouchDown, 'element':clickElement},{'touchmove':onTouchMove, 'element':document},{'touchend':onTouchEnd, 'element':document}].forEach(function(mapping) {
        bindEventListener(add, mapping.element, Object.keys(mapping)[0], mapping[Object.keys(mapping)[0]]);
      });
    }
  });
}

function bindEventListener(add, el, type, func) {
  if (add) {
      el.addEventListener(type, func);
  } else {
      el.removeEventListener(type, func);
  }
}

function setElements(el, ghost) {
  pane = document.getElementById(el);
  ghostpane = document.getElementById(ghost);
}

module.exports = {
  Start: function Start(el, ghost, clickerElements) {
    if (document.getElementById(el) !== null) {
      if (typeof clickerElements !== 'undefiend') {
        clickers = clickerElements;

        setElements(el, ghost);
        setEventListeners(true);
        animate();
      } else {
        console.log('Goldfish.ResizeSnapin Please provide the clickers parameter (array) when calling the ResizeSnappin extension. Exiting...');
      }
    } else {
      ticker = setTimeout(function() { namespace.Start(el, ghost, clickerElements); }, 1000);
    }
  },
  End: function End() {
        setEventListeners(false);

        clearTimeout(ticker);
  }
};
