import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveBar } from '@nivo/bar'
import _ from 'lodash'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class SNStateChanges extends Component {
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
                
        let graphData = [];
        if (apiData && apiData.snStateChanges && !apiError) {
            graphData = [
                {
                    "type": "Recommissions",
                    "numOfNodes": apiData.snStateChanges.total_recommission || 0
                },
                {
                    "type": "Decommissions",
                    "numOfNodes": apiData.snStateChanges.total_decommission || 0
                },
                {
                    "type": "Deregistrations",
                    "numOfNodes": apiData.snStateChanges.total_deregister || 0
                },
                {
                    "type": "IP change penalties",
                    "numOfNodes": apiData.snStateChanges.total_ip_change_penalty || 0
                },
            ]

            
            console.log(graphData);
        }


        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveBar
                colors="accent"
                theme={graphTheme(this.props)}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 80,
                    left: 80
                }}
                data={graphData}
                indexBy="type"
                layout="horizontal"
                keys={[
                'numOfNodes',
                ]}
                axisBottom={{ tickRotation: -75, legend: "Num of Nodes" }}
                // axisLeft={{ legend: "Frequency, %" }}
                enableLabel={false}
                // colorBy={tick => (apiData.averageBlockTime >= tick.data.classMin && apiData.averageBlockTime < tick.data.classMax) ? '#ee9a83' : '#e8c1a0' }
                tooltip={(tooltip) => (<div><div>{tooltip.data.type}</div><div>{tooltip.data.numOfNodes} nodes</div></div>) }
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
