import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import numeral from 'numeral';
import { ResponsivePie } from '@nivo/pie'
import computeRequestId from '../lib/computeRequestId'
import graphTheme from '../lib/graphTheme'
import innerCss from './css/inner';


export default class SnVersionGraph extends Component {
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
        
        const versions = (apiData && !apiError) ?  apiData.versions : [];

        const versionData = versions.map(v => ({id: v.version, label: v.version, num: v.num, value: parseFloat(v.percentage).toFixed(2)}))

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
 
                <ResponsivePie
                    colors="accent"
                    theme={graphTheme(this.props)}
                    margin={{
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20,
                    }}
                    data={versionData}
                    innerRadius={0.5}
                    sliceLabel={ v => `${v.value}%` }
                    tooltip={(v) => <div>Version {v.label}: {v.num} nodes ({v.value}%)</div>}

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
