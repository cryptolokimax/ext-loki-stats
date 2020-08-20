import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral'
import { ResponsiveBar } from '@nivo/bar'
import _ from 'lodash'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner'

export default class NodesDistributionAsn extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        apiData: PropTypes.array,
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

        let graphData = []
        if (apiData && !apiError) {
            apiData.forEach(node => {
                if (!graphData[node.location.asn]) graphData[node.location.asn] = 1
                else graphData[node.location.asn]++
            })
            const numOfEls = apiData.length
            const graphDataObject = Object.keys(graphData).map(index => {
                return {
                    asn: index,
                    numOfNodes: graphData[index],
                    percentage: (graphData[index] / numOfEls) * 100,
                }
            })
            graphData = _.orderBy(graphDataObject, ['numOfNodes'], ['asc'])
        }

        const body =
            apiData && !apiError ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ResponsiveBar
                        colors="accent"
                        theme={graphTheme(this.props)}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 80,
                            left: 250,
                        }}
                        data={graphData}
                        indexBy="asn"
                        layout="horizontal"
                        keys={['percentage']}
                        axisBottom={{ tickRotation: -75, legend: '% of total' }}
                        // axisLeft={{ legend: "Frequency, %" }}
                        enableLabel={false}
                        // colorBy={tick => (apiData.averageBlockTime >= tick.data.classMin && apiData.averageBlockTime < tick.data.classMax) ? '#ee9a83' : '#e8c1a0' }
                        tooltip={tooltip => (
                            <div>
                                <div>{tooltip.data.asn}</div>
                                <div>
                                    {tooltip.data.numOfNodes} nodes (
                                    {numeral(tooltip.data.percentage).format('0,0.00')}
                                    %)
                                </div>
                            </div>
                        )}
                    />
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
