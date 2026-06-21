/**
 * Shared grid pathway utilities for AC9M4SP02 and AC9M4N09.
 * Pure functions — safe to unit-test in Node.
 */
(function gridPathUtils(global) {
  var MCS = global.MCS || (global.MCS = {});

  var DIRECTION_ALIASES = {
    north: 'north',
    up: 'north',
    forward: 'north',
    east: 'east',
    right: 'east',
    south: 'south',
    down: 'south',
    backward: 'south',
    west: 'west',
    left: 'west',
  };

  var DIRECTION_LABELS = {
    north: 'North',
    east: 'East',
    south: 'South',
    west: 'West',
  };

  function normaliseDirection(dir) {
    if (!dir) return '';
    var key = String(dir).toLowerCase().trim();
    return DIRECTION_ALIASES[key] || key;
  }

  function formatDirectionText(dir, count) {
    var canon = normaliseDirection(dir);
    var label = DIRECTION_LABELS[canon] || canon;
    return label + ' ' + count;
  }

  function cellKey(point) {
    return point && point.col && point.row != null ? point.col + point.row : '';
  }

  function pathsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (var i = 0; i < a.length; i += 1) {
      if (a[i].col !== b[i].col || a[i].row !== b[i].row) return false;
    }
    return true;
  }

  function areAdjacent(a, b) {
    if (!a || !b) return false;
    var colDelta = Math.abs(String(a.col).charCodeAt(0) - String(b.col).charCodeAt(0));
    var rowDelta = Math.abs(Number(a.row) - Number(b.row));
    return (colDelta === 1 && rowDelta === 0) || (colDelta === 0 && rowDelta === 1);
  }

  function normaliseSteps(steps) {
    return (steps || []).map(function (step) {
      return {
        dir: normaliseDirection(step.dir),
        count: Number(step.count) || 0,
      };
    });
  }

  function computeGridRoute(start, steps, cols, rows) {
    var path = [{ col: start.col, row: start.row }];
    var colIdx = cols.indexOf(start.col);
    var rowIdx = rows.indexOf(start.row);
    if (colIdx < 0 || rowIdx < 0) return path;

    normaliseSteps(steps).forEach(function (step) {
      for (var i = 0; i < step.count; i += 1) {
        if (step.dir === 'north') rowIdx -= 1;
        else if (step.dir === 'east') colIdx += 1;
        else if (step.dir === 'south') rowIdx += 1;
        else if (step.dir === 'west') colIdx -= 1;

        if (colIdx >= 0 && colIdx < cols.length && rowIdx >= 0 && rowIdx < rows.length) {
          path.push({ col: cols[colIdx], row: rows[rowIdx] });
        }
      }
    });
    return path;
  }

  function expandDirectionsToPath(start, steps, cols, rows) {
    return computeGridRoute(start, steps, cols, rows);
  }

  function compressPathToDirections(path, cols, rows) {
    if (!Array.isArray(path) || path.length < 2) return [];
    var steps = [];
    var i = 1;
    while (i < path.length) {
      var prev = path[i - 1];
      var curr = path[i];
      var colDelta = cols.indexOf(curr.col) - cols.indexOf(prev.col);
      var rowDelta = rows.indexOf(curr.row) - rows.indexOf(prev.row);
      var dir = '';
      if (colDelta === 1) dir = 'east';
      else if (colDelta === -1) dir = 'west';
      else if (rowDelta === -1) dir = 'north';
      else if (rowDelta === 1) dir = 'south';
      if (!dir) {
        i += 1;
        continue;
      }
      var last = steps[steps.length - 1];
      if (last && last.dir === dir) last.count += 1;
      else steps.push({ dir: dir, count: 1 });
      i += 1;
    }
    return steps;
  }

  function buildPathwayVariantKey(start, steps) {
    return (
      start.col +
      start.row +
      '|' +
      normaliseSteps(steps)
        .map(function (s) {
          return s.dir + ':' + s.count;
        })
        .join(',')
    );
  }

  function formatMapDirectionPrompt(start, steps) {
    var stepText = normaliseSteps(steps)
      .map(function (s) {
        return '**' + formatDirectionText(s.dir, s.count) + '**';
      })
      .join(', then ');
    return (
      'Start at **' +
      start.col +
      start.row +
      '**. Move ' +
      stepText +
      '. Trace every cell in the pathway.'
    );
  }

  function formatPathwayPrompt(start, steps) {
    return formatMapDirectionPrompt(start, steps).replace(
      '. Trace every cell in the pathway.',
      '. Where do you finish if the grid moves only along lines?'
    );
  }

  function describePathwaySolution(start, steps, path) {
    var cursor = 0;
    var phrases = [];
    normaliseSteps(steps).forEach(function (step, stepNum) {
      cursor += step.count;
      var cell = path[cursor];
      if (!cell) return;
      var label = DIRECTION_LABELS[step.dir] || step.dir;
      if (stepNum === 0) {
        phrases.push(
          label + ' ' + step.count + ' from ' + start.col + start.row + ' reaches **' + cell.col + cell.row + '**'
        );
      } else {
        phrases.push(label.toLowerCase() + ' ' + step.count + ' reaches **' + cell.col + cell.row + '**');
      }
    });
    return phrases.join(', ') + '.';
  }

  function isValidPathwayRoute(start, steps, cols, rows) {
    var path = computeGridRoute(start, steps, cols, rows);
    var expectedLen = 1 + normaliseSteps(steps).reduce(function (sum, step) {
      return sum + step.count;
    }, 0);
    if (path.length !== expectedLen) return null;
    var end = path[path.length - 1];
    if (end.col === start.col && end.row === start.row) return null;
    return path;
  }

  function validateTracedPath(options) {
    options = options || {};
    var expectedPath = options.expectedPath || [];
    var tracedPath = options.tracedPath || [];
    var errors = [];
    var scoreParts = {
      start: false,
      adjacency: false,
      order: false,
      distance: false,
      destination: false,
      noExtras: false,
    };

    if (!expectedPath.length) {
      errors.push('missing expected path');
      return { correct: false, scoreParts: scoreParts, errors: errors };
    }

    scoreParts.start =
      tracedPath.length > 0 &&
      tracedPath[0].col === expectedPath[0].col &&
      tracedPath[0].row === expectedPath[0].row;
    if (!scoreParts.start) errors.push('incorrect or missing start cell');

    var adjacencyOk = tracedPath.length > 0;
    for (var i = 1; i < tracedPath.length; i += 1) {
      if (!areAdjacent(tracedPath[i - 1], tracedPath[i])) {
        adjacencyOk = false;
        errors.push('non-adjacent move at step ' + (i + 1));
        break;
      }
    }
    scoreParts.adjacency = adjacencyOk;

    var expectedEnd = expectedPath[expectedPath.length - 1];
    var tracedEnd = tracedPath[tracedPath.length - 1];
    scoreParts.destination =
      !!tracedEnd &&
      tracedEnd.col === expectedEnd.col &&
      tracedEnd.row === expectedEnd.row;
    if (!scoreParts.destination) errors.push('incorrect destination');

    scoreParts.noExtras = tracedPath.length === expectedPath.length;
    if (!scoreParts.noExtras) errors.push('path length mismatch');

    scoreParts.order = pathsEqual(tracedPath, expectedPath);
    if (!scoreParts.order) errors.push('path cells or order incorrect');

    scoreParts.distance = scoreParts.order;

    var correct =
      scoreParts.start &&
      scoreParts.adjacency &&
      scoreParts.order &&
      scoreParts.distance &&
      scoreParts.destination &&
      scoreParts.noExtras;

    return { correct: correct, scoreParts: scoreParts, errors: errors };
  }

  function isCellBlocked(point, blockedCells) {
    if (!point || !Array.isArray(blockedCells)) return false;
    return blockedCells.some(function (b) {
      return b.col === point.col && b.row === point.row;
    });
  }

  function validateCreatedRoute(options) {
    options = options || {};
    var tracedPath = options.tracedPath || [];
    var describedSteps = options.describedSteps || [];
    var start = options.start;
    var end = options.end;
    var blockedCells = options.blockedCells || [];
    var cols = options.cols || ['A', 'B', 'C', 'D', 'E'];
    var rows = options.rows || [5, 4, 3, 2, 1];
    var errors = [];

    if (!tracedPath.length) {
      return { correct: false, errors: ['empty traced path'] };
    }

    if (tracedPath[0].col !== start.col || tracedPath[0].row !== start.row) {
      errors.push('route must start at required cell');
    }

    var last = tracedPath[tracedPath.length - 1];
    if (last.col !== end.col || last.row !== end.row) {
      errors.push('route must end at destination');
    }

    for (var i = 1; i < tracedPath.length; i += 1) {
      if (!areAdjacent(tracedPath[i - 1], tracedPath[i])) {
        errors.push('non-adjacent move');
        break;
      }
      if (cols.indexOf(tracedPath[i].col) < 0 || rows.indexOf(tracedPath[i].row) < 0) {
        errors.push('route leaves grid');
        break;
      }
      if (isCellBlocked(tracedPath[i], blockedCells)) {
        errors.push('route crosses blocked cell');
        break;
      }
    }

    if (isCellBlocked(tracedPath[0], blockedCells)) {
      errors.push('start cell is blocked');
    }

    var describedPath = computeGridRoute(start, describedSteps, cols, rows);
    if (!pathsEqual(tracedPath, describedPath)) {
      errors.push('written directions do not match traced route');
    }

    return { correct: errors.length === 0, errors: errors };
  }

  MCS.gridPath = {
    DIRECTION_ALIASES: DIRECTION_ALIASES,
    normaliseDirection: normaliseDirection,
    formatDirectionText: formatDirectionText,
    cellKey: cellKey,
    pathsEqual: pathsEqual,
    areAdjacent: areAdjacent,
    computeGridRoute: computeGridRoute,
    expandDirectionsToPath: expandDirectionsToPath,
    compressPathToDirections: compressPathToDirections,
    buildPathwayVariantKey: buildPathwayVariantKey,
    formatMapDirectionPrompt: formatMapDirectionPrompt,
    formatPathwayPrompt: formatPathwayPrompt,
    describePathwaySolution: describePathwaySolution,
    isValidPathwayRoute: isValidPathwayRoute,
    validateTracedPath: validateTracedPath,
    validateCreatedRoute: validateCreatedRoute,
    isCellBlocked: isCellBlocked,
  };
})(typeof window !== 'undefined' ? window : globalThis);
