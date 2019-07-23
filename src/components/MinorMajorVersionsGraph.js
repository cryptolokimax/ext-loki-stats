import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsivePie } from '@nivo/pie'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
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
        
        const majorMinorVersionShare24h = (apiData && !apiError) ?  apiData.majorMinorVersionShare24h : {major: {}, minor: {}};

        const totalBlocks = Object.keys(majorMinorVersionShare24h.major).reduce((sum, key) => (majorMinorVersionShare24h.major[key] + sum), 0);

        const minorShares = Object.keys(majorMinorVersionShare24h.minor).map(key => ({id: `v.${key}`, label: `Version ${key}`, value: parseFloat(majorMinorVersionShare24h.minor[key] / totalBlocks * 100).toFixed(2)}));

        const majorShares = Object.keys(majorMinorVersionShare24h.major).map(key => ({id: `v.${key}`, label: `Version ${key}`, value: parseFloat(majorMinorVersionShare24h.major[key] / totalBlocks * 100).toFixed(2)}));

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <div style={{  width: '50%', height: 'calc(100% - 60px)' }}>
                <span>Minor</span>
                <ResponsivePie
                    colors="accent"
                    theme={graphTheme(this.props)}
                    margin={{
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    }}
                    data={minorShares}
                    innerRadius={0.5}
                    sliceLabel={ v => `${v.value}%` }
                />
            </div>
            <div style={{  width: '50%', height: 'calc(100% - 60px)' }}>
                <span>Major</span>
                <ResponsivePie
                    colors="accent"
                    theme={graphTheme(this.props)}
                    margin={{
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    }}
                    data={majorShares}
                    innerRadius={0.5}
                    sliceLabel={ v => `${v.value}%` }
                />
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
