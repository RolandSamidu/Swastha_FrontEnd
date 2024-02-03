import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import HoverableText from 'app/components/HoverableText';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';

import { Button, Tooltip } from '@material-ui/core';
import { useState } from 'react';

const styles = {
    row: {
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    rowEven: {
        background: '#f8f8f8',
        minHeight: '4em',
        marginTop: 1,
        marginBottomn: 1,
        display: 'flex',
        alignItems: 'center',
        borderLeft: '1px solid #eaeaea',
        borderRight: '1px solid #eaeaea',
    },
    min: {
        width: 'calc(5%)',
    },
    medium: {
        width: 'calc(10%)'
    },
    medMax: {
        width: 'calc(15%)',
        textAlign: 'start'
    },
    max: {
        width: 'calc(35%)'
    },
    even: {
        width: 'calc(25%)'
    },
    btn: {
        padding: 0,
        width: '2em',
        height: '2em',
        minWidth: 0,
        margin: 1
    },
    hovered: {
        border: '1px solid #ffbdbd'
    }
}

const InsulinIcon = () => <img style={{ width: '1.3em', height: '1.3em' }} alt='Insulin' src='/assets/icons/insulin.svg' />
const InjectionIcon = () => <img style={{ width: '1.3em', height: '1.3em' }} alt='Injection' src='/assets/icons/injection.svg' />
const OutofStockIcon = () => <img style={{ width: '1.3em', height: '1.3em' }} alt='Out of Stock' src='/assets/icons/lowstock.svg' />

const Row = (props) => {
    const { classes, drug, index, remove, select, selected } = props;
    const [hovered, setHovered] = useState(false);
    let drugType = null;
    switch (drug.type) {
        case "Insulin":
            drugType = <InsulinIcon />;
            break;
        case "Injection":
            drugType = <InjectionIcon />;
            break;
        case "OS":
            drugType = <OutofStockIcon />;
            break;
        default:
            break;
    }

    return <div className={`${((index % 2 === 0) ? classes.rowEven : classes.row)} ${(hovered || selected === index ? classes.hovered : null)}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
    >
        <div className={classes.min} style={{ display: 'flex', justifyContent: 'center' }}>{drugType}</div>
        <div className={classes.min}>{`${(index + 1).toString().padStart(2, '0')}.`}</div>
        <div className={classes.max}><HoverableText text={drug.drug} /></div>
        <div className={classes.medium}><HoverableText text={drug.route} /></div>
        <div style={{ width: 'calc(45%)' }}>
            {
                drug.params.map((item, pos) => {
                    return <div style={{ width: '100%', display: 'flex', height: '4em', alignItems: 'center' }}>
                        <div className={classes.even}><HoverableText text={`${item.dosage} ${drug.uom}`} /></div>
                        <div className={classes.even}><HoverableText text={item.frequency} /></div>
                        <div className={classes.even}><HoverableText text={`${item.duration} Days`} /></div>
                        <div className={classes.even}><HoverableText text={item.quantity} /></div>
                        <div className={classes.even}>
                            {pos === 0 ? <Button className={classes.btn} style={{ color: '#06b6d4', background: '#e1fbff' }}
                                onClick={() => { index !== selected ? select(index) : select(null) }}>
                                {index === selected ? <SettingsBackupRestoreIcon /> : <EditOutlinedIcon />}
                            </Button> : null}
                            {pos === 0 ? <Button className={classes.btn} style={{ color: '#ff3f3f', background: '#ffbdbd' }}
                                onClick={() => remove(index)}>
                                <DeleteOutlinedIcon />
                            </Button> : null}
                            {
                                item.remark ?
                                    <Tooltip
                                        arrow
                                        title={item.remark}>
                                        <Button className={classes.btn} style={{ color: '#009d6d', background: '#c3f7e7' }}>
                                            <VisibilityOutlinedIcon />
                                        </Button>
                                    </Tooltip> : null
                            }
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}

Row.propTypes = {
}

export default withStyles(styles)(Row);