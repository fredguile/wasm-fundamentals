async function run() {
  const pieceMoved = (fX, fY, tX, tY) =>
    console.log(`Piece moved from (${fX}, ${fY}) to (${tX}, ${tY})`);
  const pieceCrowned = (fX, fY, tX, tY) =>
    console.log(`Piece crowned from (${fX}, ${fY}) to (${tX}, ${tY})`);

  const res = await fetch("./checkers.wasm");
  const buffer = await res.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(buffer, {
    events: {
      pieceMoved,
      pieceCrowned,
    },
  });

  if (!instance) {
    return;
  }

  const {
    exports: { initBoard, getTurnOwner, move },
  } = instance;

  initBoard();

  console.log(`At start, turn owner is ${getTurnOwner()}`);

  move(0, 5, 0, 4); // B
  move(1, 0, 1, 1); // W
  move(0, 4, 0, 3); // B
  move(1, 1, 1, 0); // W
  move(0, 3, 0, 2); // B
  move(1, 0, 1, 1); // W
  move(0, 2, 0, 0); // B - will get a crown
  move(1, 1, 1, 0); // W

  // B - move the crowned piece out
  const ret = move(0, 0, 0, 2);
  document.getElementById("container").innerText = ret;

  console.log(`At end, turn owner is ${getTurnOwner()}`);
}

run();
