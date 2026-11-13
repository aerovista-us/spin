/* Slot math engine — pure logic, no DOM. Works in the browser (window.SlotEngine) and in Node (module.exports). */
(function (root) {
  'use strict';
  var REELS = 6, ROWS = 4;

  // 20 paylines across the 6 reels (row index per reel, 0 = top)
  var LINES = [
    [1,1,1,1,1,1],[2,2,2,2,2,2],[0,0,0,0,0,0],[3,3,3,3,3,3],
    [0,1,2,2,1,0],[3,2,1,1,2,3],[1,0,0,0,0,1],[2,3,3,3,3,2],
    [1,2,3,3,2,1],[2,1,0,0,1,2],[0,1,0,1,0,1],[3,2,3,2,3,2],
    [1,2,1,2,1,2],[2,1,2,1,2,1],[0,0,1,1,0,0],[3,3,2,2,3,3],
    [1,1,0,0,1,1],[2,2,3,3,2,2],[0,1,1,1,1,0],[3,2,2,2,2,3]
  ];

  var BET_LEVELS = [0.20, 0.40, 0.60, 1.00, 2.00, 4.00, 10.00, 20.00];

  function weightedPick(list, rnd) {
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += list[i].w;
    var r = rnd() * total;
    for (i = 0; i < list.length; i++) { r -= list[i].w; if (r < 0) return list[i]; }
    return list[list.length - 1];
  }

  function symbolTable(game) {
    return game.symbols.map(function (s) { return { w: s.weight, s: s }; });
  }

  function findType(game, type) {
    for (var i = 0; i < game.symbols.length; i++) if (game.symbols[i].type === type) return game.symbols[i];
    return null;
  }

  /** Random symbol cell (used for filler strips too). */
  function randomCell(game, rnd, noScatter) {
    rnd = rnd || Math.random;
    var table = game._table || (game._table = symbolTable(game));
    var s;
    do { s = weightedPick(table, rnd).s; } while (noScatter && s.type === 'scatter');
    var cell = { id: s.id, mult: 1 };
    if (s.type === 'wild' && game.wildMultipliers) cell.mult = weightedPick(game.wildMultipliers, rnd).m;
    return cell;
  }

  /** grid[reel][row] = {id, mult} ; max one scatter per reel. */
  function spinGrid(game, rnd) {
    rnd = rnd || Math.random;
    var grid = [];
    for (var r = 0; r < REELS; r++) {
      var col = [], hasScatter = false;
      for (var y = 0; y < ROWS; y++) {
        var c = randomCell(game, rnd, hasScatter);
        if (game._byId[c.id].type === 'scatter') hasScatter = true;
        col.push(c);
      }
      grid.push(col);
    }
    return grid;
  }

  function prepare(game) {
    game._byId = {};
    game.symbols.forEach(function (s) { game._byId[s.id] = s; });
    game._table = symbolTable(game);
    game._wild = findType(game, 'wild');
    game._scatter = findType(game, 'scatter');
    return game;
  }

  function round2(v) { return Math.round(v * 100) / 100; }

  /**
   * Evaluate a grid. Line pays are multiples of the line bet (totalBet / 20),
   * left-to-right from reel 1, 3+ in a row. Wilds substitute for everything except
   * scatters; a line win is multiplied by the biggest wild multiplier on it.
   * Scatter pays are multiples of total bet and trigger the bonus.
   */
  function evaluate(game, grid, totalBet) {
    var lineBet = totalBet / LINES.length;
    var wildId = game._wild ? game._wild.id : null;
    var res = { lineWins: [], scatter: null, jackpot: null, lineTotal: 0, maxWildMult: 1 };

    for (var li = 0; li < LINES.length; li++) {
      var line = LINES[li];
      var target = null, count = 0, mult = 1, allWild = true;
      for (var r = 0; r < REELS; r++) {
        var cell = grid[r][line[r]];
        var sym = game._byId[cell.id];
        if (sym.type === 'scatter') break;
        if (cell.id === wildId) { count++; if (cell.mult > mult) mult = cell.mult; continue; }
        if (target === null) { target = cell.id; allWild = false; count++; continue; }
        if (cell.id === target) { count++; continue; }
        break;
      }
      // Best of: pure-wild prefix pay vs. substituted pay
      var wildCount = 0, wildMult = 1;
      for (r = 0; r < REELS; r++) {
        var c2 = grid[r][line[r]];
        if (c2.id !== wildId) break;
        wildCount++; if (c2.mult > wildMult) wildMult = c2.mult;
      }
      var best = null;
      if (target !== null && count >= 3) {
        var p = game._byId[target].pays[count] || 0;
        if (p) best = { symId: target, count: count, mult: mult, amount: p * lineBet * mult };
      }
      if (wildId && wildCount >= 3) {
        var pw = game._wild.pays[wildCount] || 0;
        var amtW = pw * lineBet * wildMult;
        if (pw && (!best || amtW > best.amount)) best = { symId: wildId, count: wildCount, mult: wildMult, amount: amtW };
      }
      if (wildCount === REELS) res.jackpot = 'grand';
      if (best) {
        best.line = li;
        best.amount = round2(best.amount);
        best.cells = [];
        for (r = 0; r < best.count; r++) best.cells.push([r, line[r]]);
        res.lineWins.push(best);
        res.lineTotal += best.amount;
        if (best.mult > res.maxWildMult) res.maxWildMult = best.mult;
      }
    }

    if (game._scatter) {
      var cells = [];
      for (var rr = 0; rr < REELS; rr++) for (var y = 0; y < ROWS; y++)
        if (grid[rr][y].id === game._scatter.id) cells.push([rr, y]);
      if (cells.length >= 3) {
        var sp = game.scatterPays[Math.min(cells.length, 6)] || 0;
        res.scatter = { count: cells.length, cells: cells, base: round2(sp * totalBet) };
        if (cells.length >= 6) res.jackpot = res.jackpot || 'major';
      }
    }
    res.lineTotal = round2(res.lineTotal);
    return res;
  }

  function pickBonusMultiplier(game, rnd) { return weightedPick(game.bonusMultipliers, rnd || Math.random).m; }

  /** Monte-Carlo return-to-player estimate (excluding progressive jackpots). */
  function simulate(game, spins, rnd) {
    prepare(game);
    rnd = rnd || Math.random;
    var bet = 1, out = 0, hits = 0, bonus = 0, grand = 0, major = 0;
    for (var i = 0; i < spins; i++) {
      var g = spinGrid(game, rnd), e = evaluate(game, g, bet), w = e.lineTotal;
      if (e.scatter) { bonus++; w += e.scatter.base * pickBonusMultiplier(game, rnd); }
      if (e.jackpot === 'grand') grand++;
      if (e.jackpot === 'major') major++;
      if (w > 0) hits++;
      out += w;
    }
    return { rtp: out / spins, hitRate: hits / spins, bonusRate: bonus / spins, grand: grand, major: major };
  }

  var api = { REELS: REELS, ROWS: ROWS, LINES: LINES, BET_LEVELS: BET_LEVELS, prepare: prepare,
    spinGrid: spinGrid, randomCell: randomCell, evaluate: evaluate, pickBonusMultiplier: pickBonusMultiplier,
    simulate: simulate, round2: round2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SlotEngine = api;
})(this);
