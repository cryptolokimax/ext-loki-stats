const innerCss = `
                
            .nodes-distribution-marker:hover .nodes-distribution-hover{
                display: block !important;
            }
            .nodes-distribution-hover {
                display: none;
                position: relative;
                top: -20px;
                left: 10px;
                width: 180px;
                height: 70px;
                background-color: white;
                border-radius: 2px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
                padding: 5px 9px;
                z-index: 9999999;
            }
         `;

export default innerCss;