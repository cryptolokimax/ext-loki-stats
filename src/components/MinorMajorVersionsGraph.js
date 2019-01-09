import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import innerCss from './css/inner';


export default class MinorMajorVersionsGraph extends Component {
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
                
        const graphDataMajor = (apiData && !apiError) ? apiData.versions.major.map(row => ({x: new Date(row[0]).toISOString().slice(0,10), y: row[1]})) : [];
        const graphDataMinor = (apiData && !apiError) ? apiData.versions.minor.map(row => ({x: new Date(row[0]).toISOString().slice(0,10), y: row[1]})) : [];

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveLine
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 80
                }}
                data={[{id: "Major", data: graphDataMajor}, {id: "Minor", data: graphDataMinor}]}
                animate
                xScale={{type: 'time',format: '%Y-%m-%d' }}
                yScale={{type: 'linear', min: 'auto', max: 'auto'}}
                axisBottom={{format: '%d %b \'%y', "legend": "Date", tickRotation: -75}}
                axisLeft={{
                    "legend": "Version number",
                }}
                enableDots={false}
                
                dotBorderWidth={1}
                dotBorderColor="inherit:darker(0.3)"
                curve="linear"
                tooltip={(tooltip) => (<div>
                        <div>{tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric' })}</div><div>Major Version: {numeral(tooltip.data[0].data.y).format('0,0.00')}</div>
                        <div>Minor Version: {numeral(tooltip.data[1].data.y).format('0,0.00')}</div>
                    </div>) }
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
