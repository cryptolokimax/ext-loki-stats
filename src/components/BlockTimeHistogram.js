import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveBar } from '@nivo/bar'
import computeRequestId from '../lib/computeRequestId'
import innerCss from './css/inner';


export default class BlockTimeHistogram extends Component {
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
                
        const graphData = (apiData && !apiError) ? apiData.blockTimeHistogram.map(
            row => ({
                class: `${numeral(row.classMin).format('0,0')}-${numeral(row.classMax).format('0,0')}s`,
                percent: row.percent,
                classMin: row.classMin,
                classMax: row.classMax
            })) : [];

        const calcRestPerc = (apiData && !apiError) ? 100 -  apiData.blockTimeHistogram.reduce((sum, current) => (sum + current.percent), 0) : 0;

        // last bar
        if (apiData && !apiError) graphData.push({
            class: `> ${apiData.blockTimeHistogram.slice(-1)[0].classMax}s`,
            percent: calcRestPerc,
            classMin: apiData.blockTimeHistogram.slice(-1)[0].classMax,
            classMax: Infinity,
        })

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
                indexBy="class"
                keys={[
                'percent',
                ]}
                axisBottom={{ tickRotation: -75 }}
                axisLeft={{ legend: "Frequency, %" }}
                enableLabel={false}
                colorBy={tick => (apiData.averageBlockTime >= tick.data.classMin && apiData.averageBlockTime < tick.data.classMax) ? '#ee9a83' : '#e8c1a0' }
                tooltip={(tooltip) => (<div><div>{numeral(tooltip.data.percent).format('0,0.00')}%</div><div>{tooltip.data.class}</div></div>) }
            />
            <div className='json-w-wrapper' style={{ position: 'absolute', top: '0px', left: '0px'}}>
                <div className='json-w-center'>
                    <div className='json-w-top-label'>12 hrs. average:</div>
                    <div className='json-w-big-text'>{numeral(apiData.averageBlockTime).format('0,0.00')}s</div>
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
