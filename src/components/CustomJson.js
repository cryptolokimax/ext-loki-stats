import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import computeRequestId from '../lib/computeRequestId'

const createMarkup = (template, data) => ({
    __html: template(data),
})

export default class CustomJson extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        template: PropTypes.string.isRequired,
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
        const { title, url, apiData, apiError, template } = this.props

        const innerCss = `
                
                .json-w-wrapper {
                    width: 100%;
                    height: 100%;
                    padding-top: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .json-w-center {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .json-w-big-text {
                    font-size: 9vmin;
                    height: 7vmin;
                }
                .json-w-right-text {
                    font-size: 2vmin;
                    padding-left: 1vmin;
                }
                .json-w-bottom-text {
                    font-size: 2vmin;
                    position: absolute;
                    bottom: 1vmin;
                }
         `;
        let body = <WidgetLoader />
        if (apiData && !apiError) {
            const compiled = _.template(template)
            body = <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={createMarkup(compiled, apiData)} />
        }

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
