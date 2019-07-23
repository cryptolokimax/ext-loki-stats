import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class AlternateChainCountGraph extends Component {
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
                
        const graphData = (apiData && !apiError) ? apiData.alternateChainCount.map(row => ({x: new Date(row[0]).toISOString().slice(0,10), y: (row[1])})).filter(n => n.y > 0) : [];

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveLine
                colors="accent"
                theme={graphTheme(this.props)}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 80
                }}
                data={[{id: "Median block size", data: graphData}]}
                animate
                xScale={{type: 'time', format: '%Y-%m-%d', precision: 'hour'}}
                yScale={{type: 'linear', stacked: false, min: 0, max: "auto"}}
                axisBottom={{format: '%d %b', "legend": "Date", tickRotation: -75}}
                axisLeft={{
                    "legend": "Alternate chain blocks num",
                }}
                enableDots={false}
                curve="linear"
                tooltip={(tooltip) => (<div><div>{tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric' })}</div><div>{tooltip.data[0].data.y}</div></div>) }
            />
            <div className='json-w-wrapper' style={{ position: 'absolute', top: '0px', left: '0px'}}>
                <div className='json-w-center'>
                    <div className='json-w-top-label'>24 hrs. count:</div>
                    <div className='json-w-big-text'>{apiData.last24hrsAlternateChain}</div>
                </div>
            </div>
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
