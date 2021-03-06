/**
 * Plugin wrapper.
 * @param {Object} config_opts configuration options
 * @constructor
 */
annotorious.plugin.FreehandSelector = function(config_opts) {
  if (config_opts)
    this._activate = config_opts.activate;
}

/**
 * Attach a new selector onInitAnnotator.
 */
annotorious.plugin.FreehandSelector.prototype.onInitAnnotator = function(annotator) {
  annotator.addSelector(new annotorious.plugin.FreehandSelector.Selector(), 'freehand');
  if (this._activate)
    annotator.setCurrentSelector('freehand');
}

/**
 * A selector for free-form drawing.
 * @constructor
 */
annotorious.plugin.FreehandSelector.Selector = function() { }

/**
 * Initializes the selector.
 * @param {object} annotator reference to the annotator
 * @param {element} canvas the canvas to draw on
 */
annotorious.plugin.FreehandSelector.Selector.prototype.init = function(annotator, canvas) {  
  /** @private **/
  this._canvas = canvas;
  
  /** @private **/
  this._annotator = annotator;

  /** @private **/
  this._g2d = canvas.getContext('2d');
  this._g2d.lineWidth = 2;
  this._g2d.strokeStyle = '#fff';
  
  /** @private **/
  this._enabled = false;

  /*
  paper.setup(canvas);
 
  var path = new paper.Path();
  path.strokeColor = '#ffffff';

  var moveListener = function(event) {
    var to = new paper.Point(event.offsetX, event.offsetY);
    path.lineTo(to);
    paper.view.draw();
  }

  goog.events.listen(canvas, goog.events.EventType.MOUSEDOWN, function(event) {
    goog.events.listen(canvas, goog.events.EventType.MOUSEMOVE, moveListener);
    var start = new paper.Point(event.offsetX, event.offsetY);
    path.moveTo(start);
  });

  goog.events.listen(canvas, goog.events.EventType.MOUSEUP, function(event) {
    path = new paper.Path();
    path.strokeColor = '#ffffff';
    goog.events.unlisten(canvas, goog.events.EventType.MOUSEMOVE, moveListener);
  });
  */
}

/**
 * Attaches MOUSEUP and MOUSEMOVE listeners to the editing canvas.
 * @private
 */
annotorious.plugin.FreehandSelector.Selector.prototype._attachListeners = function() {
  var self = this;  
  this._mouseMoveListener = this._canvas.addEventListener('mousemove', function(event) {
    if (self._enabled) {
      var pos = (event.offsetX == undefined) ? 
        { x: event.layerX, y: event.layerY } : 
        { x: event.offsetX, y: event.offsetY };
        
      self._g2d.lineTo(pos.x, pos.y);
      self._g2d.stroke();
    }
  });
  
  this._mouseUpListener = this._canvas.addEventListener('mouseup', function(event) {
    self._enabled = false;
    var shape = self.getShape();
    self._annotator.fireEvent('onSelectionCompleted',
      { mouseEvent: event, shape: shape, viewportBounds: self.getViewportBounds() }); 
  });
}

/**
 * Detaches MOUSEUP and MOUSEMOVE listeners from the editing canvas.
 * @private
 */
annotorious.plugin.FreehandSelector.Selector.prototype._detachListeners = function() {
  if (this._mouseMoveListener)
    delete this._mouseMoveListener;

  if (this._mouseUpListener)
    delete this._UpListener;
}

/**
 * Selector API method: returns the selector name.
 * @returns the selector name
 */
annotorious.plugin.FreehandSelector.Selector.prototype.getName = function() {
  return 'freehand';
}

/**
 * Selector API method: returns the supported shape type.
 * @return the supported shape type
 */
annotorious.plugin.FreehandSelector.Selector.prototype.getSupportedShapeType = function() {
  return 'freehand';
}

/**
 * Selector API method: starts the selection at the specified coordinates.
 * @param {number} x the X coordinate
 * @param {number} y the Y coordinate
 */
annotorious.plugin.FreehandSelector.Selector.prototype.startSelection = function(x, y) {
  this._enabled = true;
  this._attachListeners();
  this._anchor = { x: x, y: y };
  this._annotator.fireEvent('onSelectionStarted', { offsetX: x, offsetY: y });
  document.body.style.webkitUserSelect = 'none';
}

/**
 * Selector API method: returns the currently edited shape.
 * @returns {annotorious.shape.Shape} the shape
 */
annotorious.plugin.FreehandSelector.Selector.prototype.getShape = function() {
  // TODO implement
}

/**
 * Selector API method: returns the bounds of the selected shape, in viewport (= pixel) coordinates.
 * @returns {object} the shape viewport bounds
 */
annotorious.plugin.FreehandSelector.Selector.prototype.getViewportBounds = function() {
  // TODO implement
}



