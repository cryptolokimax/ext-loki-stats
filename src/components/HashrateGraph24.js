import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import innerCss from './css/inner';


export default class HashrateGraph24 extends Component {
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
            
        const graphData = (apiData && !apiError) ? apiData.hashrate24h.map(row => ({x: new Date(row[0]), y: row[1]})).filter(row => row.y !== 0) : [];

        const avgHashrate = graphData.reduce((r, hashrate) => {
                r.sum += +hashrate.y;
                r.avg = r.sum / ++r.count;
            return r;
        }, { sum: 0, count: 0, avg: 0 }).avg;

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveLine
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 80
                }}
                data={[{id: "Hashrate", data: graphData}]}
                animate
                xScale={{type: 'time', precision: 'minute'}}
                yScale={{type: 'linear'}}
                axisBottom={{format: '%H:%M', "legend": "Time"}}
                axisLeft={{
                    "legend": "Hashrate, MH/sec",
                }}
                enableDots={false}
                dotBorderWidth={1}
                dotBorderColor="inherit:darker(0.3)"
                curve="linear"
                tooltip={(tooltip) => (<div><div>{tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}</div><div>{numeral(tooltip.data[0].data.y).format('0,0.00')} MH/sec</div></div>) }
            />
            <div className='json-w-wrapper' style={{ position: 'absolute', top: '0px', left: '0px'}}>
                <div className='json-w-center'>
                    <div className='json-w-top-label'>24 hrs. average:</div>
                    <div className='json-w-big-text'>{numeral(avgHashrate).format('0,0.00')} MH/sec</div>
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
