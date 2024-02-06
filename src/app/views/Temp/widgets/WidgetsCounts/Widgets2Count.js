import React from 'react'

const Widgets2Count = ({ count, name }) => {
    return (
        <div style={{
            fontFamily: 'Inter',
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: '18.15px',
            letterSpacing: '0em',
            textAlign: 'left',
            color: "rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",

        }}>
            <div style={{
                fontFamily: 'Inter',
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: '38.73px',
                letterSpacing: '0em',
                textAlign: 'left',
                color: "rgba(255, 255, 255, 1)"
            }}>
                {count}
            </div>
           {name}
        </div>
    )
}
export default Widgets2Count