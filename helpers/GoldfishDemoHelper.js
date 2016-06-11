/*
  Demo helper for launching goldfish on a non-sharepoint site (for demo purposes).
*/
var heightOfDemo = document.body.getBoundingClientRect().bottom;

Goldfish.Create({
  menu: 'alternate-tabs',
  css: {
    primary: '#188efb',
    overrides: '#component-holder { width:100%; } #outer-space { top:0; height:' + heightOfDemo + 'px; } #component, #component-favourites, #component-layout, #component-settings { width: inherit !important; margin-right: -170px; } #component .input input[type="text"] { background-color: #ffffff; }'
  }
});

/*
 * Resize Snapin - based ont he work done by @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */

"use strict";

(function(namespace, el, ghost) {
  // Minimum resizable area
  var minWidth = 400;
  var minHeight = 400;

  // Thresholds - leave these alone
  var FULLSCREEN_MARGINS = -10;
  var MARGINS = 4;

  // End of what's configurable.
  var clicked = null;
  var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

  var rightScreenEdge, bottomScreenEdge;

  var preSnapped;

  var b, x, y;

  var redraw = false;

  var pane = document.getElementById(el);
  var ghostpane = document.getElementById(ghost);

  function setBounds(element, x, y, w, h) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = w + 'px';
    element.style.height = h + 'px';
  }

  function hintHide() {
    setBounds(ghostpane, b.left, b.top, b.width, b.height);
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
    if (e.touches.length ==0) onUp(e.changedTouches[0]);
  }

  function onMouseDown(e) {
    onDown(e);
    e.preventDefault();
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
      isResizing: isResizing,
      isMoving: !isResizing && canMove(),
      onTopEdge: onTopEdge,
      onLeftEdge: onLeftEdge,
      onRightEdge: onRightEdge,
      onBottomEdge: onBottomEdge
    };
  }

  function canMove() {
    return x > 0 && x < b.width && y > 0 && y < b.height
    && y < 30;
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
    var compiledWidth = pane.getBoundingClientRect().width > window.innerWidth ? 500 : pane.getBoundingClientRect().width;

  	if (b.top < MARGINS) {
        // hintTop();
        setBounds(el, 0, 0, window.innerWidth, 500);
        if (drop) {
          return snapped;
        }
      } else if (b.left < MARGINS) {
        // hintLeft();
        setBounds(el, 0, 0, compiledWidth, window.innerHeight);
        if (drop) {
          return snapped;
        }
      } else if (b.right > rightScreenEdge) {
        // hintRight();
        setBounds(el, window.innerWidth - compiledWidth, 0, compiledWidth, window.innerHeight);
        if (drop) {
          return snapped;
        }
      } else if (b.bottom > bottomScreenEdge) {
        // hintBottom();
        setBounds(el, 0, window.innerHeight / 2, window.innerWidth, 500);
        if (drop) {
          return snapped;
        }
      } else {
      	if (drop) {
          return null;
        } else {
          hintHide();
          return;
        }
      }

      el.style.opacity = 0.2;
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

    // style cursor
    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
      pane.style.cursor = 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
      pane.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
      pane.style.cursor = 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
      pane.style.cursor = 'ns-resize';
    } else if (canMove()) {
      pane.style.cursor = 'move';
    } else {
      pane.style.cursor = 'default';
    }
  }

  function onUp(e) {
    calc(e);

    if (clicked && clicked.isMoving) {
      // Snap
      var snapped = {
        width: b.width,
        height: b.height
      };

      preSnapped = getApplyBounds(pane, true, snapped);

      hintHide();
    }

    clicked = null;

    ghostpane.style.display = 'none';
  }

  function setEventListeners() {
    // Mouse events
    pane.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    // Touch events
    pane.addEventListener('touchstart', onTouchDown);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  }

  namespace.Start = function Start() {
  	setEventListeners();
  	animate();
  };

})(Goldfish.ResizeSnapin = Goldfish.ResizeSnapin || {}, 'outer-space', 'component-ghostpane');

Goldfish.ResizeSnapin.Start();
