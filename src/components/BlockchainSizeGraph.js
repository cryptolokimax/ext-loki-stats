import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class BlockchainSizeGraph extends Component {
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
                
        const graphData = (apiData && !apiError) ? apiData.blockchainSizeHistory.map(row => ({x: new Date(row[0]).toISOString().slice(0,10), y: (row[1] / (1000000000))})).filter(n => n.y > 0) : [];

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
                xScale={{type: 'time', format: '%Y-%m-%d', precision: 'day'}}
                yScale={{type: 'linear', stacked: false, min: "auto", max: "auto"}}
                axisBottom={{format: '%d %b', "legend": "Date", tickRotation: -25}}
                axisLeft={{
                    "legend": "Blockchain size, Gb",
                }}
                enableDots={false}
                curve="basis"
                tooltip={(tooltip) => (<div><div>{tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric' })}</div><div>{numeral(tooltip.data[0].data.y).format('0,0.000')} GB</div></div>) }
            />
            <div className='json-w-wrapper' style={{ position: 'absolute', top: '0px', left: '0px'}}>
                <div className='json-w-center'>
                    <div className='json-w-big-text'>{numeral(graphData.slice(-1)[0].y).format('0,0.000')} GB</div>
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
