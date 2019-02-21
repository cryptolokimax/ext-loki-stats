import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveBar } from '@nivo/bar'
import _ from 'lodash'
import computeRequestId from '../lib/computeRequestId'
import innerCss from './css/inner';


export default class NodesDistributionCountries extends Component {
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
                
        let graphData = [];
        if (apiData && !apiError) {
            apiData.forEach(node => {
                if (!graphData[node.location.country]) graphData[node.location.country] = 1;
                else graphData[node.location.country]++;
            })
            const numOfEls = apiData.length;
            const graphDataObject = Object.keys(graphData).map((index) => {
                return {country: index, numOfNodes: graphData[index], percentage: (graphData[index]/numOfEls * 100)};
            })
            graphData = _.orderBy(graphDataObject, ['numOfNodes'], ['asc']);
        }


        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveBar
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 80,
                    left: 80
                }}
                data={graphData}
                indexBy="country"
                layout="horizontal"
                keys={[
                'percentage',
                ]}
                axisBottom={{ tickRotation: -75, legend: "% of total" }}
                // axisLeft={{ legend: "Frequency, %" }}
                enableLabel={false}
                // colorBy={tick => (apiData.averageBlockTime >= tick.data.classMin && apiData.averageBlockTime < tick.data.classMax) ? '#ee9a83' : '#e8c1a0' }
                tooltip={(tooltip) => (<div><div>{tooltip.data.country}</div><div>{tooltip.data.numOfNodes} nodes ({numeral(tooltip.data.percentage).format('0,0.00')}%)</div></div>) }
            />
        </div>) : (<WidgetLoader />);
        
        return (
            <Widget>
                <WidgetHeader title={title || url} />
                <WidgetBody>
                    <style dangerouslySetInnerHTML={{__html: innerCss }} />
                    <TrapApiError error={apiError}>{body}</TrapApiError>
                </WidgetBody>
            </Widget>
        )
    }
}
