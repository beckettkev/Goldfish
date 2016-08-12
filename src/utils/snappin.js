
/*
 * Resize Snapin - based on the work done by @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */
export default class Snappin {
  constructor() {
    // Minimum resizable area (width and height)
    this.minWidth = 450;
    this.minHeight = 450;

    // Thresholds - leave these alone
    this.fullscreenMargins = -10;
    this.margins = 4;

    // End of what's configurable.
    this.clicked = null;

    // Resizing booleans indicating if we are resizing from one of these points
    this.onRightEdge = null;
    this.onBottomEdge = null
    this.onLeftEdge = null;
    this.onTopEdge = null;
    this.currentClicker = null;

    this.rightScreenEdge = null;
    this.bottomScreenEdge = null;

    this.preSnapped = null;

    this.b = null;
    this.x = null;
    this.y = null;

    this.redraw = false;

    this.evt = null;

    // The app holding div element (that we move to the snappin) - pane
    // The ghost panel demonstrating the drop point for the move - ghostpane
    this.pane = null;
    this.ghostpane = null;
    this.ticker = null;

    // The array of ids for elements that will be the snappin clicking regions
    this.clickers = null;

    this.primaryColour = Goldfish.GetPrimaryColour();
  }

  // Sets the positioning of the app along with the height and width (during a drag move)
  setBounds = (element, x, y, w, h) => {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = w + 'px';
    element.style.height = h === 'auto' ? h : h + 'px';
  }

  getCurrentClicker = e => { return e.target || e.srcElement; }

  hintHide = () => {
    this.ghostpane.style.opacity = 0;
  }

  calc = e => {
    this.b = this.pane.getBoundingClientRect();
    this.x = e.clientX - this.b.left;
    this.y = e.clientY - this.b.top;

    this.onTopEdge = this.y < this.margins;
    this.onLeftEdge = this.x < this.margins;
    this.onRightEdge = this.x >= this.b.width - this.margins;
    this.onBottomEdge = this.y >= this.b.height - this.margins;
    this.rightScreenEdge = window.innerWidth - this.margins;
    this.bottomScreenEdge = window.innerHeight - this.margins;
  }

  onTouchDown = e => {
    this.onDown(e.touches[0]);

    e.preventDefault();
  }

  onTouchMove = e => {
    this.onMove(e.touches[0]);
  }

  onTouchEnd = e => {
    if (e.touches.length === 0) {
      this.onUp(e.changedTouches[0]);
    }
  }

  onMouseDown = e => {
    this.onDown(e);

    e.preventDefault();
  }

  setCurrentClickerHighlight = (el, highlight) => {
    el.style.color = highlight ? this.primaryColour : '';

    el.className = highlight ? el.className + ' animated pulse' : el.className.replace(/ animated pulse/g, '');

    // When an action is being carried out, change the border style otherwise don't
    document.getElementById('outer-space').style.border = highlight ? '2px dashed #cccccc' : '';
  }

  canMove = () => {
    return this.x > 0 && this.x < this.b.width && this.y > 0 && this.y < this.b.height;
  }

  onDown = (e) => {
    this.ghostpane.style.display = '';

    this.calc(e);

    this.clicked = {
      x: this.x,
      y: this.y,
      cx: e.clientX,
      cy: e.clientY,
      w: this.b.width,
      h: this.b.height,
      currentClicker: this.getCurrentClicker(e),
      isMoving: this.canMove(),
      onTopEdge: this.onTopEdge,
      onLeftEdge: this.onLeftEdge,
      onRightEdge: this.onRightEdge,
      onBottomEdge: this.onBottomEdge
    };

    this.setCurrentClickerHighlight(this.clicked.currentClicker, true);
  }

  onMove = (ee) => {
    this.calc(ee);

    this.evt = ee;
    this.redraw = true;
  }

  getApplyBounds = (el, drop, snapped) => {
    const leftRightTopOffset = typeof window.fakeAjaxCalls === 'undefined' ? 85 : 0;
    const compiledWidth = this.pane.getBoundingClientRect().width > (window.innerWidth - 1) ? this.minWidth : this.pane.getBoundingClientRect().width;

    let region = null;

    if (this.b.top < this.margins) {
      region = 'top';
      this.setBounds(el, 0, 0, window.innerWidth, this.minHeight);
    } else if (this.b.left < this.margins) {
      region = 'left';
      this.setBounds(el, 0, leftRightTopOffset, 410, 'auto');
    } else if (this.b.right > this.rightScreenEdge) {
      region = 'right';
      this.setBounds(el, window.innerWidth - 410, leftRightTopOffset, 410, 'auto');
    } else if (this.b.bottom > this.bottomScreenEdge) {
      region = 'bottom';
      this.setBounds(el, 0, window.innerHeight - this.minHeight, window.innerWidth, this.minHeight);
    } else {
      if (drop) {
        return null;
      } else {
        this.hintHide();
        return;
      }
    }

    if (drop) { return { 'region': region, 'snapped': snapped }; }

    el.style.opacity = 0.2;
  }

  getCursorState = () => {
    // style cursor
    return this.canMove() ? 'move' : 'default';
  }

  setSnappinClass = region => {
    const snap = region.charAt(0).toUpperCase() + region.slice(1);

    // We set a spacial class to the containing div so that we can manipulate the css for the snapped layout
    this.pane.className = `animated bounceInRight goldfishSnap${snap}`;

    this.registerNewPosition();
  }

  registerNewPosition = () => {
    // Tell the default view that we have changed the position of the app
    const newPosition = new window.CustomEvent(
      'Goldfish.Snappin',
      {
        detail: {
          time: new Date(),
        },
        bubbles: true,
        cancelable: true,
      }
    );

    document.dispatchEvent(newPosition);
  }

  animate = () => {
    if (document.getElementById(this.clickers[0]) !== null) {
        requestAnimationFrame(this.animate);

        if (!this.redraw) return;

        this.redraw = false;

        if (this.clicked && this.clicked.isMoving) {
          this.getApplyBounds(this.ghostpane, false, null);

          if (this.preSnapped) {
            this.setBounds(this.pane,
              this.evt.clientX - this.preSnapped.width / 2,
              this.evt.clientY - Math.min(this.clicked.y, this.preSnapped.height),
              this.preSnapped.width,
              this.preSnapped.height
            );

            return;
          }

          // moving
          this.pane.style.top = (this.evt.clientY - this.clicked.y) + 'px';
          this.pane.style.left = (this.evt.clientX - this.clicked.x) + 'px';
          return;
        }

        // This code executes when mouse moves without clicking
        const curs = this.getCursorState();

        this.clickers.forEach(function(clicker) {
          // Set the cursor style for the drag to snapin element
          document.getElementById(clicker).style.cursor = curs;
        });
    } else {
        return;
    }
  }

  onUp = e => {
    if (document.getElementById(this.clickers[0]) !== null) {
      this.calc(e);

      if (this.clicked && this.clicked.isMoving) {
        // Snap
        const snapped = {
          width: this.b.width,
          height: this.b.height
        };

        const boundParams = this.getApplyBounds(this.pane, true, snapped);
        this.preSnapped = boundParams.snapped;

        this.setSnappinClass(boundParams.region);
        this.setCurrentClickerHighlight(this.clicked.currentClicker, false);

        this.hintHide();
      }

      this.clicked = null;

      this.ghostpane.style.display = 'none';
    }
  }

  bindEventListener = (add, el, type, func) => {
    if (add) {
        el.addEventListener(type, func);
    } else {
        el.removeEventListener(type, func);
    }
  }

  setEventListeners = add => {
    const self = this;
    // For every drag element, we need to set or remove the event listener
    this.clickers.forEach(function(clicker) {
      const clickElement = document.getElementById(clicker);

      if (clickElement !== null) {
        // Mouse and touch events - add or remove drag element events
        [
          { 'mousedown': self.onMouseDown, 'element': clickElement },
          { 'mousemove': self.onMove, 'element': document },
          { 'mouseup': self.onUp, 'element': document },
          { 'touchstart': self.onTouchDown, 'element': clickElement},
          { 'touchmove': self.onTouchMove, 'element': document },
          { 'touchend': self.onTouchEnd, 'element': document }
        ].forEach(function(mapping) {
            self.bindEventListener(add, mapping.element, Object.keys(mapping)[0], mapping[Object.keys(mapping)[0]]);
        });
      }
    });
  }

  setElements = (el, ghost) => {
    this.pane = document.getElementById(el);
    this.ghostpane = document.getElementById(ghost);
  }

  start = (el, ghost, clickerElements) => {
    if (document.getElementById(el) !== null) {
      if (typeof clickerElements !== 'undefiend') {
        this.clickers = clickerElements;

        this.setElements(el, ghost);
        this.setEventListeners(true);
        this.animate();
      } else {
        console.log('Goldfish.ResizeSnapin Please provide the clickers parameter (array) when calling the ResizeSnappin extension. Exiting...');
      }
    } else {
      this.ticker = setTimeout(function() {
        this.Start(el, ghost, clickerElements);
      }, 1000);
    }
  }

  end = () => {
    this.setEventListeners(false);

    clearTimeout(this.ticker);
  }
}
