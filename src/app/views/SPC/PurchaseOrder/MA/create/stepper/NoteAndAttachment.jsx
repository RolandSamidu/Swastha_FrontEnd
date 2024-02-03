import React, { useState, useContext, useEffect } from 'react'
import Button from 'app/components/LoonsLabComponents/Button'
import { Grid, FormControl } from '@material-ui/core'
import { MainContainer, SubTitle, } from 'app/components/LoonsLabComponents'
import { ValidatorForm, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import RichTextEditor from 'react-rte';

export default function NoteAndAttachment({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [note, setNote] = useState(RichTextEditor.createEmptyValue())
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (POData.current.noteAndAttachment?.note) {
            setNote(RichTextEditor.createValueFromString(POData.current.noteAndAttachment.note, 'html'))
        }
    }, [])

    const saveData = () => {

        POData.current.noteAndAttachment = { note: note.toString('html') }
    }

    const updateData = () => {
        setSaving(true)
        saveData()
    }

    const handleNext = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 4 }
        setPageData(tempPageData)
    }
    const handleBack = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 2 }
        setPageData(tempPageData)
    }

    const handleChange = (newValue) => {
        setNote(newValue);
    };

    return (
        <MainContainer>
            <ValidatorForm onSubmit={handleNext}>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={updateData}
                        >
                            save
                        </Button> */}

                    </Grid>
                    <Grid item xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Payment conditions" />
                            <br />
                            <RichTextEditor disabled={pageData.isPosted} value={note} onChange={handleChange} editorClassName='custom-editor' />
                        </FormControl>
                    </Grid>

                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <Grid container spacing={2} className='my-5'>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className=" w-full flex justify-end"
                            >
                                {/* Submit Button */}
                                <Button
                                    className='mr-2 mt-2'
                                    startIcon='chevron_left'
                                    variant="contained"
                                    // color="primary"
                                    style={{
                                        backgroundColor: "#ff0e0e"
                                    }}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>

                                <Button
                                    className='mt-2'
                                    endIcon='chevron_right'
                                    variant="contained"
                                    // color="primary"
                                    style={{
                                        backgroundColor: "#4BB543"
                                    }}
                                    type="submit"
                                >
                                    Save & Next
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ValidatorForm>
            <LoonsSnackbar
                open={saving}
                onClose={() => {
                    setSaving(false)
                }}
                message="Data Saved"
                autoHideDuration={1200}
                severity='success'
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </MainContainer>
    )
}
