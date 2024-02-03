import React from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import HourglassFullIcon from '@material-ui/icons/HourglassFull'
import VisibilityIcon from '@material-ui/icons/Visibility';
import Chip from '@material-ui/core/Chip'

export default function TableLable({ status }) {
    switch (status) {
        case 'SPC.APPROVED':
            return (
                <Chip
                    icon={<CheckCircleIcon />}
                    label="SPC Approval"
                    size="small"
                    style={{
                        background: '#BAFFA6',
                        color: '#007603',
                    }}
                />
            )
        case 'Pending Approval':
            return (
                <Chip
                    icon={<HourglassFullIcon />}
                    label="Wait MI Approval"
                    size="small"
                    style={{
                        background: '#D3FFBC',
                        color: '#2E6E35',
                    }}
                />
            )

        case 'SPC.approved.pending.pending':
            return (
                <Chip
                    icon={<HourglassFullIcon />}
                    label="Wait DGM Approval"
                    size="small"
                    style={{
                        background: '#A6FEC5',
                        color: '#2863B0',
                    }}
                />
            )
        case 'SPC.approved.approved.pending':
            return (
                <Chip
                    icon={<HourglassFullIcon />}
                    label="Wait Chairman Approval"
                    size="small"
                    style={{
                        background: '#D1F2FF',
                        color: '#0071AD',
                    }}
                />
            )

        case 'SPC.approved.review.approved':
            return (
                <Chip
                    icon={<VisibilityIcon />}
                    label="Wait DGM Review"
                    size="small"
                    style={{
                        background: '#DCFCFE',
                        color: '#27374D',
                    }}
                />
            )
        default:
            return <label>{status}</label>
    }
}
