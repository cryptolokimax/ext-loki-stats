import React from 'react'
import moment from 'moment';

const MapMarker = ({ ip, lastProofSecondsAgo, theme }) => {
  const opacity = (0.5 + (0.5 * (1 - lastProofSecondsAgo / 4352922)));
  const wh = 30;
  const timeAgo = moment().subtract(lastProofSecondsAgo, 'seconds').fromNow();
  return (
    <div className="nodes-distribution-marker">
      <img style={{ width: wh, height: wh }} src="data:image/png;base64,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" alt="marker" />
      <div
        className="nodes-distribution-hover"
        style={(theme.tooltip && theme.tooltip.container) ? {
          backgroundColor: theme.tooltip.container.background,
          color: theme.tooltip.container.color
        } : {}}
      >
        {timeAgo}
      </div>
    </div>
  )
}

export default MapMarker
