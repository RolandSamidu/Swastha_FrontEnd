import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
} from '@material-ui/core'
import { object } from 'prop-types'
import * as React from 'react'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import CheckboxValidatorElement from '../CheckBox'

export default function ScrollDialog({
    toggle,
    handleScrollClose,
    selectedWidget,
    handleFinalSelectedWidgetSubmit,
}) {
    const descriptionElementRef = React.useRef(null)
    React.useEffect(() => {
        if (toggle) {
            const { current: descriptionElement } = descriptionElementRef
            if (descriptionElement !== null) {
                descriptionElement.focus()
            }
        }
    }, [toggle])

    const [finalizedObj, setFinalizedObj] = React.useState({})

    const handleSelectOptionChange = (val) => {
        setFinalizedObj({
            ...finalizedObj,
            [val.target.name]: val.target.checked,
        })
    }

    const handleFinalSubmit = () => {
        //Passing the final Object to the dashboard
        handleFinalSelectedWidgetSubmit(finalizedObj)
    }

    return (
        <div>
            <Dialog
                open={toggle}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Select the data to Be Shown
                </DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {null == selectedWidget ? (
                            ''
                        ) : (
                            <ValidatorForm
                                className="pt-2"
                                onSubmit={() => this.handleDataSubmit()}
                                onError={() => null}
                            >
                                {Object.keys(selectedWidget).map((val) => {
                                    return (
                                        <FormControlLabel
                                            control={
                                                <CheckboxValidatorElement
                                                    onChange={
                                                        handleSelectOptionChange
                                                    }
                                                    name={val}
                                                    value={val}
                                                />
                                            }
                                            label={val}
                                        />
                                    )
                                })}
                            </ValidatorForm>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleScrollClose()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleFinalSubmit}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
