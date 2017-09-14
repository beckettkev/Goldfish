import Utils from '../utils/utilities';

/*
 * Resize Snapin - based on the work done by @author https://twitter.com/blurspline / https://github.com/zz85
 * See post @ http://www.lab4games.net/zz85/blog/2014/11/15/resizing-moving-snapping-windows-with-js-css/
 */
export default class Snappin {

  minWidth: number;
  minHeight: number;
  fullscreenMargins: number;
  margins: number;
  clicked?: any;

  onRightEdge?: boolean;
  onBottomEdge?: boolean;
  onLeftEdge?: boolean;
  onTopEdge?: boolean;
  currentClicker?: boolean;
  rightScreenEdge?: number;
  bottomScreenEdge?: number;
  preSnapped?: any;

  Start: Function;
  b: any;
  x: number;
  y: number;

  redraw?: boolean;
  evt?: any;

  pane?: any;
  ghostpane?: any;
  ticker?: any;
  clickers?: any;

  primaryColour?: string;

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

    this.primaryColour = window.Goldfish.GetPrimaryColour();
  }

  // Sets the positioning of the app along with the height and width (during a drag move)
  setBounds = (element: HTMLElement, x: number, y: number, w: number, h: any): void => {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = w + 'px';
    element.style.height = h === 'auto' ? h : h + 'px';
  }

  getCurrentClicker = (e: any): any => { return e.target || e.srcElement; }

  hintHide = (): void => {
    this.ghostpane.style.opacity = 0;
  }

  calc = (e: any): void => {
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

  onTouchDown = (e: any): void => {
    this.onDown(e.touches[0]);

    e.preventDefault();
  }

  onTouchMove = (e: any): void => {
    this.onMove(e.touches[0]);
  }

  onTouchEnd = (e: any): void => {
    if (e.touches.length === 0) {
      this.onUp(e.changedTouches[0]);
    }
  }

  onMouseDown = (e: any): void => {
    this.onDown(e);

    e.preventDefault();
  }

  setCurrentClickerHighlight = (el: HTMLElement, highlight: boolean): void => {
    el.style.color = highlight ? this.primaryColour : '';

    el.className = highlight ? el.className + ' animated pulse' : el.className.replace(/ animated pulse/g, '');

    // When an action is being carried out, change the border style otherwise don't
    document.getElementById('outer-space').style.border = highlight ? '2px dashed #cccccc' : '';
  }

  canMove = (): boolean => {
    return this.x > 0 && this.x < this.b.width && this.y > 0 && this.y < this.b.height;
  }

  onDown = (e: any): void => {
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

  onMove = (ee: any): void => {
    this.calc(ee);

    this.evt = ee;
    this.redraw = true;
  }

<<<<<<< HEAD:app/src/utils/snappin.ts
  getApplyBounds = (el: HTMLElement, drop: boolean, snapped: any): any => {
    const leftRightTopOffset: number = typeof window.fakeAjaxCalls === 'undefined' ? 85 : 0;
    const compiledWidth: number = this.pane.getBoundingClientRect().width > (window.innerWidth - 1) ? this.minWidth : this.pane.getBoundingClientRect().width;
=======
  getApplyBounds = (el, drop, snapped) => {
    const leftRightTopOffset = typeof window.fakeAjaxCalls === 'undefined' ? 85 : 0;
    //const compiledWidth = this.pane.getBoundingClientRect().width > (window.innerWidth - 1) ? this.minWidth : this.pane.getBoundingClientRect().width;
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/utils/snappin.js

    let region: string = null;

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

    if (drop) { 
      return { 
        region, 
        snapped 
      }; 
    }

    el.style.opacity = '0.2';
  }

  getCursorState = (): string => {
    // style cursor
    return this.canMove() ? 'move' : 'default';
  }

<<<<<<< HEAD:app/src/utils/snappin.ts
  setSnappinClass = (region: string): void => {
    const snap: string = region.charAt(0).toUpperCase() + region.slice(1);
=======
  setSnappinClass = region => {
    const snap = Utils.capitalizeFirstLetter(region);
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/utils/snappin.js

    // We set a spacial class to the containing div so that we can manipulate the css for the snapped layout
    this.pane.className = `animated bounceInRight goldfishSnap${snap}`;

    this.registerNewPosition();
  }

  registerNewPosition = (): void => {
    // Tell the default view that we have changed the position of the app
    const newPosition: any = new window.CustomEvent(
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

<<<<<<< HEAD:app/src/utils/snappin.ts
      if (!this.redraw) return;
=======
        if (!this.redraw) {
          return;
        }
>>>>>>> 9461183eed53bd47bae5f4282481402b13e43062:src/utils/snappin.js

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

      this.clickers.forEach((clicker: string) => {
        // Set the cursor style for the drag to snapin element
        document.getElementById(clicker).style.cursor = curs;
      });
    } else {
      return;
    }
  }

  onUp = (e: any): void => {
    if (document.getElementById(this.clickers[0]) !== null) {
      this.calc(e);

      if (this.clicked && this.clicked.isMoving) {
        const snapped: any = {
          width: this.b.width,
          height: this.b.height
        };

        const boundParams: any = this.getApplyBounds(this.pane, true, snapped);
        this.preSnapped = boundParams.snapped;

        this.setSnappinClass(boundParams.region);
        this.setCurrentClickerHighlight(this.clicked.currentClicker, false);

        this.hintHide();
      }

      this.clicked = null;

      this.ghostpane.style.display = 'none';
    }
  }

  bindEventListener = (add: boolean, el: HTMLElement, type: any, func: any): void => {
    if (add) {
      el.addEventListener(type, func);
    } else {
      el.removeEventListener(type, func);
    }
  }

  setEventListeners = (add: boolean) => {
    let clickElement: HTMLElement = null;

    // For every drag element, we need to set or remove the event listener
    this.clickers.forEach((clicker: string) => {
      clickElement = document.getElementById(clicker);

      if (clickElement !== null) {
        // Mouse and touch events - add or remove drag element events
        [
          { 'mousedown': this.onMouseDown, 'element': clickElement },
          { 'mousemove': this.onMove, 'element': document },
          { 'mouseup': this.onUp, 'element': document },
          { 'touchstart': this.onTouchDown, 'element': clickElement },
          { 'touchmove': this.onTouchMove, 'element': document },
          { 'touchend': this.onTouchEnd, 'element': document }
        ].forEach((mapping: any) => this.bindEventListener(add, mapping.element, Object.keys(mapping)[0], mapping[Object.keys(mapping)[0]]));
      }
    });
  }

  setElements = (el: string, ghost: string): void => {
    this.pane = document.getElementById(el);
    this.ghostpane = document.getElementById(ghost);
  }

  start = (el: string, ghost: string, clickerElements: Array<any>): void => {
    if (document.getElementById(el) !== null) {
      if (typeof clickerElements !== 'undefined') {
        this.clickers = clickerElements;

        this.setElements(el, ghost);
        this.setEventListeners(true);
        this.animate();
      } else {
        console.log('Goldfish.ResizeSnapin Please provide the clickers parameter (array) when calling the ResizeSnappin extension. Exiting...');
      }
    } else {
      this.ticker = window.setTimeout(() => {
        this.Start(el, ghost, clickerElements);
      }, 1000);
    }
  }

  end = (): void => {
    this.setEventListeners(false);

    clearTimeout(this.ticker);
  }
}
