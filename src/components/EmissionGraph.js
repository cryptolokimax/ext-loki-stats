import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral'
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner'

export default class EmissionGraph extends Component {
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
        const { title, url, param, apiData, apiError } = this.props

        const emissionData = apiData && apiData.emissionStats

        const premine = 22500000

        const graphData =
            emissionData && emissionData[param] && !apiError
                ? emissionData[param].slice(1).map(row => ({
                      x: new Date(row[0]),
                      y: param == 'emissionCumulative' ? row[1] + premine : row[1],
                  }))
                : []

        const body =
            apiData && apiData.serviceNodeCountHistory && !apiError ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ResponsiveLine
                        colors="accent"
                        theme={graphTheme(this.props)}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 60,
                            left: 80,
                        }}
                        data={[{ id: 'Num of Service Nodes', data: graphData }]}
                        animate
                        xScale={{ type: 'time', precision: 'hour' }}
                        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
                        axisBottom={{ format: "%d %b '%y", legend: 'Date', tickRotation: -75 }}
                        axisLeft={{
                            legend: 'OXEN',
                        }}
                        enableDots={false}
                        dotBorderWidth={1}
                        dotBorderColor="inherit:darker(0.3)"
                        curve="linear"
                        tooltip={tooltip => (
                            <div>
                                <div>
                                    {tooltip.data[0].data.x.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                                <div>{numeral(tooltip.data[0].data.y).format('0,0')} OXEN</div>
                            </div>
                        )}
                    />
                    {(param === 'emissionCumulative' ||
                        param === 'feeCumulative' ||
                        param === 'burnCumulative') && (
                        <div
                            className="json-w-wrapper"
                            style={{ position: 'absolute', top: '0px', left: '0px' }}
                        >
                            <div className="json-w-center">
                                <div className="json-w-top-label">Current:</div>
                                <div className="json-w-big-text">
                                    {numeral(graphData.slice(-1)[0].y).format('0,0')}
                                </div>
                                <div
                                    className="json-w-right-text"
                                    style={{ fontSize: '3vmin', paddingTop: '0.5vmin' }}
                                >
                                    {' '}
                                    OXEN{' '}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <WidgetLoader />
            )

        return (
            <Widget>
                <WidgetHeader title={title || url} />
                <WidgetBody>
                    <style dangerouslySetInnerHTML={{ __html: innerCss }} />
                    <TrapApiError error={apiError}>{body}</TrapApiError>
                </WidgetBody>
            </Widget>
        )
    }
}
