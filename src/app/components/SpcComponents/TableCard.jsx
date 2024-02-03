import React from 'react'

const TableCard = ({ selected, cardNumber, setSelectedCard, cardTitle }) => {
    const renderSubCounts = (title, value) => {
        return (
            <div
                style={{
                    width: '65px',
                    height: '50px',
                    backgroundColor: '#eeeeee',
                    borderRadius: '10px',
                    fontSize: '11px',
                    margin: '0px 3px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <div>{title}</div>
                <div>{value}</div>
            </div>
        )
    }

    return (
        <div
            onClick={() => {
                setSelectedCard(cardNumber)
            }}
            className=".card"
            style={{
                display: 'flex',
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '10px',
                margin: '10px',
                width: '215px',
                height: '100px',
                boxShadow: '1px 1px 5px #444',
                border: `${
                    selected === cardNumber ? 'solid 1px #00f' : 'none'
                }`,
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    width: '100%',
                    flex: 1,
                }}
            >
                <div
                    style={{
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        fontSize: '12px',
                        borderBottom: '1px solid #222',
                    }}
                >
                    {cardTitle}
                </div>

                <div
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: '1',
                        display: 'flex',
                        marginTop: '10px',
                    }}
                >
                    {renderSubCounts('New', 30)}
                    {renderSubCounts('Ongoing', 20)}
                    {renderSubCounts('Completed', 10)}
                </div>
            </div>
        </div>
    )
}

export default TableCard
