import React, { useState, useContext } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
    Breadcrumbs,
    Tooltip,
    Link,
    Chip,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { PageContext } from './PageContext'
import CommiteeTable from './commiteeTable'
import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
} from 'app/components/LoonsLabComponents'
import SaveIcon from '@material-ui/icons/Save'

const selectionData = {
    committee: [
        { label: 'Bid Opening Committee' },
        { label: 'Should be Approved' },
        { label: 'Procurement Committee' },
    ],

    authority: [
        { label: 'All' },
        { label: 'DPC-Minor' },
        { label: 'Ministry' },
        { label: 'Cabinet' },
    ],

    ward: [
        { id: 1, label: 'W101' },
        { id: 2, label: 'W102' },
        { id: 3, label: 'W103' },
        { id: 4, label: 'W104' },
        { id: 5, label: 'W105' },
    ],

    bht: [
        { id: 1, label: 'B101' },
        { id: 2, label: 'B102' },
        { id: 3, label: 'B103' },
        { id: 4, label: 'B104' },
        { id: 5, label: 'B105' },
    ],
}

export default function NewCommitee() {
    const [pageData, setPageData] = useContext(PageContext)
    const [commiteeType, setCommiteType] = useState('')
    const [purpose, setPurpose] = useState('')
    const [category, setCategory] = useState('pharmaceutical')
    const [authority, setAuthority] = useState('')
    const [commitee, setCommitee] = useState()
    const [coveringApproval, setCoveringApproval] = useState('')

    const submitData = () => {}
    const goBack = () => {
        const tempPageData = { ...pageData, slug: 'all' }
        setPageData(tempPageData)
    }

    return (
        <MainContainer>
            <LoonsCard>
                <CardTitle title="Committee Setup" />
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
                        <Tooltip title="Back to All Commitee">
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
                                label="Back"
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
                                All Commitee
                            </Link>
                            <Typography color="textPrimary">Add New</Typography>
                        </Breadcrumbs>
                    </Grid>
                </Grid>

                <ValidatorForm
                    className="pt-2"
                    onSubmit={submitData}
                    onError={() => null}
                >
                    <Grid
                        container
                        spacing={2}
                        style={{ paddingBottom: '1rem' }}
                    >
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Commitee Type" />
                                <Autocomplete
                                    className="w-full"
                                    options={selectionData.committee}
                                    onChange={(e) => {
                                        setCommiteType(e.target.value)
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={commiteeType}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Category" />

                                <FormControl component="fieldset">
                                    <RadioGroup
                                        name="category"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        style={{ display: 'block' }}
                                    >
                                        <FormControlLabel
                                            value="pharmaceutical"
                                            control={<Radio />}
                                            label="Pharmaceutical"
                                        />
                                        <FormControlLabel
                                            value="surgical"
                                            control={<Radio />}
                                            label="Surgical"
                                        />
                                        <FormControlLabel
                                            value="laboratory"
                                            control={<Radio />}
                                            label="Laboratory"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Authority" />
                                <Autocomplete
                                    className="w-full"
                                    options={selectionData.authority}
                                    onChange={(e) =>
                                        setAuthority(e.target.value)
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={authority}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Commitee" />
                                <Autocomplete
                                    className="w-full"
                                    options={selectionData.ward}
                                    onChange={(e) =>
                                        setCommitee(e.target.value)
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={commitee}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Covering Approval From" />
                                <Autocomplete
                                    className="w-full"
                                    options={selectionData.ward}
                                    onChange={(e) =>
                                        setCoveringApproval(e.target.value)
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Please choose"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={coveringApproval}
                                        />
                                    )}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Purpose" />
                                <TextValidator
                                    multiline
                                    rows={4}
                                    className=" w-full"
                                    placeholder="Description"
                                    name="purpose"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <SubTitle title="Composition" />
                            <CommiteeTable />
                        </Grid>

                        {/* File upload handler */}
                        <Grid item xs={12}>
                            <SubTitle title="Attachments" />
                        </Grid>
                        <Grid item xs={12}>
                            <SwasthaFilePicker
                                // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                id="file_public"
                                singleFileEnable={true}
                                multipleFileEnable={false}
                                dragAndDropEnable={true}
                                tableEnable={true}
                                documentName={true} //document name enable
                                documentNameValidation={['required']}
                                documenterrorMessages={[
                                    'this field is required',
                                ]}
                                documentNameDefaultValue={null} //document name default value. if not value set null
                                type={false}
                                types={null}
                                typeValidation={null}
                                typeErrorMessages={null}
                                defaultType={null} // null
                                description={true}
                                descriptionValidation={null}
                                descriptionErrorMessages={null}
                                defaultDescription={null} //null
                                onlyMeEnable={false}
                                defaultOnlyMe={false}
                                source="local_purchase"
                                // source_id={this.state.loginUserHospital}

                                //accept="image/png"
                                // maxFileSize={1048576}
                                // maxTotalFileSize={1048576}
                                maxFilesCount={1}
                                validators={[
                                    'required',
                                    // 'maxSize',
                                    // 'maxTotalFileSize',
                                    // 'maxFileCount',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    // 'file size too lage',
                                    // 'Total file size is too lage',
                                    // 'Too many files added',
                                ]}
                                /* selectedFileList={
                                                    this.state.data.fileList
                                                } */
                                label="Select Attachment"
                                singleFileButtonText="Upload Data"
                                // multipleFileButtonText="Select Files"
                            ></SwasthaFilePicker>
                        </Grid>
                        <Grid item xs={2}>
                            <Button
                                startIcon={<SaveIcon />}
                                variant="contained"
                                color="primary"
                                style={{ width: '100%' }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </LoonsCard>
        </MainContainer>
    )
}
