import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { SubTitle } from 'app/components/LoonsLabComponents'
import { ListSubheader } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    cardHeader: {
        padding: theme.spacing(1, 2),
    },
    list: {
        width: 200,
        height: 230,
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}))

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1)
}

function union(a, b) {
    return [...a, ...not(b, a)]``
}

export default function TransferList() {
    const classes = useStyles()
    const [checked, setChecked] = React.useState([])
    const [left, setLeft] = React.useState([0, 1, 2, 3])
    const [right, setRight] = React.useState([4, 5, 6, 7])

    const leftChecked = intersection(checked, left)
    const rightChecked = intersection(checked, right)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
    }

    const numberOfChecked = (items) => intersection(checked, items).length

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items))
        } else {
            setChecked(union(checked, items))
        }
    }

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked))
        setLeft(not(left, leftChecked))
        setChecked(not(checked, leftChecked))
    }

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked))
        setRight(not(right, rightChecked))
        setChecked(not(checked, rightChecked))
    }

    const customList = (title, items) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={
                            numberOfChecked(items) === items.length &&
                            items.length !== 0
                        }
                        indeterminate={
                            numberOfChecked(items) !== items.length &&
                            numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />

            {/* Filters */}
            <div>
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => null}
                    onError={() => null}
                >
                    <Grid container spacing={2}>
                        <Grid
                            className=" w-full"
                            item
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                        >
                            <TextValidator
                                className=" w-full"
                                placeholder="SRID"
                                name="SRID"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        <Grid
                            className=" w-full"
                            item
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <TextValidator
                                className=" w-full"
                                placeholder="Item Name"
                                name="Item Name"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        <Grid
                            className=" w-full"
                            item
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                        >
                            <TextValidator
                                className=" w-full"
                                placeholder="Item Category"
                                name="Item Category"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>

            <Divider className="mt-2" />

            <List dense component="div" role="list">
                {items.map((value) => {
                    console.log('Items =============>', items)
                    const labelId = `transfer-list-all-item-${value}-label`

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={`List item ${value + 1}`}
                            />
                            <ListItemText
                                id={labelId}
                                primary={`List item ${value + 1}`}
                            />
                            <ListItemText
                                id={labelId}
                                primary={`List item ${value + 1}`}
                            />
                        </ListItem>
                    )
                })}
                <ListItem />
            </List>
        </Card>
    )

    return (
        <Grid
            container
            spacing={2}
            // justifyContent="center"
            // alignItems="center"
            className="w-full"
        >
            <Grid item lg={5} md={5}>
                {customList('Choices', left)}
            </Grid>
            <Grid item lg={2} md={2}>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        className={classes.button}
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item lg={5} md={5}>
                {customList('Chosen', right)}
            </Grid>
        </Grid>
    )
}
