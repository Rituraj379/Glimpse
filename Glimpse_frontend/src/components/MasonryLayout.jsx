import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import Pin from './Pin';

const COLUMN_WIDTH = 270; // width of each column (including gutter)
const ROW_HEIGHT = 400; // height of each row (including gutter)
const GUTTER_SIZE = 16;
const COLUMN_COUNT = 4; // adjust as needed or make responsive

function MasonryLayout({ pins }) {
  console.log('MasonryLayout render, pins:', pins);
  if (!Array.isArray(pins) || pins.length === 0) {
    console.log('MasonryLayout: No Pins Found!');
    return <div className="text-center font-bold text-xl mt-2">No Pins Found!</div>;
  }
  const columnCount = COLUMN_COUNT;
  const rowCount = Math.ceil(pins.length / columnCount);

  // Cell renderer for react-window grid
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const pinIndex = rowIndex * columnCount + columnIndex;
    if (pinIndex >= pins.length) return null;
    const pin = pins[pinIndex];
    console.log('MasonryLayout Cell render, pin:', pin);
    return (
      <div style={{ ...style, left: style.left + GUTTER_SIZE, top: style.top + GUTTER_SIZE, width: style.width - GUTTER_SIZE, height: style.height - GUTTER_SIZE }}>
        <Pin key={pin._id} pin={pin} className="w-max" />
      </div>
    );
  };

  return (
    <div style={{ width: columnCount * COLUMN_WIDTH + GUTTER_SIZE, height: 800, margin: '0 auto' }}>
      <Grid
        columnCount={columnCount}
        columnWidth={COLUMN_WIDTH}
        height={800}
        rowCount={rowCount}
        rowHeight={ROW_HEIGHT}
        width={columnCount * COLUMN_WIDTH + GUTTER_SIZE}
      >
        {Cell}
      </Grid>
    </div>
  );
}

export default MasonryLayout;