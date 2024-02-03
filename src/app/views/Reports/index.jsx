import React, { Component } from 'react'
import {
    Button,
    ButtonGroup,
    CircularProgress,
    ClickAwayListener,
    Grid,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Typography,
} from '@material-ui/core'
import { Reports } from './config'
import { TextValidator } from 'react-material-ui-form-validator'
import { Autocomplete } from '@material-ui/lab'
import { SubTitle, ValidatorForm } from 'app/components/LoonsLabComponents'
import { MainContainer, LoonsCard } from 'app/components/LoonsLabComponents'
import {
    UsageType,
    Category,
    VenId,
    Groups,
    Class,
    MainSupplier,
    DateSelect,
    StringSearch,
    Agents,
    Warehouse,
    GrnStatus,
    Manufacture,
    Item,
    Institute,
    OrderCategory,
    DebitNoteTypes,
    YesNoDrop,
    ItemUsageType,
    Status,
} from './ParameterComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ReportService from 'app/services/ReportService'
import localStorageService from 'app/services/localStorageService'
import FileSaver from 'file-saver'
import jwtDecode from 'jwt-decode'
import clsx from 'clsx'
import * as appConst from '../../../appconst'
import { authRoles } from 'app/auth/authRoles'
const options = ['Download as xlsx', 'Download as PDF']

class ReportComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            filterFields: [],
            filterData: {},
            parameters: [],
            viewReport: false,
            open: false,
            selectedIndex: 0,
            btnProgress: false,
            downloadBtnProgress: false,
            currentReportId: null,
            htmlContent: null,
            reports: [],
            owner_id: null,
            loadWarehouse: true,
            showMassage: false,
            estimation: true,
            fixed_owner_id: null,
            currentReport: null,
            downloadbtnProgress: false

        }
        this.formRef = React.createRef();

        this.anchorRef = React.createRef()
    }

    async submit() {

        if (this.state.viewReportBtn) {
            this.setState({
                viewReport: null,
                htmlContent: null,
                btnProgress: true,
            })

            let parameters = this.state.parameters

            if (this.state.estimation && !parameters.find(e => e.name == 'year')) {
                parameters.push({ name: 'year', value: '2024' })
            }

            if (this.state.isCheif) {
                const eventName1 = 'owner_id';
                const eventName2 = 'from_owner_id';

                if (this.state.filterFields.some(obj => obj.eventName === eventName1 || obj.eventName === eventName2)) {
                    const paramName = this.state.filterFields.some(obj => obj.eventName === eventName1) ? eventName1 : eventName2;
                    parameters.push({ name: paramName, value: this.state.fixed_owner_id });
                }


            }



            // remove duplicates on parameter array
            for (const key in this.state.filterData) {
                if (this.state.filterData.hasOwnProperty(key)) {
                    const existingIndex = parameters.findIndex(
                        (obj) => obj.name === key
                    )

                    if (existingIndex !== -1) {
                        parameters[existingIndex] = {
                            name: key,
                            value: this.state.filterData[key],
                        }
                    } else {
                        parameters.push({
                            name: key,
                            value: this.state.filterData[key],
                        })
                    }
                }
            }

            let id = this.state.currentReportId
            let bodyData = {
                template: 'html',
                parameters: parameters,
            }
            let res = await ReportService.generateReport(id, bodyData)
            console.log('res', res)

            this.setState({
                btnProgress: false,
                viewReport: true,
                htmlContent: res.data,
            })
        } else {
            this.handleClickdownload()
        }

    }

    handleClick = () => {
        this.setState({
            downloadBtnProgress: true,
        })
        if (this.state.selectedIndex == 0) {
            this.DownloadReport('excel')
        } else {
            this.setState({
                downloadBtnProgress: false,
            })
        }
    }
    async DownloadReport(type) {

        this.setState({
            downloadBtnProgress: true,
        })
        let parameters = this.state.parameters
        let id = this.state.currentReportId
        let bodyData = {
            template: type,
            parameters: parameters,
        }
        let res = await ReportService.downloadReport(id, bodyData)


        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        FileSaver.saveAs(blob, 'report.xlsx')
        this.setState({
            downloadBtnProgress: false,
        })
    }

    async handleClickdownload() {

        this.setState({
            progressBtn: true
        })
        let parameters = this.state.parameters

        if (this.state.estimation && !parameters.find(e => e.name == 'year')) {
            parameters.push({ name: 'year', value: '2024' })
        }

        if (this.state.isCheif) {
            const eventName1 = 'owner_id';
            const eventName2 = 'from_owner_id';

            if (this.state.filterFields.some(obj => obj.eventName === eventName1 || obj.eventName === eventName2)) {
                const paramName = this.state.filterFields.some(obj => obj.eventName === eventName1) ? eventName1 : eventName2;
                parameters.push({ name: paramName, value: this.state.fixed_owner_id });
            }


        }
        // remove duplicates on parameter array
        for (const key in this.state.filterData) {
            if (this.state.filterData.hasOwnProperty(key)) {
                const existingIndex = parameters.findIndex(
                    (obj) => obj.name === key
                )

                if (existingIndex !== -1) {
                    parameters[existingIndex] = {
                        name: key,
                        value: this.state.filterData[key],
                    }
                } else {
                    parameters.push({
                        name: key,
                        value: this.state.filterData[key],
                    })
                }
            }
        }

        let id = this.state.currentReportId
        let bodyData = {
            template: 'excel',
            parameters: parameters,
        }
        let res = await ReportService.downloadReport(id, bodyData)


        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        FileSaver.saveAs(blob, 'report.xlsx')
        this.setState({
            progressBtn: false,
        })
    }
    async handleClickPrint() {

        this.setState({
            progressBtnprint: true
        })
        let parameters = this.state.parameters

        if (this.state.estimation && !parameters.find(e => e.name == 'year')) {
            parameters.push({ name: 'year', value: '2024' })
        }

        if (this.state.isCheif) {
            const eventName1 = 'owner_id';
            const eventName2 = 'from_owner_id';

            if (this.state.filterFields.some(obj => obj.eventName === eventName1 || obj.eventName === eventName2)) {
                const paramName = this.state.filterFields.some(obj => obj.eventName === eventName1) ? eventName1 : eventName2;
                parameters.push({ name: paramName, value: this.state.fixed_owner_id });
            }


        }
        // remove duplicates on parameter array
        for (const key in this.state.filterData) {
            if (this.state.filterData.hasOwnProperty(key)) {
                const existingIndex = parameters.findIndex(
                    (obj) => obj.name === key
                )

                if (existingIndex !== -1) {
                    parameters[existingIndex] = {
                        name: key,
                        value: this.state.filterData[key],
                    }
                } else {
                    parameters.push({
                        name: key,
                        value: this.state.filterData[key],
                    })
                }
            }
        }

        let id = this.state.currentReportId
        let bodyData = {
            template: 'html',
            parameters: parameters,
        }
        let res = await ReportService.downloadReport(id, bodyData)

        const decoder = new TextDecoder('utf-8');
        const htmlString = decoder.decode(res.data);

        // Get the hidden iframe
        const printFrame = document.getElementById('printFrame');
        const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;

        // Write the HTML content to the iframe
        printDocument.write(htmlString);
        printDocument.close();

        // Trigger the print dialog
        printFrame.contentWindow.print();

        this.setState({
            progressBtnprint: false,
        })
    }

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, open: false })
    }

    handleToggle = () => {
        this.setState((prevState) => ({
            open: !prevState.open,
        }))
    }

    handleClose = (event) => {
        if (
            this.anchorRef.current &&
            this.anchorRef.current.contains(event.target)
        ) {
            return
        }

        this.setState({ open: false })
    }

    setValues(name, value) {

        console.log("values -->", name, value)
        let parameters = this.state.parameters
        let existingIndex = parameters.findIndex((obj) => obj.name === name)

        // avoiding repeating data on parameter array
        if (existingIndex !== -1) {
            parameters[existingIndex] = { name: name, value: value }
        } else {

            parameters.push({ name: name, value: value })

        }
        console.log("values --> parameters", parameters)
        this.setState({
            parameters: parameters,
        })
    }
    async componentDidMount() {
        const accessToken = localStorageService.getItem('reportAccessToken')
        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        console.log("Owner ID", owner_id)
        let isCheif = authRoles.ChiefReports.some(value => user.roles.includes(value))
        this.setState({
            isCheif: isCheif,
            fixed_owner_id: owner_id
        })
        if (await this.isValidToken(accessToken)) {
            this.getReports()
        } else {
            await this.getToken()
        }
    }

    async getReports() {
        let res = await ReportService.getAllReports()
        if (res.status == 200) {

            let reports = []
            console.log("res", this.state.isCheif, res.data)
            if (this.state.isCheif) {
                reports = res.data.filter(el => el.id != "b248a9cc-0038-8dc5-ba9d-f86eb462bdbc").filter(obj1 => appConst.cheif_reports_ids.some(obj2 => obj1.id === obj2.id));
            } else {
                reports = res.data.filter(el => el.id != "b248a9cc-0038-8dc5-ba9d-f86eb462bdbc")
            }
            this.setState({ reports: reports, loading: false })
        }
    }

    async isValidToken(accessToken) {
        if (!accessToken) {
            return false
        }
        const currentTime = (Date.now() / 1000) | 0

        if (accessToken.expires_in - currentTime < appConst.refresh_befor) {
            return false
        }
        if (accessToken.expires_in > currentTime) {
            return true
        }
    }

    async getToken() {
        let response = await ReportService.getToken()
        if (response) {
            this.setSession(response.data.access_token)
            this.getReports()
        }
    }

    setSession = (accessToken) => {
        if (accessToken) {
            localStorage.removeItem('reportAccessToken')
            localStorageService.setItem('reportAccessToken', accessToken)
        } else {
            localStorage.removeItem('reportAccessToken')
        }
    }

    render() {
        const { open, selectedIndex = 0 } = this.state

        return (
            <div style={{ height: 'calc(100% + -40px)' }}>
                <MainContainer>
                    <LoonsCard>
                        <ValidatorForm
                            ref={this.formRef}
                            onSubmit={() => {
                                this.submit()
                            }}
                            className="flex mx-2 mt-1"
                        >
                            {!this.state.loading ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <SubTitle title="Select Report" />
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.reports}
                                            onChange={(e, value) => {

                                                let is_estimation = this.state.estimation

                                                this.setState({
                                                    estimation: false
                                                })
                                                let report = Reports.find(
                                                    (e) => e.id == value.id
                                                )

                                                if (report) {

                                                    // checking the selected report is estimation or not
                                                    if (report.id == "e07331b6-2c42-be60-bdc8-ac45840ca006") {

                                                        is_estimation = true
                                                    } else {
                                                        is_estimation = false
                                                    }

                                                    this.setState({
                                                        estimation: is_estimation,
                                                        showMassage: false
                                                    })
                                                    let filterData =
                                                        this.state.filterData
                                                    let parameters =
                                                        this.state.parameters
                                                    filterData = {}
                                                    parameters = []
                                                    console.log('values', report)
                                                    this.setState(
                                                        {

                                                            filterFields: [],
                                                            filterData: filterData,
                                                            parameters: parameters,
                                                        },
                                                        () => {
                                                            this.setState({
                                                                filterFields:
                                                                    report.filterFields,
                                                                currentReportId:
                                                                    value.id,
                                                                currentReport: report
                                                            })
                                                        }
                                                    )
                                                } else {
                                                    this.setState({
                                                        showMassage: true
                                                    })
                                                }

                                            }}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Select Report"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {this.state.filterFields.length > 0 && (
                                        <Grid item xs={12} md={3}>

                                            <LoonsButton
                                                startIcon="clear_all"
                                                className=" mt-1"
                                                progress={false}
                                                type="button"
                                                scrollToTop={true}
                                                onClick={() => {
                                                    this.setState(
                                                        {
                                                            viewReport: false,
                                                        },
                                                        () => {
                                                            window.location.reload(
                                                                false
                                                            )
                                                        }
                                                    )
                                                }}
                                            >
                                                <span className="capitalize">
                                                    Clear Filters
                                                </span>
                                            </LoonsButton>

                                        </Grid>
                                    )}

                                    {!this.state.showMassage ?
                                        <>
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    {this.state.filterFields.length >
                                                        0 && (
                                                            <Grid item xs={12}>
                                                                <SubTitle title="Set Filters" />
                                                            </Grid>
                                                        )}

                                                    {this.state.filterFields.map(
                                                        (element, index) => {
                                                            if (
                                                                element.name ==
                                                                'UsageType'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <UsageType
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'usageType_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'ItemUsageType'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <ItemUsageType
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'item_usage_type_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'Category'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Category
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'category_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name == 'VenId'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <VenId
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'ven_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name == 'Groups'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Groups
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'group_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name == 'Class'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Class
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'class_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name == 'Agents'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Agents
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'agent_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                (element.name ==
                                                                    'Institute' && ((this.state.isCheif && element.eventName == "to_owner_id")
                                                                        || (this.state.isCheif && this.state.currentReport.owner_id_fixed == false)
                                                                        || !this.state.isCheif)
                                                                )
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Institute
                                                                            reportId={this.state.currentReportId}
                                                                            params={
                                                                                element.params
                                                                                    ? element.params
                                                                                    : [
                                                                                        'Hospital',
                                                                                        'RMSD Main',
                                                                                        'MSD Main',
                                                                                    ]
                                                                            }

                                                                            placeholder={
                                                                                element.placeholder
                                                                                    ? element.placeholder
                                                                                    : 'Institute'
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setState(
                                                                                    {
                                                                                        loadWarehouse: false,
                                                                                    }
                                                                                )
                                                                                this.setValues(
                                                                                    element.eventName
                                                                                        ? element.eventName
                                                                                        : 'owner_id',
                                                                                    value
                                                                                )

                                                                                this.setState(
                                                                                    {
                                                                                        owner_id:
                                                                                            value,
                                                                                    }
                                                                                )

                                                                                setTimeout(
                                                                                    () => {
                                                                                        this.setState(
                                                                                            {
                                                                                                loadWarehouse: true,
                                                                                            }
                                                                                        )
                                                                                    },
                                                                                    500
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'Warehouse'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        {this.state
                                                                            .loadWarehouse ? (
                                                                            <Warehouse
                                                                                estimation={this.state.estimation}
                                                                                owner_id={
                                                                                    element.owner_id ? element.owner_id : this
                                                                                        .state
                                                                                        .owner_id
                                                                                }
                                                                                onChange={(
                                                                                    value
                                                                                ) => {
                                                                                    this.setValues(
                                                                                        'warehouse_id',
                                                                                        value
                                                                                    )
                                                                                }}
                                                                                required={
                                                                                    element.required
                                                                                }
                                                                            />
                                                                        ) : null}
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'MainSupplier'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <MainSupplier
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'mainSupplier',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'DateSelect'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <DateSelect
                                                                            placeholder={
                                                                                element.placeholder
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    element.eventName,
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }

                                                            if (
                                                                element.name ==
                                                                'StringSearch'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={
                                                                            element.size
                                                                                ? element.size
                                                                                : 6
                                                                        }
                                                                    >
                                                                        <StringSearch
                                                                            placeholder={
                                                                                element.placeholder
                                                                            }
                                                                            name={
                                                                                element.eventName
                                                                            }
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                let filterData =
                                                                                    this
                                                                                        .state
                                                                                        .filterData
                                                                                filterData[
                                                                                    element.eventName
                                                                                ] =
                                                                                    value

                                                                                this.setState(
                                                                                    {
                                                                                        filterData:
                                                                                            filterData,
                                                                                    }
                                                                                )
                                                                            }}
                                                                            validators={
                                                                                element.validators
                                                                                    ? element.validators
                                                                                    : []
                                                                            }
                                                                            errorMessages={
                                                                                element.errorMessages
                                                                                    ? element.errorMessages
                                                                                    : []
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'GrnStatus'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <GrnStatus
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'grn_item_status',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }

                                                            if (
                                                                element.name ==
                                                                'Status'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Status
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'status',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }

                                                            if (
                                                                element.name ==
                                                                'OrderCategory'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <OrderCategory
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'type',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'DebitNoteTypesSubTypes'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={
                                                                            element.size
                                                                                ? element.size
                                                                                : 3
                                                                        }
                                                                    >
                                                                        <DebitNoteTypes
                                                                            onChange={(
                                                                                type,
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    type,
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }

                                                            if (
                                                                element.name ==
                                                                'Manufacturer'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Manufacture
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'manufacture_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name == 'Item'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <Item
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    'item_id',
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                            if (
                                                                element.name ==
                                                                'YesNo'
                                                            ) {
                                                                return (
                                                                    <Grid
                                                                        key={index}
                                                                        item
                                                                        xs={12}
                                                                        md={3}
                                                                    >
                                                                        <YesNoDrop
                                                                            onChange={(
                                                                                value
                                                                            ) => {
                                                                                this.setValues(
                                                                                    element.eventName,
                                                                                    value
                                                                                )
                                                                            }}
                                                                            required={
                                                                                element.required
                                                                            }
                                                                            label={element.label}
                                                                            placeholder={element.placeholder}
                                                                        />
                                                                    </Grid>
                                                                )
                                                            }
                                                        }
                                                    )}
                                                </Grid>


                                            </Grid>

                                            {this.state.filterFields.length > 0 && (
                                                <Grid item xs={12}>
                                                    <Grid container spacing={1} justifyContent='flex-end'>
                                                        {/* <Grid item xs={12} md={2}>
                                                            <LoonsButton
                                                                className="mt-2 w-full py-2"
                                                                progress={
                                                                    this.state
                                                                        .progressBtnprint
                                                                }
                                                                type="button"
                                                                onClick={() => this.handleClickPrint()}
                                                                scrollToTop={true}
                                                                color="primary"
                                                                startIcon="print"

                                                            >
                                                                <span className="capitalize">
                                                                    Print Report
                                                                </span>
                                                            </LoonsButton>
                                                        </Grid> */}
                                                        <Grid item xs={12} md={2}>
                                                            <LoonsButton
                                                                className="mt-2 w-full py-2"
                                                                progress={
                                                                    this.state
                                                                        .progressBtn
                                                                }
                                                                type="submit"
                                                                onClick={() => this.setState({
                                                                    viewReportBtn: false
                                                                })}
                                                                scrollToTop={true}
                                                                color="secondary"
                                                                startIcon="file_download"

                                                            >
                                                                <span className="capitalize">
                                                                    Download Report
                                                                </span>
                                                            </LoonsButton>
                                                        </Grid>

                                                        <Grid item xs={12} md={2}>
                                                            <LoonsButton
                                                                startIcon="remove_red_eye"
                                                                className="mt-2 w-full py-2 button-info"
                                                                progress={
                                                                    this.state
                                                                        .btnProgress
                                                                }
                                                                type="submit"
                                                                scrollToTop={true}
                                                                onClick={() => this.setState({
                                                                    viewReportBtn: true
                                                                })}
                                                            >
                                                                <span className="capitalize">
                                                                    View Report
                                                                </span>
                                                            </LoonsButton>

                                                        </Grid>


                                                    </Grid>
                                                </Grid>
                                            )}

                                            {this.state.viewReport ? (
                                                this.state.htmlContent ? (
                                                    <Grid item xs={12} className="mt-4">
                                                        <Grid
                                                            container
                                                            spacing={1}
                                                            className="bg-light-primary border-radius-4 p-4"
                                                        >
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                className="flex justify-end"
                                                            >
                                                                <LoonsButton
                                                                    className="p-3 mx-2"
                                                                    progress={
                                                                        this.state
                                                                            .progressBtnprint
                                                                    }
                                                                    type="button"
                                                                    onClick={() => this.handleClickPrint()}
                                                                    scrollToTop={true}
                                                                    color="primary"
                                                                    startIcon="print"

                                                                >
                                                                    <span className="capitalize">
                                                                        Print Report
                                                                    </span>
                                                                </LoonsButton>
                                                                <ButtonGroup
                                                                    variant="contained"
                                                                    color="primary"
                                                                    ref={this.anchorRef}
                                                                    aria-label="split button"
                                                                >
                                                                    <LoonsButton
                                                                        className="w-full"
                                                                        progress={
                                                                            this.state
                                                                                .downloadBtnProgress
                                                                        }
                                                                        onClick={
                                                                            this
                                                                                .handleClick
                                                                        }
                                                                        scrollToTop={
                                                                            false
                                                                        }
                                                                    >
                                                                        {
                                                                            options[
                                                                            selectedIndex
                                                                            ]
                                                                        }
                                                                    </LoonsButton>

                                                                    <Button
                                                                        color="primary"
                                                                        size="small"
                                                                        aria-controls={
                                                                            open
                                                                                ? 'split-button-menu'
                                                                                : undefined
                                                                        }
                                                                        aria-expanded={
                                                                            open
                                                                                ? 'true'
                                                                                : undefined
                                                                        }
                                                                        aria-label="select merge strategy"
                                                                        aria-haspopup="menu"
                                                                        onClick={
                                                                            this
                                                                                .handleToggle
                                                                        }
                                                                    >
                                                                        <ArrowDropDownIcon />
                                                                    </Button>
                                                                </ButtonGroup>
                                                                <Popper
                                                                    open={open}
                                                                    anchorEl={
                                                                        this.anchorRef
                                                                            .current
                                                                    }
                                                                    role={undefined}
                                                                    transition
                                                                    disablePortal
                                                                >
                                                                    {({
                                                                        TransitionProps,
                                                                        placement,
                                                                    }) => (
                                                                        <Grow
                                                                            {...TransitionProps}
                                                                            style={{
                                                                                transformOrigin:
                                                                                    placement ===
                                                                                        'bottom'
                                                                                        ? 'center top'
                                                                                        : 'center bottom',
                                                                            }}
                                                                        >
                                                                            <Paper>
                                                                                <ClickAwayListener
                                                                                    onClickAway={
                                                                                        this
                                                                                            .handleClose
                                                                                    }
                                                                                >
                                                                                    <MenuList id="split-button-menu">
                                                                                        {options.map(
                                                                                            (
                                                                                                option,
                                                                                                index
                                                                                            ) => (
                                                                                                <MenuItem
                                                                                                    key={
                                                                                                        option
                                                                                                    }
                                                                                                    selected={
                                                                                                        index ===
                                                                                                        selectedIndex
                                                                                                    }
                                                                                                    onClick={(
                                                                                                        event
                                                                                                    ) =>
                                                                                                        this.handleMenuItemClick(
                                                                                                            event,
                                                                                                            index
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        option
                                                                                                    }
                                                                                                </MenuItem>
                                                                                            )
                                                                                        )}
                                                                                    </MenuList>
                                                                                </ClickAwayListener>
                                                                            </Paper>
                                                                        </Grow>
                                                                    )}
                                                                </Popper>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <div
                                                                    className="overflow-auto h-full-screen"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: this
                                                                            .state
                                                                            .htmlContent,
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid item xs={12}>
                                                        <div
                                                            className={clsx(
                                                                'flex flex-column items-center justify-center border-color-primary  border-radius-4 p-4'
                                                            )}
                                                            style={{
                                                                border: '1px solid ',
                                                            }}
                                                        >
                                                            <div className="p-8 flex justify-center items-center">
                                                                <img
                                                                    className="w-200"
                                                                    src="/assets/images/data_not_found.jpg"
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <Typography className="title text-primary text-center font-medium">
                                                                {' '}
                                                                An issue occurred during
                                                                the report generation
                                                                process!{' '}
                                                            </Typography>
                                                        </div>
                                                    </Grid>
                                                )
                                            ) : this.state.btnProgress ? (
                                                <Grid item xs={12} className="mt-4">
                                                    <div
                                                        className={clsx(
                                                            'flex flex-column items-center justify-center border-color-primary  border-radius-4 p-4'
                                                        )}
                                                        style={{ border: '1px solid ' }}
                                                    >
                                                        <div className="p-8 flex justify-center items-center">
                                                            <img
                                                                className="w-100"
                                                                src="/assets/images/data_loding.jpg"
                                                                alt=""
                                                            />
                                                        </div>

                                                        <Typography className="title text-primary text-center font-medium">
                                                            We are currently in the
                                                            process of generating the
                                                            report.
                                                            <br /> Your patience is
                                                            greatly appreciated.
                                                        </Typography>
                                                    </div>
                                                </Grid>
                                            ) : null}
                                        </> :
                                        <Grid item xs={12} className="mt-4">
                                            <div
                                                className={clsx(
                                                    'flex flex-column items-center justify-center border-color-primary  border-radius-4 p-4'
                                                )}
                                                style={{ border: '1px solid ' }}
                                            >
                                                <div className="p-8 flex justify-center items-center">
                                                    <img
                                                        className="w-100"
                                                        src="/assets/images/data_loding.jpg"
                                                        alt=""
                                                    />
                                                </div>

                                                <Typography className="title text-primary text-center font-medium">
                                                    Report not found.

                                                </Typography>
                                            </div>
                                        </Grid>
                                    }

                                </Grid>
                            ) : (
                                <Grid
                                    container
                                    className="flex w-full items-center justify-center"
                                >
                                    <CircularProgress />
                                </Grid>
                            )}
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
                <iframe id="printFrame" style={{ display: "none" }}></iframe>
            </div>
        )
    }
}

export default ReportComponent
