const innerCss = `
                
                .json-w-wrapper {
                    width: 100%;
                    height: 100%;
                    padding-top: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: none;
                }
                .json-w-center {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .json-w-top-label {
                    width: 100%;
                    text-align: center;
                    position: relative;
                    top: -3vmin;
                    font-family: 'Prompt';
                }
                .json-w-big-text {
                    font-size: 9vmin;
                    height: 7vmin;
                    font-family: 'Prompt';
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
         `

export default innerCss
