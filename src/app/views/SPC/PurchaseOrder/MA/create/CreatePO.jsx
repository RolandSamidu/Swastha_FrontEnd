import React, { useRef, useContext, useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import Typography from '@material-ui/core/Typography'
import { Grid, Tooltip, Chip, Breadcrumbs, Link } from '@material-ui/core'
import StepButton from '@material-ui/core/StepButton';
import {
    MainContainer,
    LoonsCard,
    CardTitle,
} from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { PageContext } from './PageContext'
import ItemsDetails from './stepper/ItemsDetails'
import OrderDetails from './stepper/OrderDetails'
import NoteAndAttachment from './stepper/NoteAndAttachment'
import OtherGeneral from './stepper/OthersGeneral'
import Conditions from './stepper/Conditions'
import ShippingConditions from './stepper/ShippingConditions'
import Print from './stepper/Print'

function getSteps() {
    return [
        'Order Details',
        'Item Details',
        'Other Generals',
        'Special Conditions',
        'MSD Conditions',
        'Logistic Conditions',
        'Print',
    ]
}

function StepContent({ step }) {
    const POData = useRef({})

    switch (step) {
        case 0:
            return <OrderDetails POData={POData} />
        case 1:
            return <ItemsDetails POData={POData} />
        case 2:
            return <OtherGeneral POData={POData} />
        case 3:
            return <NoteAndAttachment POData={POData} />
        case 4:
            return <Conditions POData={POData} />
        case 5:
            return <ShippingConditions POData={POData} />
        case 6:
            return <Print POData={POData} />
        default:
            return 'Unknown step'
    }
}

export default function CreatePO() {
    const [pageData, setPageData] = useContext(PageContext)
    const steps = getSteps()

    const goBack = () => {
        const tempPageData = {
            ...pageData, slug: 'all', activeStep: 0, isPosted: false, PONo: null, type: '',
        }
        setPageData(tempPageData)
    }

    const selectStep = (index) => {
        const tempPageData = { ...pageData, activeStep: index }
        setPageData(tempPageData)
    }

    return (
        <MainContainer>
            <LoonsCard style={{ minHeight: '80vh' }}>
                <CardTitle title={'Create PO'} />
                <Grid
                    container
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                >
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Tooltip title="Back to All Orders">
                            <Chip
                                size="small"
                                icon={
                                    <ArrowBackIosIcon
                                        style={{
                                            marginLeft: '5px',
                                            fontSize: '11px',
                                        }}
                                    />
                                }
                                label="All Orders"
                                color="primary"
                                onClick={goBack}
                                variant="outlined"
                            />
                        </Tooltip>
                    </Grid>
                    <Grid
                        item
                        lg={4}
                        md={4}
                        sm={12}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                component="button"
                                color="inherit"
                                onClick={goBack}
                            >
                                All Orders
                            </Link>
                            <Typography color="textPrimary">View</Typography>
                        </Breadcrumbs>
                    </Grid>
                </Grid>
                <Stepper nonLinear activeStep={pageData.activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {}
                        const labelProps = {}
                        return (
                            <Step key={label} {...stepProps}>
                                <StepButton onClick={() => selectStep(index)} disabled>
                                    {label}
                                </StepButton>
                            </Step>
                        )
                    })}
                </Stepper>
                <StepContent step={pageData.activeStep} />
            </LoonsCard>
        </MainContainer>
    )
}
