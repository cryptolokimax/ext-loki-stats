import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class HashrateGraph extends Component {
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
                
        const graphData = (apiData && apiData.hashrateHistory && !apiError) ? apiData.hashrateHistory.map(row => ({x: new Date(row[0]).toISOString().slice(0,10), y: row[1]})) : [];

        const body = (apiData && apiData.hashrateHistory && !apiError) ? (
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
                data={[{id: "Hashrate", data: graphData}]}
                animate
                xScale={{type: 'time',format: '%Y-%m-%d', precision: 'day'}}
                yScale={{type: 'linear'}}
                axisBottom={{format: '%d %b \'%y', "legend": "Date", tickRotation: -45}}
                axisLeft={{
                    "legend": "Hashrate, MH/sec",
                }}
                enableDots={false}
                dotBorderWidth={1}
                dotBorderColor="inherit:darker(0.3)"
                curve="natural"
                tooltip={(tooltip) => (<div><div>{tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric' })}</div><div>{numeral(tooltip.data[0].data.y).format('0,0.00')} MH/sec</div></div>) }
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
