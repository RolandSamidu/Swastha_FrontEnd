import React, { useState, useEffect, useContext } from 'react'
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    Alert,
} from '@material-ui/lab'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import HourglassFullIcon from '@material-ui/icons/HourglassFull'
import CancelIcon from '@material-ui/icons/Cancel'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Divider from '@material-ui/core/Divider'
import { TextareaAutosize } from '@mui/material'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'
import localStorageService from 'app/services/localStorageService'
import PreProcumentService from 'app/services/PreProcumentService'
import { PageContext } from './PageContext'

const fontStyle1 = {
    color: '#8395a7',
    fontWeight: 600,
}

const fontStyle2 = {
    color: '#212A3E',
    fontWeight: 600,
}

const buttonStyle1 = {
    margin: '1rem 5px',
}

const divStyle = {
    width: '40vw',
}

function LoonsAlertSPC({ type, message }) {
    switch (type) {
        case 'wait':
            return (
                <Alert
                    icon={<HourglassFullIcon fontSize="inherit" />}
                    severity="info"
                >
                    {message}
                </Alert>
            )
        case 'done':
            return (
                <Alert
                    icon={<CheckCircleIcon fontSize="inherit" />}
                    severity="success"
                >
                    {message}
                </Alert>
            )
        case 'reject':
            return (
                <Alert
                    icon={<CancelIcon fontSize="inherit" />}
                    severity="error"
                >
                    {message}
                </Alert>
            )
        default:
            return <></>
    }
}

function Remark({ message }) {
    return (
        <div
            style={{
                width: '100%',
                background: '#DAF5FF',
                borderRadius: '5px',
                marginTop: '5px',
                padding: '1rem',
            }}
        >
            <p style={{ fontWeight: '800', color: '#146C94', margin: 0 }}>
                Remark
            </p>

            <p style={{ color: '#146C94', padding: '5px' }}> {message}</p>
        </div>
    )
}

const remarkList = {
    MIRemark: '',
    DGMRemark: '',
    chairmanRemark: '',
}
// NOTE: approval status code meaning
// SPC.[ status of MI (done,pending,reject)].[status of DGM (done,pending,reject)].[status of Chairman (done,pending,reject,review)]
export default function ApprovalHandler() {
    const [pageData, setPageData] = useContext(PageContext)
    const [statusConfDialog, setStatusConfDialog] = useState(false)
    const [confirmStatus, setConfirmStatus] = useState('')
    const [MIRemark, setMIRemark] = useState('')
    const [DGMRemark, setDGMRemark] = useState('')
    const [ChairmanRemark, setChairmanRemark] = useState('')
    const [approvalList, setApprovalList] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [checkDGM, setCheckDGM] = useState(false)
    const [remarks, setRemarks] = useState(remarkList)

    useEffect(() => {
        const getRemark = (list) => {
            const tempRemarks = { ...remarks }

            for (let data of list) {
                if (data.approval_user_type === 'SPC Chairman') {
                    tempRemarks.chairmanRemark = data.remark
                }

                if (data.approval_user_type === 'SPC DGM') {
                    tempRemarks.DGMRemark = data.remark
                }

                if (data.approval_user_type === 'SPC MI') {
                    tempRemarks.MIRemark = data.remark
                }
            }

            setRemarks({ ...tempRemarks })
        }

        if (pageData.slug) {
            PreProcumentService.getApprovalList({
                order_list_id: pageData.slug,
            })
                .then((rs) => {
                    const { data } = rs.data.view
                    console.log(
                        '🚀 ~ file: ApprovalHandler.jsx:246 ~ .then ~ data:',
                        data
                    )
                    setApprovalList(data)
                    getRemark(data)
                })
                .catch((error) => {
                    console.log(
                        '🚀 ~ file: ApprovalHandler.jsx:249 ~ useEffect ~ error:',
                        error
                    )
                })
        }
    }, [])

    // approval status confirmation handaling
    const confirmationHandaling = async () => {
        if (approvalList.length === 0) {
            return false
        }

        // TODO: check admin can do this
        const approvalData = approvalList.find(
            (rs) => rs.approval_user_type === pageData.userType
        )

        if (!approvalData) {
            return false
        }

        const owner_id = await localStorageService.getItem('owner_id')
        const user = await localStorageService.getItem('userInfo')

        // send object for approval process
        const approvalObj = {
            owner_id: owner_id,
            order_list_id: pageData.slug,
            approved_by: user.id,
            spc_approval_config_id: approvalData.spc_approval_config_id,
            approval_user_type: pageData.userType,
            remark: '',
            approval_type: '',
            sequence: null,
            status: '',
        }

        if (pageData.userType === 'SPC MI') {
            approvalObj.remark = MIRemark
            approvalObj.approval_type =
                confirmStatus === 'SPC.approved.pending.pending'
                    ? 'Approval'
                    : 'Reject'
            approvalObj.status = confirmStatus
            approvalObj.sequence = 1
        }

        if (pageData.userType === 'SPC DGM') {
            approvalObj.remark = DGMRemark
            approvalObj.approval_type =
                confirmStatus === 'SPC.approved.approved.pending' ||
                confirmStatus === 'SPC.APPROVED'
                    ? 'Approval'
                    : 'Reject'
            approvalObj.status = confirmStatus
            approvalObj.sequence = 2
        }

        if (pageData.userType === 'SPC Chairman') {
            approvalObj.remark = ChairmanRemark

            approvalObj.approval_type =
                confirmStatus === 'SPC.APPROVED' ? 'Approval' : 'Reject'
            approvalObj.sequence = 3

            if (confirmStatus === 'SPC.APPROVED') {
                approvalObj.status = checkDGM
                    ? 'SPC.approved.review.approved'
                    : confirmStatus
            } else {
                approvalObj.status = confirmStatus
            }
        }
        // console.log(
        //     '🚀 ~ file: ApprovalHandler.jsx:312 ~ confirmationHandaling ~ pageData:',
        //     approvalObj
        // )

        // TODO: Error Handling
        PreProcumentService.approvalStatusUpdate(approvalData.id, approvalObj)
            .then((rs) => {
                setShowMessage(true)
                setPageData({ ...pageData, approvalStatus: approvalObj.status })
            })
            .catch((err) => {
                console.log(
                    '🚀 ~ file: ApprovalHandler.jsx:316 ~ confirmationHandaling ~ err:',
                    err
                )
            })
    }

    const openConfDialog = (confirmCondition) => {
        setConfirmStatus(confirmCondition)
        setStatusConfDialog(true)
    }

    const confirm = () => {
        confirmationHandaling()
        setStatusConfDialog(false)
    }

    const reject = () => {
        setStatusConfDialog(false)
    }

    const status = {
        MIApproval: (() => {
            let edit = true
            let alert = {
                type: '',
                message: '',
            }
            // getRemark('SPC MI')
            let remark = ''

            switch (pageData.approvalStatus) {
                // come from MSD
                case 'Pending Approval': {
                    if (pageData.userType === 'SPC MI') {
                        return { edit, alert, remark }
                    } else {
                        alert.type = 'wait'
                        alert.message = ' MI Approval Pending!'
                        return { edit: false, alert, remark }
                    }
                }
                case 'SPC.rejected.pending.pending':
                case 'SPC.reject.pending.reject': {
                    alert.type = 'reject'
                    alert.message = 'MI is rejected'
                    remark = 'reason'
                    return { edit: false, alert, remark }
                }
                default: {
                    alert.type = 'done'
                    alert.message = 'MI is approved'
                    return { edit: false, alert, remark }
                }
            }
        })(),

        DGMApproval: (() => {
            let edit = true
            let alert = {
                type: '',
                message: '',
            }
            let remark = ''

            switch (pageData.approvalStatus) {
                case 'Pending Approval': {
                    alert.type = 'wait'
                    alert.message = 'MI Approval Pending!'
                    return { edit: false, alert, remark }
                }
                case 'SPC.approved.pending.pending': {
                    if (pageData.userType === 'SPC DGM') {
                        return { edit, alert, remark }
                    } else {
                        alert.type = 'wait'
                        alert.message = 'DGM Approval Pending.!'
                        return { edit: false, alert, remark }
                    }
                }
                case 'SPC.reject.pending.pending':
                case 'SPC.reject.pending.reject': {
                    alert.type = 'reject'
                    alert.message = 'MI Rejected'
                    remark = 'reason'
                    return { edit: false, alert, remark }
                }
                case 'SPC.approved.reject.pending':
                case 'SPC.approved.reject.reject':
                case 'SPC.approved.reject.approved':
                case 'SPC.approved.reject.review': {
                    alert.type = 'reject'
                    alert.message = 'DGM is rejected'
                    remark = 'reason'
                    return { edit: false, alert, remark }
                }
                default: {
                    alert.type = 'done'
                    alert.message = 'DGM Approval Confirmed.'
                    return { edit: false, alert, remark }
                }
            }
        })(),
        chairmanApproval: (() => {
            let edit = true

            let alert = {
                type: '',
                message: '',
            }
            let remark = ''

            switch (pageData.approvalStatus) {
                case 'Pending Approval': {
                    alert.type = 'wait'
                    alert.message = ' MI Approval Pending!'
                    return { edit: false, alert, remark }
                }
                case 'SPC.approved.pending.pending': {
                    alert.type = 'wait'
                    alert.message = ' DGM Approval Pending.!'
                    return { edit: false, alert, remark }
                }
                case 'SPC.reject.pending.pending':
                case 'SPC.approved.reject.pending':
                case 'SPC.approved.approved.pending': {
                    if (pageData.userType === 'SPC Chairman') {
                        return { edit, alert, remark }
                    } else {
                        alert.type = 'wait'
                        alert.message = ' Chairman Approval Pending.!'
                        return { edit: false, alert, remark }
                    }
                }
                case 'SPC.REJECTED': {
                    alert.type = 'reject'
                    alert.message = "Chairman's Approval Declined"
                    remark = 'reason'
                    return { edit: false, alert, remark }
                }
                default: {
                    alert.type = 'done'
                    alert.message = " Chairman's Approval Confirmed"
                    return { edit: false, alert, remark }
                }
            }
        })(),
        DGMReview: (() => {
            if (pageData.approvalStatus === 'SPC.approved.review.approved') {
                if (pageData.userType === 'SPC DGM') {
                    return { status: true, edit: true }
                } else {
                    return {
                        status: true,
                        edit: false,
                        alert: {
                            type: 'wait',
                            message: ' DGM Review Pending!',
                        },
                    }
                }
            } else {
                return { status: false }
            }
        })(),
    }

    if (showMessage) {
        return (
            <div
                style={{
                    width: '100%',
                    padding: '1rem',
                    textAlign: 'center',
                }}
            >
                <CheckCircleIcon />
                <p>Update Is Success</p>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%' }}>
                {/* MI */}
                <Timeline style={{ float: 'left' }}>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>

                        <TimelineContent>
                            <div style={divStyle}>
                                <p
                                    style={
                                        status.MIApproval.edit
                                            ? fontStyle2
                                            : fontStyle1
                                    }
                                >
                                    MI Approval
                                </p>

                                {status.MIApproval.edit && (
                                    <>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            placeholder="Remark"
                                            value={MIRemark}
                                            onChange={(e) =>
                                                setMIRemark(e.target.value)
                                            }
                                            style={{
                                                padding: 10,
                                                borderRadius: 10,
                                                minWidth: '40vw',
                                                maxWidth: '40vw',
                                                minHeight: 80,
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <LoonsButton
                                                color="error"
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.rejected.pending.pending'
                                                    )
                                                }
                                            >
                                                Reject
                                            </LoonsButton>
                                            <LoonsButton
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.approved.pending.pending'
                                                    )
                                                }
                                            >
                                                Approve
                                            </LoonsButton>
                                        </div>
                                    </>
                                )}

                                {!status.MIApproval.edit && (
                                    <LoonsAlertSPC
                                        type={status.MIApproval.alert.type}
                                        message={
                                            status.MIApproval.alert.message
                                        }
                                    />
                                )}

                                {!status.MIApproval.edit &&
                                    remarks.MIRemark && (
                                        <Remark message={remarks.MIRemark} />
                                    )}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                    {/* DGM */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div style={divStyle}>
                                <p
                                    style={
                                        status.DGMApproval.edit
                                            ? fontStyle2
                                            : fontStyle1
                                    }
                                >
                                    DGM Approval
                                </p>

                                {!status.DGMApproval.edit && (
                                    <LoonsAlertSPC
                                        type={status.DGMApproval.alert.type}
                                        message={
                                            status.DGMApproval.alert.message
                                        }
                                    />
                                )}

                                {status.DGMApproval.edit && (
                                    <>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            placeholder="Remark"
                                            value={DGMRemark}
                                            onChange={(e) =>
                                                setDGMRemark(e.target.value)
                                            }
                                            style={{
                                                padding: 10,
                                                borderRadius: 10,
                                                minWidth: '40vw',
                                                maxWidth: '40vw',
                                                minHeight: 80,
                                            }}
                                        />

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <LoonsButton
                                                color="error"
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.approved.rejected.pending'
                                                    )
                                                }
                                            >
                                                Reject
                                            </LoonsButton>
                                            <LoonsButton
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.approved.approved.pending'
                                                    )
                                                }
                                            >
                                                Approve
                                            </LoonsButton>
                                        </div>
                                    </>
                                )}

                                {!status.DGMApproval.edit &&
                                    remarks.DGMRemark && (
                                        <Remark message={remarks.DGMRemark} />
                                    )}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                    {/* Chairman */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot />
                            {status.DGMReview.status && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <div style={divStyle}>
                                <p
                                    style={
                                        status.chairmanApproval.edit
                                            ? fontStyle2
                                            : fontStyle1
                                    }
                                >
                                    Chairman Approval
                                </p>

                                {!status.chairmanApproval.edit && (
                                    <LoonsAlertSPC
                                        type={
                                            status.chairmanApproval.alert.type
                                        }
                                        message={
                                            status.chairmanApproval.alert
                                                .message
                                        }
                                    />
                                )}

                                {status.chairmanApproval.edit && (
                                    <>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="checkedA"
                                                    color="primary"
                                                    checked={checkDGM}
                                                    onChange={(e) =>
                                                        setCheckDGM(
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            }
                                            label="Check DGM"
                                        />

                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            placeholder="Remark"
                                            value={ChairmanRemark}
                                            onChange={(e) =>
                                                setChairmanRemark(
                                                    e.target.value
                                                )
                                            }
                                            style={{
                                                padding: 10,
                                                borderRadius: 10,
                                                minWidth: '40vw',
                                                maxWidth: '40vw',
                                                minHeight: 80,
                                            }}
                                        />
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <LoonsButton
                                                color="error"
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.REJECTED'
                                                    )
                                                }
                                            >
                                                Reject
                                            </LoonsButton>
                                            <LoonsButton
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.APPROVED'
                                                    )
                                                }
                                            >
                                                Approve
                                            </LoonsButton>
                                        </div>
                                    </>
                                )}

                                {!status.chairmanApproval.edit &&
                                    remarks.chairmanRemark && (
                                        <Remark message={remarks.chairmanRemark} />
                                    )}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                    {/* DGM Review Handler */}
                    {status.DGMReview.status && (
                        <TimelineItem>
                            <TimelineSeparator>
                                <TimelineDot />
                            </TimelineSeparator>
                            <TimelineContent>
                                <div style={divStyle}>
                                    <p
                                        style={
                                            status.DGMReview.status
                                                ? fontStyle2
                                                : fontStyle1
                                        }
                                    >
                                        DGM Review
                                    </p>

                                    {!status.DGMReview.edit && (
                                        <LoonsAlertSPC
                                            type={status.DGMReview.alert.type}
                                            message={
                                                status.DGMReview.alert.message
                                            }
                                        />
                                    )}

                                    {status.DGMReview.edit && (
                                        <div
                                            style={{
                                                display: 'flex',
                                            }}
                                        >
                                            <LoonsButton
                                                style={buttonStyle1}
                                                onClick={() =>
                                                    openConfDialog(
                                                        'SPC.APPROVED'
                                                    )
                                                }
                                            >
                                                Submit
                                            </LoonsButton>
                                        </div>
                                    )}
                                </div>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                </Timeline>

                {/* chariman confirmation handeling */}
                <ConfirmationDialog
                    text="Are you sure?"
                    open={statusConfDialog}
                    onConfirmDialogClose={reject}
                    onYesClick={confirm}
                />
            </div>
        )
    }
}
