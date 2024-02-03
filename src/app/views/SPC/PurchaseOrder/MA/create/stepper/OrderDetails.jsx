import React, { useState, useContext, useEffect } from 'react'
import Button from 'app/components/LoonsLabComponents/Button'
import {
    Grid,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Checkbox,
    FormGroup
} from '@material-ui/core'
import {
    MainContainer,
    SubTitle,
    DatePicker,
} from 'app/components/LoonsLabComponents'
import { PageContext } from '../PageContext'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm, LoonsSnackbar } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import * as appconst from 'appconst'
import PrescriptionService from "app/services/PrescriptionService";
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import SPCServices from 'app/services/SPCServices'
import { dateParse, roundDecimal } from 'utils'
import { isNull, isUndefined } from 'lodash'

const selectionData = {
    bank: [
        {
            id: 1,
            label: 'BOC',
            bankName: 'BANK OF CEYLON-TRADE SERVICES-CORPORATE BRANCH',
            addressLine1: '2nd floor,Head Office "BOC Square",',
            addressLine2: 'No.1 Bank of Cyelon Mawatha,Colombo 01',
            addressLine3: 'Sri Lanka',
        },
        {
            id: 2,
            label: 'COMB',
            bankName: 'BCOMMERCIAL BANK OF CEYLON PLC(REG NO.PQ116),',
            addressLine1: 'FOREIGN BRANCH,Commercial House, No 21,',
            addressLine2: 'Sri Razik Fareed Mawatha,P.O.Box 853, Colombo 01,',
            addressLine3: 'Sri Lanka',
        },
        {
            id: 3,
            label: 'PEOB',
            bankName: "PEOPLE'S BANK , International Banking Division",
            addressLine1: 'No.91, All Ceylon Hindu Congress (ACHC) Building',
            addressLine2: 'Sir Chittampalam  A  Gardiner Mw,Colombo 02',
            addressLine3: 'Sri Lanka',
        },
    ],
}
// TODO: refactor auto complite default value
export default function OrderDetails({ POData }) {
    const [pageData, setPageData] = useContext(PageContext)
    const [POType, setPOType] = useState(POData.current.intend?.POType || 'L')
    const [suppplierDetails, setSupplierDetails] = useState(POData.current.intend?.suppplierDetails)
    const [procurementAgent, setProcurementAgent] = useState(POData.current.intend?.procurementAgent)
    const [currency, setCurrency] = useState(POData.current.intend?.currency)
    const [currencyDate, setCurrencyDate] = useState(POData.current.intend?.currencyDate || null)
    const [modeOfDispatch, setModeOfDispatch] = useState(POData.current.intend?.modeOfDispatch ? POData.current.intend?.modeOfDispatch : [])
    const [tenderNo, setTender] = useState(POData.current.intend?.tenderNo)
    const [paymentTerms, setPaymentTerms] = useState(POData.current.intend?.paymentTerms)
    const [quotedUnitPrice, setQuotedUnitPrice] = useState(POData.current.intend?.quotedUnitPrice)
    const [incoTerms, setIncoTerms] = useState(POData.current.intend?.incoTerms)
    const [HSCode, setHSCode] = useState(POData.current.intend?.HSCode)
    const [intentNo, setIntentNo] = useState(POData.current.intend?.intentNo)
    const [localAgent, setLocalAgent] = useState(POData.current.intend?.localAgent || null)
    const [importLicenseNo, setImportLicenseNo] = useState('')
    const [validUpTo, setValidUpTo] = useState(POData.current.intend?.currencyDate || null)
    const [exchangeRate, setExchangeRate] = useState(POData.current.intend?.exchangeRate || null)
    const [bank, setBank] = useState(null)
    const [isAddBankDetails, setIsAddBankDetails] = useState(false)
    const [supplierList, setSupplierList] = useState([])
    const [agentList, setAgentList] = useState([])
    const [bankList, setBankList] = useState([])
    const [localAgentList, setLocalAgentList] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {

        if (POData.current.intend?.bankDetails) {
            let bankDetails = POData.current.intend.bankDetails

            if (bankDetails.bank || bankDetails.importLicenseNo || bankDetails.validUpTo) {

                setBank(bankDetails.bank)
                setImportLicenseNo(bankDetails.importLicenseNo)
                setValidUpTo(bankDetails.validUpTo)
                setIsAddBankDetails(true)
            }
        }
        // TODO: check maximum count
        const getAllAgents = async () => {
            const param = { limit: 20, page: 0, }
            const res = await PrescriptionService.getAllAgents(param)
            const { data } = res.data.view
            setAgentList(data);

            if (isNull(procurementAgent) || isUndefined(procurementAgent)) {
                setProcurementAgent(data.find(item => item.name === "SPC"));
            }
        }

        // TODO: check maximum count
        // const getAllLocalAgents = async () => {
        //     const param = { limit: 20, page: 0, }
        //     let res = await HospitalConfigServices.getAllLocalAgents(param)
        //     const { data } = res.data.view
        //     setLocalAgentList(data);
        // }

        // const getAllBanks = async () => {
        //     const param = { limit: 20, page: 0, }
        //     let res = await SPCServices.getAllBanks(param)
        //     const { data } = res.data.view
        //     setBankList(data);
        // }

        // getAllLocalAgents()
        getAllAgents()
        // getAllBanks()
    }, [])

    const loadAllSuppliers = (search) => {
        let params = { search: search }
        if (search.length > 2) {
            HospitalConfigServices.getAllSuppliers(params)
                .then((res) => {
                    setSupplierList(res.data.view.data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:',
                        err
                    )
                })
        }

    }
    const getAllBanks = (search) => {
        let params = { search: search }
        if (search.length > 2) {
            SPCServices.getAllBanks(params)
                .then((res) => {
                    setBankList(res.data.view.data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:',
                        err
                    )
                })
        }
    }

    const loadAllLocalAgents = (search) => {
        let params = { search: search }
        if (search.length > 2) {
            HospitalConfigServices.getAllLocalAgents(params)
                .then((res) => {
                    setLocalAgentList(res.data.view.data)
                })
                .catch((err) => {
                    console.log(
                        '🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:',
                        err
                    )
                })
        }
    }

    const handleModeChange = (event) => {
        const { value } = event.target;
        setModeOfDispatch(prevSelectedModes => {
            if (prevSelectedModes.includes(value)) {
                return prevSelectedModes.filter(mode => mode !== value);
            } else {
                return [...prevSelectedModes, value];
            }
        });
    };

    const saveData = () => {
        POData.current.intend = {
            POType,
            suppplierDetails,
            procurementAgent,
            currency,
            modeOfDispatch,
            tenderNo,
            paymentTerms,
            quotedUnitPrice,
            incoTerms,
            HSCode,
            intentNo,
            localAgent,
            exchangeRate,
            currencyDate,
            PONumber: '',
            orderNo: pageData.orderNo,
            orderId: pageData.orderId,
            bankDetails: { importLicenseNo, validUpTo, bank },
        }

    }

    const handleNext = () => {
        saveData()
        const tempPageData = { ...pageData, activeStep: 1 }
        setPageData(tempPageData)
    }

    const removeBankDetails = () => {
        setImportLicenseNo('')
        setValidUpTo(null)
        setBank(null)
        setIsAddBankDetails(false)
    }

    const updateData = () => {
        saveData()
        setSaving(true)
    }

    return (
        <MainContainer>
            <ValidatorForm onSubmit={handleNext}>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <p style={{ margin: 0 }}>MSD Order List No : {pageData.orderNo}</p>
                    </Grid>
                    {/* <Grid item lg={6} md={6} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={updateData}
                        >
                            save
                        </Button>
                    </Grid> */}
                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Indent Number" />
                            <TextValidator
                                disabled={pageData.isPosted}
                                fullWidth
                                placeholder="Indent Number"
                                name="indentNumber"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={intentNo || ''}
                                onChange={(e) => setIntentNo(e.target.value)}
                            // validators={['required']}
                            // errorMessages={['this field is required']}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="PO Type" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                value={POType ? { label: POType } : null}
                                options={appconst.po_type}
                                onChange={(event, value) => {
                                    setPOType(value?.label)

                                }}
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    option.label === value.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="PO Type"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={POType}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Payment Terms" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={appconst.payment_term}
                                value={paymentTerms ? paymentTerms : null}
                                onChange={(event, value) => {
                                    setPaymentTerms(value)
                                }}
                                getOptionLabel={(option) =>
                                    `${option?.label} - ${option?.name}`
                                }
                                getOptionSelected={(option, value) => option.label === value.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Payment Terms"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={paymentTerms?.label}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Supplier Name" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={supplierList}
                                value={suppplierDetails ? suppplierDetails : null}
                                onChange={(event, value) => {
                                    if (value) {
                                        setSupplierDetails(value)
                                        console.log("Supplier :", value)
                                    }
                                }}
                                getOptionLabel={(option) =>
                                    `${option?.name} - ${option?.registartion_no ? option?.registartion_no : "N/A"} - ${option?.address ? option?.address : "N/A"}`
                                }
                                getOptionSelected={(option, value) => option.name === value.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Supplier Name (Type 3 Letters)"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={suppplierDetails?.name}
                                        onChange={(event) => {
                                            loadAllSuppliers(event.target.value)
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'This Field is Required',
                                        ]}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Supplier Code & Address" />
                            <p style={{ margin: '5px' }}>
                                Supplier Code :{' '}
                                {suppplierDetails?.registartion_no
                                    ? suppplierDetails?.registartion_no
                                    : 'N/A'}
                            </p>
                            <p style={{ margin: '5px' }}>
                                Supplier Name :{' '}
                                {suppplierDetails?.name
                                    ? suppplierDetails?.name
                                    : 'N/A'}
                            </p>
                            <p style={{ margin: '5px' }}>
                                Supplier Address :{' '}
                                {suppplierDetails?.address
                                    ? suppplierDetails?.address
                                    : 'N/A'}
                            </p>
                        </FormControl>
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Tender Number" />
                            <TextValidator
                                disabled={pageData.isPosted}
                                fullWidth
                                placeholder="Tender Number"
                                name="tenderNumber"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={tenderNo || ''}
                                onChange={(e) => setTender(e.target.value)}
                            // validators={['required']}
                            // errorMessages={['this field is required']}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Inco Terms" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={appconst.inco_terms}
                                value={incoTerms ? { label: incoTerms } : null}
                                onChange={(event, value) => {
                                    setIncoTerms(value?.label)
                                }}
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    option.label === value.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Inco Terms"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={incoTerms}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Procurement Agent" />

                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={agentList}
                                onChange={(event, value) => {
                                    if (value) {
                                        setProcurementAgent(value)
                                        console.log("Procurement Agent :", value)
                                    }
                                }}
                                value={procurementAgent ? procurementAgent : null}
                                getOptionLabel={(option) => option.name}
                                getOptionSelected={(option, value) =>
                                    option.name === value.name
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Procurement Agent"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={procurementAgent?.name}
                                    // onChange={(event) => {
                                    //     loadAllAgents(event.target.value)
                                    // }}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>

                        {POType === 'F' && (<FormControl className="w-full">
                            <SubTitle title="Local Agent" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={localAgentList}
                                value={localAgent ? localAgent : null}
                                onChange={(event, value) => {
                                    if (value) {
                                        setLocalAgent(value)
                                        console.log("Local Agent :", value)
                                    }
                                }}
                                getOptionLabel={(option) => option.name}
                                getOptionSelected={(option, value) =>
                                    option.name === value.name
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Local Agent (Type 3 Letters)"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={localAgent?.name}
                                        onChange={(event) => {
                                            loadAllLocalAgents(event.target.value)
                                        }}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>)}
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Currency" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={appconst.all_currencies}
                                value={currency ? currency : null}
                                getOptionLabel={(option) => option.cc}
                                onChange={(event, value) => {
                                    if (value?.cc === "LKR") {
                                        setExchangeRate('1');
                                    }
                                    setCurrency(value)
                                }}
                                getOptionSelected={(option, value) =>
                                    option.cc === value.cc
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Currency"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={currency?.cc}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl className="w-full">
                            <SubTitle title="Exchange Rate" />
                            <TextValidator
                                disabled={pageData.isPosted || currency?.cc === "LKR"}
                                fullWidth
                                placeholder="Exchange Rate"
                                name="exchangeRate"
                                InputLabelProps={{
                                    shrink: false,
                                }}
                                type="text"
                                variant="outlined"
                                size="small"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(e.target.value)}
                                validators={['isFloat', 'minNumber: 0']}
                                errorMessages={['Invalid Format', 'Qty Should be Greater - than: 0']}
                            />
                        </FormControl>

                        <FormControl className="w-full">
                            <SubTitle title="Currency Date" />
                            <DatePicker
                                disabled={pageData.isPosted}
                                className="w-full"
                                value={currencyDate}
                                variant="outlined"
                                placeholder="Currency Date"
                                onChange={(date) => {
                                    setCurrencyDate(date || null)
                                }}
                            />
                        </FormControl>
                        <FormControl className="w-full">
                            <SubTitle title="Quoted Unit Price" />
                            <Autocomplete
                                disabled={pageData.isPosted}
                                className="w-full"
                                options={appconst.quoted_unit_price}
                                value={
                                    quotedUnitPrice
                                        ? { label: quotedUnitPrice }
                                        : null
                                }
                                onChange={(event, value) => {
                                    setQuotedUnitPrice(value?.label)
                                }}
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    option.label === value.label
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        disabled={pageData.isPosted}
                                        {...params}
                                        placeholder="Quoted Unit Price"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={quotedUnitPrice}
                                    // validators={['required']}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                        </FormControl>

                        {POType === 'F' && (
                            <FormControl className="w-full">
                                <SubTitle title="Mode of Dispatch" />
                                <FormControl component="fieldset">
                                    {/* <RadioGroup
                                        name="category"
                                        value={modeOfDispatch || ''}
                                        onChange={(e) =>
                                            setModeOfDispatch(e.target.value)
                                        }
                                        style={{ display: 'block' }}
                                    >
                                        <FormControlLabel
                                            value="Sea"
                                            control={<Radio />}
                                            label="Sea"
                                        />
                                        <FormControlLabel
                                            value="Air"
                                            control={<Radio />}
                                            label="Air"
                                        />
                                        <FormControlLabel
                                            value="Sea & Air"
                                            control={<Radio />}
                                            label="Sea & Air"
                                        />
                                    </RadioGroup> */ }
                                    <FormGroup style={{ display: "block" }}>
                                        <FormControlLabel
                                            control={<Checkbox disabled={pageData.isPosted} checked={modeOfDispatch.includes('Sea')} onChange={handleModeChange} value="Sea" />}
                                            label="Sea"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox disabled={pageData.isPosted} checked={modeOfDispatch.includes('Air')} onChange={handleModeChange} value="Air" />}
                                            label="Air"
                                        />
                                        {/* <FormControlLabel
                                            control={<Checkbox checked={selectedModes.includes('Sea & Air')} onChange={handleModeChange} value="Sea & Air" />}
                                            label="Sea & Air"
                                        /> */}
                                    </FormGroup>
                                </FormControl>
                            </FormControl>
                        )}

                        {POType === 'F' && (
                            <FormControl className="w-full">
                                <SubTitle title="HS Code" />
                                <TextValidator
                                    disabled={pageData.isPosted}
                                    fullWidth
                                    placeholder="HS Code"
                                    name="HSCode"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={HSCode || ''}
                                    onChange={(e) => setHSCode(e.target.value)}
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </FormControl>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <p>Bank Details</p>
                        {!isAddBankDetails && (
                            <Button
                                disabled={pageData.isPosted}
                                variant="outlined"
                                color="primary"
                                onClick={() => setIsAddBankDetails(true)}
                                startIcon={<AccountBalanceIcon />}
                            >
                                Add Bank Details
                            </Button>
                        )}

                        {isAddBankDetails && (
                            <Button
                                disabled={pageData.isPosted}
                                variant="outlined"
                                onClick={removeBankDetails}
                                startIcon={<AccountBalanceIcon />}
                            >
                                Remove Bank Details
                            </Button>
                        )}
                    </Grid>

                    {isAddBankDetails && (
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Import LicenseNo" />
                                <TextValidator
                                    disabled={pageData.isPosted}
                                    fullWidth
                                    placeholder="Import License No"
                                    name="importLicensNo"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={importLicenseNo || ''}
                                    onChange={(e) =>
                                        setImportLicenseNo(e.target.value)
                                    }
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Valid Up To" />
                                <DatePicker
                                    disabled={pageData.isPosted}
                                    className="w-full"
                                    placeholder="Valid Up To"
                                    // required={true}
                                    format="dd/MM/yyyy"
                                    value={validUpTo || null}
                                    onChange={(date) => {
                                        setValidUpTo(date || null)
                                    }}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Bank" />
                                <Autocomplete
                                    disableClearable={false}
                                    disabled={pageData.isPosted}
                                    className="w-full"
                                    options={bankList}
                                    value={bank ? bank : null}
                                    onChange={(event, value) => {
                                        setBank(value)
                                    }}
                                    getOptionSelected={(option, value) =>
                                        option.label === value.label
                                    }
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextValidator
                                            disabled={pageData.isPosted}
                                            {...params}
                                            placeholder="Bank"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={bank ? bank.label : ''}
                                            onChange={(event) => {
                                                getAllBanks(event.target.value)
                                            }}
                                        // validators={['required']}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    )}
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
                                    className='mt-2'
                                    variant="contained"
                                    // color="4BB543"
                                    style={{
                                        backgroundColor: "#4BB543"
                                    }}
                                    endIcon='chevron_right'
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
