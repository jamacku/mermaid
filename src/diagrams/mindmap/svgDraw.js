import { select } from 'd3';
import * as db from './mindmapDb';

/**
 * @param {string} text The text to be wrapped
 * @param {number} width The max width of the text
 */
function wrap(text, width) {
  text.each(function () {
    var text = select(this),
      words = text
        .text()
        .split(/(\s+|<br>)/)
        .reverse(),
      word,
      line = [],
      lineHeight = 1.1, // ems
      y = text.attr('y'),
      dy = parseFloat(text.attr('dy')),
      tspan = text
        .text(null)
        .append('tspan')
        .attr('x', 0)
        .attr('y', y)
        .attr('dy', dy + 'em');
    for (let j = 0; j < words.length; j++) {
      word = words[words.length - 1 - j];
      line.push(word);
      tspan.text(line.join(' ').trim());
      if (tspan.node().getComputedTextLength() > width || word === '<br>') {
        line.pop();
        tspan.text(line.join(' ').trim());
        if (word === '<br>') {
          line = [''];
        } else {
          line = [word];
        }

        tspan = text
          .append('tspan')
          .attr('x', 0)
          .attr('y', y)
          .attr('dy', lineHeight + 'em')
          .text(word);
      }
    }
  });
}

const defaultBkg = function (elem, node, section, conf) {
  const rd = 5;
  const r = elem
    .append('path')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr(
      'd',
      `M0 ${node.height - rd} v${-node.height + 2 * rd} q0,-5 5,-5 h${
        node.width - 2 * rd
      } q5,0 5,5 v${node.height - rd} H0 Z`
    );

  elem
    .append('line')
    .attr('class', 'node-line-' + section)
    .attr('x1', 0)
    .attr('y1', node.height)
    .attr('x2', node.width)
    .attr('y2', node.height);
};
const rectBkg = function (elem, node, section, conf) {
  const r = elem
    .append('rect')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr('height', node.height)
    .attr('width', node.width);
};
const cloudBkg = function (elem, node, section, conf) {
  const rd = 5;
  const r = elem;
  const w = node.width;
  const h = node.height;
  const r0 = 0.1 * w;
  const r1 = 0.15 * w;
  const r2 = 0.25 * w;
  const r3 = 0.35 * w;
  const r4 = 0.2 * w;
  const p = elem
    .append('path')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr(
      'd',
      `M0 0 a${r1},${r1} 0 0,1 ${w * 0.25},${-1 * w * 0.1}
      a${r3},${r3} 1 0,1 ${w * 0.4},${-1 * w * 0.1}
      a${r2},${r2} 1 0,1 ${w * 0.35},${1 * w * 0.2}

      a${r1},${r1} 1 0,1 ${w * 0.15},${1 * h * 0.35}
      a${r4},${r4} 1 0,1 ${-1 * w * 0.15},${1 * h * 0.65}

      a${r2},${r1} 1 0,1 ${-1 * w * 0.25},${w * 0.15}
      a${r3},${r3} 1 0,1 ${-1 * w * 0.5},${0}
      a${r1},${r1} 1 0,1 ${-1 * w * 0.25},${-1 * w * 0.15}

      a${r1},${r1} 1 0,1 ${-1 * w * 0.1},${-1 * h * 0.35}
      a${r4},${r4} 1 0,1 ${w * 0.1},${-1 * h * 0.65}

    H0 V0 Z`
    );
};
const bangBkg = function (elem, node, section, conf) {
  const rd = 5;
  const w = node.width;
  const h = node.height;
  const r = 0.15 * w;
  const p = elem
    .append('path')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr(
      'd',
      `M0 0 a${r},${r} 1 0,0 ${w * 0.25},${-1 * h * 0.1}
      a${r},${r} 1 0,0 ${w * 0.25},${0}
      a${r},${r} 1 0,0 ${w * 0.25},${0}
      a${r},${r} 1 0,0 ${w * 0.25},${1 * h * 0.1}

      a${r},${r} 1 0,0 ${w * 0.15},${1 * h * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 ${0},${1 * h * 0.34}
      a${r},${r} 1 0,0 ${-1 * w * 0.15},${1 * h * 0.33}

      a${r},${r} 1 0,0 ${-1 * w * 0.25},${h * 0.15}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${0}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${0}
      a${r},${r} 1 0,0 ${-1 * w * 0.25},${-1 * h * 0.15}

      a${r},${r} 1 0,0 ${-1 * w * 0.1},${-1 * h * 0.33}
      a${r * 0.8},${r * 0.8} 1 0,0 ${0},${-1 * h * 0.34}
      a${r},${r} 1 0,0 ${w * 0.1},${-1 * h * 0.33}

    H0 V0 Z`
    );
};
const circleBkg = function (elem, node, section, conf) {
  const r = elem
    .append('circle')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr('r', node.width / 2);
  // .attr('width', node.width);
};
const roundedRectBkg = function (elem, node, section, conf) {
  const r = elem
    .append('rect')
    .attr('id', 'node-' + node.id)
    .attr('class', 'node-bkg node-' + db.type2Str(node.type))
    .attr('height', node.height)
    .attr('rx', node.padding)
    .attr('ry', node.padding)
    .attr('width', node.width);
};

/**
 * @param {object} elem The D3 dom element in which the node is to be added
 * @param {object} node The node to be added
 * @param section
 * @param {object} conf The configuration object
 * @returns {number} The height nodes dom element
 */
export const drawNode = function (elem, node, section, conf) {
  const nodeElem = elem.append('g');
  nodeElem.attr(
    'class',
    (node.class ? node.class + ' ' : '') +
      'mindmap-node ' +
      (section === -1 ? 'section-root' : 'section-' + section)
  );
  const bkgElem = nodeElem.append('g');

  // Create the wrapped text element
  const textElem = nodeElem.append('g');
  const txt = textElem
    .append('text')
    .text(node.descr)
    .attr('dy', '1em')
    // .attr('dy', '0')
    .attr('alignment-baseline', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .call(wrap, node.width);
  const bbox = txt.node().getBBox();
  const fontSize = conf.fontSize.replace ? conf.fontSize.replace('px', '') : conf.fontSize;
  node.height = bbox.height + fontSize * 1.1 * 0.5 + node.padding;
  node.width = bbox.width + 2 * node.padding;
  if (node.icon) {
    if (node.type === db.nodeType.CIRCLE) {
      node.height += 50;
      const orgWidth = node.width;
      node.width += 50;
      // node.width = Math.max(orgWidth, 100);
      const widthDiff = Math.abs(node.width - orgWidth);
      const icon = nodeElem
        .append('foreignObject')
        .attr('height', '50px')
        .attr('width', node.width)
        .attr('style', 'text-align: center;');
      // .attr('x', 0)
      // .attr('y', 0)
      // .attr('class', 'node-icon ' + node.icon);
      icon
        .append('div')
        .attr('class', 'icon-container')
        .append('i')
        .attr('class', 'node-icon-' + section + ' ' + node.icon);
      textElem.attr(
        'transform',
        'translate(' + node.width / 2 + ', ' + (node.height / 2 - 1.5 * node.padding) + ')'
      );
    } else {
      node.width += 50;
      const orgHeight = node.height;
      node.height = Math.max(orgHeight, 60);
      const heightDiff = Math.abs(node.height - orgHeight);
      const icon = nodeElem
        .append('foreignObject')
        .attr('width', '60px')
        .attr('height', node.height)
        .attr('style', 'text-align: center;margin-top:' + heightDiff / 2 + 'px;');
      // .attr('x', 0)
      // .attr('y', 0)
      // .attr('class', 'node-icon ' + node.icon);
      icon
        .append('div')
        .attr('class', 'icon-container')
        .append('i')
        .attr('class', 'node-icon-' + section + ' ' + node.icon);
      textElem.attr(
        'transform',
        'translate(' + (25 + node.width / 2) + ', ' + (heightDiff / 2 + node.padding / 2) + ')'
      );
    }
  } else {
    textElem.attr('transform', 'translate(' + node.width / 2 + ', ' + node.padding / 2 + ')');
  }

  switch (node.type) {
    case db.nodeType.DEFAULT:
      defaultBkg(bkgElem, node, section, conf);
      break;
    case db.nodeType.ROUNDED_RECT:
      roundedRectBkg(bkgElem, node, section, conf);
      break;
    case db.nodeType.RECT:
      rectBkg(bkgElem, node, section, conf);
      break;
    case db.nodeType.CIRCLE:
      bkgElem.attr('transform', 'translate(' + node.width / 2 + ', ' + +node.height / 2 + ')');
      circleBkg(bkgElem, node, section, conf);
      break;
    case db.nodeType.CLOUD:
      // bkgElem.attr('transform', 'translate(' + node.width / 2 + ', ' + +node.height / 2 + ')');
      cloudBkg(bkgElem, node, section, conf);
      break;
    case db.nodeType.BANG:
      // bkgElem.attr('transform', 'translate(' + node.width / 2 + ', ' + +node.height / 2 + ')');
      bangBkg(bkgElem, node, section, conf);
      break;
    default:
    // defaultBkg(bkgElem, node, section, conf);
  }

  // Position the node to its coordinate
  if (typeof node.x !== 'undefined' && typeof node.y !== 'undefined') {
    nodeElem.attr('transform', 'translate(' + node.x + ',' + node.y + ')');
  }
  db.setElementForId(node.id, nodeElem);
  return node.height;
};

export const drawEdge = function drawEdge(edgesElem, mindmap, parent, depth, section, conf) {
  // edgesElem
  //   .append('line')
  //   .attr('x1', parent.x + parent.width / 2)
  //   .attr('y1', parent.y + parent.height / 2)
  //   .attr('x2', mindmap.x + mindmap.width / 2)
  //   .attr('y2', mindmap.y + mindmap.height / 2)
  //   .attr('class', 'edge section-edge-' + section + ' edge-depth-' + depth);

  //<path d="M100,250 Q250,100 400,250 T700,250" />

  const sx = parent.x + parent.width / 2;
  const sy = parent.y + parent.height / 2;
  const ex = mindmap.x + mindmap.width / 2;
  const ey = mindmap.y + mindmap.height / 2;
  const mx = ex > sx ? sx + Math.abs(sx - ex) / 2 : sx - Math.abs(sx - ex) / 2;
  const my = ey > sy ? sy + Math.abs(sy - ey) / 2 : sy - Math.abs(sy - ey) / 2;
  const qx = ex > sx ? Math.abs(sx - mx) / 2 + sx : -Math.abs(sx - mx) / 2 + sx;
  const qy = ey > sy ? Math.abs(sy - my) / 2 + sy : -Math.abs(sy - my) / 2 + sy;

  edgesElem
    .append('path')
    .attr(
      'd',
      parent.direction === 'TB' || parent.direction === 'BT'
        ? `M${sx},${sy} Q${sx},${qy} ${mx},${my} T${ex},${ey}`
        : `M${sx},${sy} Q${qx},${sy} ${mx},${my} T${ex},${ey}`
    )
    .attr('class', 'edge section-edge-' + section + ' edge-depth-' + depth);
};

export const positionNode = function (node, conf) {
  const nodeElem = db.getElementById(node.id);

  const x = node.x || 0;
  const y = node.y || 0;
  // Position the node to its coordinate
  nodeElem.attr('transform', 'translate(' + x + ',' + y + ')');
};

export default { drawNode, positionNode, drawEdge };
