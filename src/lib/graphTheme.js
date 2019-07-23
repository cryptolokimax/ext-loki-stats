export default props => {
    const { theme } = props
    const { charts } = theme
    const { axis, grid, tooltip } = charts
    // Use this for theme reference:
    // https://github.com/plouc/nivo/blob/master/packages/core/src/theming/defaultTheme.js
    return {
        axis: {
            ticks: {
                line: {
                    stroke: axis.textColor,
                },
                text: {
                    fill: axis.textColor,
                },
            },
            legend: {
                text: {
                    fill: axis.textColor,
                },
            },
        },
        grid: {
            line: {
                stroke: grid.stroke,
                strokeWidth: 1,
                strokeDasharray: '4 4',
            },
        },
        legends: {
            text: {
                fill: axis.textColor,
            },
        },
        tooltip: {
            container: tooltip && {
                background: tooltip.background,
                color: tooltip.color,
                fontSize: 'inherit',
            },
        },
        markers: {
            lineColor: axis.textColor,
            lineStrokeWidth: 1,
            text: {
                fill: axis.textColor,
            },
            textColor: axis.textColor,
            fontSize: '12px'
        },
        textColor: axis.textColor,
        crosshair: {
            line: {
                stroke: '#ff0000',
                strokeWidth: 1,
                strokeOpacity: 0.35,
            },
        }, 
    }
}
