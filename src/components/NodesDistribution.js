import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import Map from 'pigeon-maps'
import MapMarker from './MapMarker'
import computeRequestId from '../lib/computeRequestId'
import innerCss from './css/nodes-distribution';

const Marker = ({ left, top, style, children }) => (
    <div style={{
      position: 'absolute',
      left: left - 15,
      top: top - 30,
      width: 30,
      height: 30,
      ...(style || {})
    }}>{children}</div>
  )

export default class NodesDistribution extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        apiData: PropTypes.array,
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
                

        const body = (apiData && !apiError) ? (
        <div style={{ position: 'relative', width: '100%', height: '100%'}}>
            <Map defaultCenter={[20.674, 12.403]} defaultZoom={2.3}>
                {
                    apiData.map((node, index) => (
                    <Marker key={index} anchor={[node.location.latitude, node.location.longitude]}>
                        <MapMarker ip={node.ip} lastProofSecondsAgo={node.lastProofSecondsAgo}/>
                    </Marker>
                    ))
                }
            </Map>
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
