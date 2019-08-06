import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import _ from 'lodash'
import { ResponsiveLine } from '@nivo/line'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class MiningPools extends Component {
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
                
        const graphData = (apiData && apiData.miningPoolStats && !apiError) ? 
            apiData.miningPoolStats.map(pool => (
                {id: pool.id, data: pool.data.map(d => ({x: new Date(d.time), hashrate: d.hashrate, miners: parseFloat(d.miners).toFixed(0), y: d.percent ? parseFloat(d.percent).toFixed(2) : 0 }))})
            )
        : [];
        
        const theme = graphTheme(this.props);
        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <ResponsiveLine
                colors="accent"
                theme={theme}
                margin={{
                    top: 20,
                    right: 120,
                    bottom: 60,
                    left: 80
                }}
                data={graphData}
                animate
                xScale={{type: 'time' }}
                yScale={{
                    type: 'linear',
                    "min": "auto",
                    "max": "auto"
                }}
                axisBottom={{format: '%d %b', "legend": ""}}
                axisLeft={{
                    "legend": "Hashrate share, %",
                }}
                enableArea={true}
                enableDots={false}
                dotBorderWidth={1}
                dotBorderColor="inherit:darker(0.3)"
                curve="linear"
                markers={[ {
                    axis: "y",
                    lineStyle: {
                        stroke: "#b0413e",
                        strokeWidth: 1
                    },
                    value: 50
                }]}
                legends={[
                    {
                        "anchor": "bottom-right",
                        "direction": "column",
                        "justify": false,
                        "translateX": 95,
                        "translateY": 0,
                        "itemsSpacing": 0,
                        "itemDirection": "left-to-right",
                        "itemWidth": 80,
                        "itemHeight": 14,
                        "itemOpacity": 0.75,
                        "symbolSize": 12,
                        "symbolShape": "circle",
                        "symbolBorderColor": "rgba(0, 0, 0, .5)",
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemBackground": "rgba(0, 0, 0, .03)",
                                    "itemOpacity": 1
                                }
                            }
                        ],
                        itemTextColor: theme.legends.text.fill,
                    }
                ]}
                tooltip={(tooltip) => (
                    <div>
                    {tooltip.data[0].data.x.toLocaleDateString("en-US", {  year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}
                     {tooltip.data.map(el => {
                            return (<div key={el.serie.color} style={{display: 'flex', alignItems: 'center', fontSize: '12px'}}>
                                <div style={{width: 12, height: 12, backgroundColor: el.serie.color, marginRight: 10}}/> 
                                <div>
                                    {el.data.y}% – {el.serie.id}&nbsp;({el.data.miners} miners)&nbsp;-&nbsp;
                                    {numeral(el.data.hashrate / 1000000).format('0,0.00')} MH/sec
                                 </div>
                            </div>
                            )
                        })
                    }
                    </div>
                )}
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
