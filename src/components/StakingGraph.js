import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'

const heights = [
    385824,
    429024,
    472224,
    515424,
    558624,
    601824,
    645024,
    688224,
    731424,
    774624,
    817824,
    861024,
    1000000,
]
const lsrloki = [
    20458.380815527,
    19332.319724305,
    18438.564443912,
    17729.190407764,
    17166.159862153,
    16719.282221956,
    16364.595203882,
    16083.079931076,
    15859.641110978,
    15682.297601941,
    15541.539965538,
    15429.820555489,
    15000,
]

export default class StakingGraph extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        apiData: PropTypes.object,
        apiError: PropTypes.object,
    }

    static getApiRequest({ url, headers = {} }) {
        return {
            id: computeRequestId(url, headers),
            params: { url, headers },
        }
    }

    render() {
        const { title, url, apiData, apiError } = this.props

        const calcRequiredForStake = h => {
            if (h >= 641111) {
                return Number(15000 + h / 1000000000)
            }
            if (h >= 385824) {
                if (h >= heights[heights.length - 1]) {
                    return Number(lsrloki[lsrloki.length - 1])
                }
                for (let i = 1; i < heights.length; i += 1) {
                    if (heights[i] > h) {
                        return Number(
                            lsrloki[i - 1] +
                                (h - heights[i - 1]) *
                                    ((lsrloki[i] - lsrloki[i - 1]) / (heights[i] - heights[i - 1]))
                        )
                    }
                }
            } else if (h >= 234767) {
                return Number(15000 + 25007 * 2 ** ((101250 - h) / 129600))
            } else {
                return Number(10000 + 35000 * 2 ** ((101250 - h) / 129600.0))
            }
        }

        const blocksPerYear = 263004
        const blocksPerDay = Math.round(blocksPerYear / 365)
        const periodToCalcDays = 365 * 3
        const periodToCalcBlocks = periodToCalcDays * blocksPerDay
        const startHeight = 101250
        const stepsToSkipOnGraphPerBlock = 10 // the bigger the less accurate, the smaller the most cpu

        const numberWithThousands = x => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }

        const graphData = _.range(
            startHeight,
            startHeight + periodToCalcBlocks,
            blocksPerDay * stepsToSkipOnGraphPerBlock
        ).map(curHeight => {
            // const curHeight = startHeight + ri;
            const curBlockReward = calcRequiredForStake(curHeight)
            return {
                x: curHeight,
                y: curBlockReward,
            }
        })

        console.log(graphData)

        const theme = graphTheme(this.props)

        const body =
            apiData && apiData.height && !apiError ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ResponsiveLine
                        colors="accent"
                        theme={theme}
                        data={[
                            {
                                id: 'requirement',
                                color: 'hsl(176, 70%, 50%)',
                                data: graphData,
                            },
                        ]}
                        margin={{
                            top: 50,
                            right: 110,
                            bottom: 50,
                            left: 60,
                        }}
                        xScale={{
                            type: 'linear',
                            stacked: true,
                            min: 'auto',
                            max: 'auto',
                        }}
                        yScale={{
                            type: 'linear',
                            stacked: true,
                            min: 'auto',
                            max: 'auto',
                        }}
                        minY="auto"
                        maxY="auto"
                        stacked={true}
                        curve="natural"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Block height',
                            legendOffset: 36,
                            legendPosition: 'middle',
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Staking Requirement',
                            legendOffset: 0,
                        }}
                        enableDots={false}
                        enableDotLabel={true}
                        dotLabel="y"
                        dotLabelYOffset={-12}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        markers={[
                            {
                                axis: 'x',
                                lineStyle: {
                                    stroke: '#b0413e',
                                    strokeWidth: 2,
                                },
                                legend: `← height: ${numberWithThousands(apiData.height)}`,

                                textStyle: {
                                    fill: theme.legends.text.fill,
                                },
                                value: apiData.height,
                            },
                        ]}
                        //
                        tooltip={tooltip => (
                            <div>
                                <div>Height: {numberWithThousands(tooltip.data[0].data.x)}</div>
                                <div>
                                    Date:{' '}
                                    {moment('2018-05-03')
                                        .add(tooltip.data[0].data.x * 120, 's')
                                        .format('MMMM Do YYYY')}
                                </div>
                                <div>
                                    Staking requirement:{' '}
                                    {numberWithThousands(
                                        parseFloat(tooltip.data[0].data.y).toFixed(2)
                                    )}
                                </div>
                            </div>
                        )}
                        isInteractive={true}
                    />
                    <div
                        className="json-w-wrapper"
                        style={{ position: 'absolute', top: '0px', left: '0px' }}
                    >
                        <div className="json-w-center">
                            <div className="json-w-big-text">
                                {numberWithThousands(
                                    _.round(calcRequiredForStake(apiData.height), 2)
                                )}
                            </div>
                            <div
                                className="json-w-right-text"
                                style={{ fontSize: '3vmin', paddingTop: '0.5vmin' }}
                            >
                                {' '}
                                LOKI{' '}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <WidgetLoader />
            )

        return (
            <Widget>
                <WidgetHeader title={title || url} />
                <WidgetBody>
                    <TrapApiError error={apiError}>{body}</TrapApiError>
                </WidgetBody>
            </Widget>
        )
    }
}
