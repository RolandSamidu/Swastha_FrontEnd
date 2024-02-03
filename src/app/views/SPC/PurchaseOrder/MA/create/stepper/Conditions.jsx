import React, { useState, useContext, useEffect } from 'react'
import {
    Grid,
    FormControl,
} from '@material-ui/core'
import Button from 'app/components/LoonsLabComponents/Button'
import { MainContainer, SubTitle, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import RichTextEditor from 'react-rte';

export default function Conditions({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [condition, setCondition] = useState(RichTextEditor.createEmptyValue())
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (POData.current.conditions) {
            setCondition(RichTextEditor.createValueFromString(POData.current.conditions, 'html'))
        }
    }, [])

    const handleChange = (newValue) => {
        setCondition(newValue);
    }

    const saveData = () => {
        POData.current.conditions = condition.toString('html')
    }

    const updateData = () => {
        saveData()
        setSaving(true)
    }

    const handleNext = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 5 }
        setPageData(tempPageData)
    }
    const handleBack = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 3 }
        setPageData(tempPageData)
    }

    // const onClick = () => console.log("I clicked");
    // const customControl = [() => <button onClick={onClick}>Hello</button>];
    // const onChange = (value) => {
    //     setValue(value);
    //     setMarkdown(value.toString("markdown"));
    // };

    return (
        <MainContainer>
            <Grid
                container
                spacing={2}
                style={{ display: 'flex', justifyContent: 'center' }}
            >

                {/* <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updateData}
                        disabled={pageData.isPosted}
                    >
                        save
                    </Button>
                </Grid> */}

                <Grid item xs={12}>
                    <FormControl className="w-full">
                        <SubTitle title="Condtions" />
                        <br />
                        <RichTextEditor disabled={pageData.isPosted} value={condition} onChange={handleChange} className="react-rte-itemMaster" editorClassName='custom-editor' />
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
                                onClick={handleNext}
                            >
                                Save & Next
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
