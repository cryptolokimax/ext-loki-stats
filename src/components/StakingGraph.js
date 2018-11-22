import React, { Component } from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
 

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

        const calcRequiredForStake = h => Number(
            Math.max(10000 + 35000*Math.pow(2, ((101250-h)/129600.)), Math.min(5*h/2592 + 8000, 15000))
          );
        const blocksPerYear = 263004;
        const blocksPerDay = Math.round(blocksPerYear / 365);
        const periodToCalcDays = 365*3;
        const periodToCalcBlocks = periodToCalcDays * blocksPerDay;
        const startHeight = 101250;
        const stepsToSkipOnGraphPerBlock = 100; // the bigger the less accurate, the smaller the most cpu
        
        const numberWithThousands = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const graphData = _.range(startHeight, startHeight + periodToCalcBlocks, blocksPerDay * stepsToSkipOnGraphPerBlock).map((curHeight) => {
            // const curHeight = startHeight + ri;
            const curBlockReward = calcRequiredForStake(curHeight);
            return {
                x: curHeight,
                y: curBlockReward
            };
        });
        
        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveLine
                data={[
                    {
                    "id": "requirement",
                    "color": "hsl(176, 70%, 50%)",
                    "data": graphData
                    }
                ]}
                margin={{
                    "top": 50,
                    "right": 110,
                    "bottom": 50,
                    "left": 60
                }}
                xScale={{
                    "type": "linear",
                    "stacked": true,
                    "min": "auto",
                    "max": "auto"
                }}
                yScale={{
                    "type": "linear",
                    "stacked": true,
                    "min": "auto",
                    "max": "auto"
                }}
                minY="auto"
                maxY="auto"
                stacked={true}
                curve="natural"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Block height",
                    "legendOffset": 36,
                    "legendPosition": "middle"
                }}
                axisLeft={{
                    "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Staking Requirement",
                    "legendOffset": 0,
                }}
                enableDots={false}
                enableDotLabel={true}
                dotLabel="y"
                dotLabelYOffset={-12}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                markers={[ {
                    axis: "x",
                    lineStyle: {
                        stroke: "#b0413e",
                        strokeWidth: 2
                    },
                    legend: "← current requirement",
                    value: apiData.height
                }]
                }
                isInteractive={true}
            />
            <div className='json-w-wrapper' style={{ position: 'absolute', top: '0px', left: '0px'}}>
                <div className='json-w-center'>
                    <div className='json-w-big-text'>{numberWithThousands(_.round(calcRequiredForStake(apiData.height), 2))}</div>
                    <div className='json-w-right-text' style={{ fontSize: '3vmin' , paddingTop: '0.5vmin'}}> LOKI </div>
                </div>
            </div>
        </div>) : (<WidgetLoader />);
        
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
