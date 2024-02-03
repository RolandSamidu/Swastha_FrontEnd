import React, { useState, useContext, useEffect } from 'react'
import {
    Grid,
    Tooltip,
    Typography,
    Chip,
    Breadcrumbs,
    Link,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    // CircularProgress,
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    SubTitle,
    DatePicker,
    // LoonsTable,
} from 'app/components/LoonsLabComponents'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { PageContext } from './PageContext'
import { TextareaAutosize } from '@mui/material'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from '@material-ui/lab'
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import * as appconst from 'appconst'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PrescriptionService from 'app/services/PrescriptionService'
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import RichTextEditor from 'react-rte'
import { convertTocommaSeparated } from 'utils'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'
import SaveIcon from '@material-ui/icons/Save';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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

const tempPayload = {
    intend: {
        POType: 'F',
        suppplierDetails: {
            id: '1f4ac765-0097-438d-859b-bb3c7400008c',
            name: 'LAB CHEM (PVT) LTD.,',
            contact_no: '',
            email: null,
            status: null,
            registartion_no: '094LABCH',
            address: null,
            type: null,
            company: '',
            country: '',
            fax_no: '459738',
            foriegn_domestic: null,
            createdAt: '2023-05-06T21:47:22.924Z',
            updatedAt: '2023-05-06T21:47:22.924Z',
        },
        procurementAgent: 'SPC',
        currency: {
            cc: 'USD',
            symbol: 'US$',
            name: 'United States Dollar',
        },
        modeOfDispatch: 'Sea',
        tenderNo: 'DHS/RS/EP/27/2022',
        paymentTerms: {
            label: 'C18',
            name: 'Combined LC 180 days',
        },
        quotedUnitPrice: 'C&F',
        incoTerms: 'C&F',
        HSCode: '1520',
        intentNo: 'LP/DHS/RS/EP/27/527KC/2022',
        localAgent: 'Local Agent',
        exchangeRate: '350',
        PONumber: '',
        orderNo: '2023/SPC/N/S/0046',
        bankDetails: {
            importLicenseNo: 'IM-1-450-2021-002151',
            validUpTo: '2023-06-30',
            bank: {
                id: 1,
                label: 'BOC',
                bankName: 'BANK OF CEYLON-TRADE SERVICES-CORPORATE BRANCH',
                addressLine1: '2nd floor,Head Office "BOC Square",',
                addressLine2: 'No.1 Bank of Cyelon Mawatha,Colombo 01',
                addressLine3: 'Sri Lanka',
            },
        },
    },
    ItemsDetails: [
        {
            itemData: {
                manufacture: {
                    id: '029e3e37-7bfe-4ec2-88d1-3eec3da5a6ab',
                    name: 'RMSD ADMIN',
                    contact_no: '0112344789',
                    email: 'rmsd@admin.com',
                    status: null,
                    registartion_no: null,
                    company: null,
                    country: null,
                    fax_no: null,
                    createdAt: '2023-04-17T09:12:54.698Z',
                    updatedAt: '2023-04-17T09:12:54.698Z',
                },
                countryOfOrigin: 'System Gen',
                price: '1500',
                unit: '',
                unitType: '',
                taxCode: '',
                taxPercentage: '',
                taxAmount: '',
                discount: '1',
                discountType: 'precentage',
                total: 1485,
                remark: 'test',
                shelfLife: '123',
                orderQuantity: '200',
                deliverySchedule: [
                    {
                        sheduleDate: '2023-06-30',
                        deliveryLocation: '',
                        quantity: '200',
                    },
                ],
                packingDetails: [
                    {
                        packSize: '12',
                        UOM: 'BOX',
                        quantity: '',
                        conversion: '12',
                        minPackFactor: false,
                        storingLevel: false,
                    },
                    {
                        packSize: '1',
                        UOM: 'CAN',
                        quantity: 0,
                        conversion: '',
                        minPackFactor: false,
                        storingLevel: false,
                    },
                ],
            },
            rowData: {
                id: '62399d4b-ea26-40f5-9b7e-4b2d755c46e5',
                order_list_item_id: '028b5d9e-ccb1-44da-a82e-cf4655435361',
                quantity: '40000',
                status: 'Active',
                allocated_quantity: '0',
                schedule_date: '2023-05-31T00:00:00.000Z',
                standard_cost: '197.6',
                createdAt: '2023-05-29T07:13:44.353Z',
                updatedAt: '2023-05-29T07:13:44.353Z',
                OrderListItem: {
                    id: '028b5d9e-ccb1-44da-a82e-cf4655435361',
                    order_list_id: '6174c8e9-11e5-4f32-a65f-e78c48577b48',
                    item_id: '7b200bdd-56b1-472e-b5de-f0344ae1fc4a',
                    quantity: '40000',
                    status: 'Active',
                    standard_cost: '197.6',
                    order_date: '2023-05-29T00:00:00.000Z',
                    order_date_to: '2023-11-29T00:00:00.000Z',
                    type: 'Normal Order',
                    allocated_quantity: '0',
                    msd_quantity: '0',
                    msd_stock_days: null,
                    due_order_quantity: null,
                    institutional_quantity: '0',
                    annual_estimation: '0',
                    requirement_from: '2023-05-29T00:00:00.000Z',
                    pack_size: null,
                    requirement_to: '2023-11-29T00:00:00.000Z',
                    forecast_quantity: '2000',
                    estimation_next_year: '0',
                    expected_availability: null,
                    deficit: '2000',
                    total_calculated_cost: '7904000',
                    remark: null,
                    createdAt: '2023-05-29T07:13:44.343Z',
                    updatedAt: '2023-05-29T07:13:44.343Z',
                    OrderList: {
                        id: '6174c8e9-11e5-4f32-a65f-e78c48577b48',
                        order_no: '2023/SPC/N/S/0046',
                        estimation_id: null,
                        agent_id: 'f42f168f-2f28-428c-a0fd-5cb25857eeee',
                        status: 'APPROVED',
                        type: 'Normal Order',
                        created_by: 'c135c338-bcae-4cca-b0ec-d981870f6d76',
                        order_date: '2023-05-29T00:00:00.000Z',
                        order_date_to: '2023-11-29T00:00:00.000Z',
                        category_id: '3b20f700-4a73-4484-90b4-1d037f3b1664',
                        no_of_items: 1,
                        estimated_value: '7904000',
                        order_for_year: '2023',
                        item_type_id: null,
                        createdAt: '2023-05-29T07:13:44.339Z',
                        updatedAt: '2023-05-29T07:15:00.259Z',
                        Estimation: null,
                        Agent: {
                            id: 'f42f168f-2f28-428c-a0fd-5cb25857eeee',
                            name: 'SPC',
                            type: 'SPC',
                            status: 'Active',
                            createdAt: '2022-11-08T10:27:26.902Z',
                            updatedAt: '2023-04-30T16:59:16.143Z',
                        },
                        Category: {
                            id: '3b20f700-4a73-4484-90b4-1d037f3b1664',
                            code: 'S',
                            description: 'Surgical',
                            status: 'Active',
                            createdAt: '2022-08-03T16:07:28.051Z',
                            updatedAt: '2022-08-03T16:07:28.051Z',
                        },
                        Employee: {
                            id: 'c135c338-bcae-4cca-b0ec-d981870f6d76',
                            name: 'MSD SCO Surgical',
                            status: 'Active',
                            designation: 'MSD SCO Surgical',
                            type: 'MSD SCO',
                            employee_id: null,
                            nic: '',
                            contact_no: '12345678',
                            email: 'msd00@gmail.com',
                            address: 'MSD',
                            createdAt: '2023-05-29T05:01:06.290Z',
                            updatedAt: '2023-05-29T05:01:06.290Z',
                        },
                    },
                    ItemSnap: {
                        id: '7b200bdd-56b1-472e-b5de-f0344ae1fc4a',
                        sr_no: '18506104',
                        short_description:
                            'Bracket MBT .022 twin LowerCani/Right',
                        medium_description:
                            'Bracket MBT .022 twin LowerCani/Right ',
                        long_description:
                            'Bracket MBT .022 twin LowerCani/Right',
                        strength: null,
                        specification:
                            'Bracket, MBT type system 0.022, twin lower canine with hook, Right.',
                        nearest_round_up_value: null,
                        critical: null,
                        primary_wh: '38167fe2-c29c-46d0-b95a-e201e0f23e0e',
                        stock_id: null,
                        condition_id: null,
                        abc_class_id: null,
                        storage_id: null,
                        batch_trace_id: null,
                        cyclic_code_id: null,
                        movement_type_id: null,
                        shelf_life_id: null,
                        shelf_life: null,
                        standard_cost: '197.6',
                        standard_shelf_life: null,
                        ven_id: 'bd77a1af-f206-4582-a3e5-f551fa5cd294',
                        serial_id: 'e2a5a7e9-1cf5-4ac4-95bb-bfc9546de881',
                        item_unit_size: null,
                        previous_sr: null,
                        previous_system_sr: null,
                        item_type_id: null,
                        item_usage_type_id:
                            '397b0181-2eca-43dc-8987-b9c11fe54abd',
                        virtual_item_id: null,
                        type: 'Permanent',
                        owner_id: '000',
                        used_for_estimates: 'N',
                        used_for_formulation: 'N',
                        formulatory_approved: 'N',
                        status: 'Active',
                        priority: 'No',
                        createdAt: '2022-12-09T15:34:40.834Z',
                        updatedAt: '2022-12-09T15:34:40.834Z',
                    },
                },
                assing: true,
            },
        },
    ],
    OthersGeneral: {
        conversion: '0',
        freightChargers: '0',
        handlAndPackagingCharge: '0',
        otherCharge: '0',
        commission: '0',
        grandTotal: 1485,
        subTotal: 1485,
    },
    noteAndAttachment: {
        note: '<p><strong>* A Performance Bond for 10% of the total order value to be submitted, with in 03 days from the</strong></p>\n<p><strong>Indent with validity up to 03 months from the delivery date.</strong></p>\n<p><strong>* A contract has to be signed in terms of tender condition.</strong></p>\n<p><strong>The quality of the product should be as per the samples.</strong></p>',
    },
    conditions:
        '<p>1. The consignments supplied in respect of an order concerned, shall exactly match with the reference sample submitted and the product information (item descriptions, shelf life/warranty where applicable,manufacturer’s name, country of manufacture, country of origin, etc.) provided in the bid document by the supplier, which has been accepted by the procurement committee, and included in the Indent / Purchase Order (PO), issued by SPC.</p>\n<p>2. All items shall be supplied, sourcing from the manufacturer and country of manufacturer, stated in the Purchase Order (PO)/Indent of SPC and wherever applicable shall have a valid product registration or waiver of registration from NMRA.</p>\n<p>3. Maintaining the validity of the product registration during the period of supply(delivery schedule), obtaining waiver of registration &amp;amp;/ import license / manufacture licensing at NMRA, is a pre-requisite for the supply of surgical, pharmaceutical and relevant laboratory items. Hence all suppliers shall produce relevant valid registration certificates/licenses, when requested by MSD/SPC. When the validity of the &nbsp;duct/manufacturing licenses and registrations of NMRA (eg; manufacturing</p>\n<p>license, product registration and GMP certificates), of local manufacturers / local suppliers, lapses during</p>\n<p>the year or during the period of supply (delivery schedule), it shall be extended / renewed by the</p>\n<p>supplier. A certified copies of afore mentioned valid certificates shall be submitted to MSD by the</p>\n<p>supplier when deliveries are made.</p>\n<p>4. The number of batches per consignment shall be minimal. Batch quantity shall be an equal multiple of</p>\n<p>the quantity of the consignment and the proportionate size of the batch quantity shall be not less than</p>\n<p>15% of the quantity in the consignment.</p>\n<p>5. If MSD decides to accept a part or full consignment, with deviations from certain tender conditions (eg:</p>\n<p>with regard to labeling/packaging etc.) due to an urgency, that shall be done subject to, either rectifying</p>\n<p>the defect within 05 working days by the supplier, or recovering the total cost [a] of rectifying the defect</p>\n<p>by MSD (via a duly contracted third party providing such services), from the supplier with a 25%</p>\n<p>surcharge on the labeling cost. (total charge = [a]+[a]x0.25) or 2% of the invoiced value, whichever is</p>\n<p>the highest.</p>\n<p>All possible tender deviations such as Packing, labeling, delivery schedule, storage status, payment mode</p>\n<p>&amp;amp; conditions, etc., shall be communicated and agreed upon before accepting the tender award by the</p>\n<p>supplier. Noncompliance of same shall be considered as tender violations, to apply penalty(as clause No.</p>\n<p>37).</p>\n<p>6. The specifications of the product offered in the bid, by the supplier shall match with the tender</p>\n<p>specifications for the item and any form of alternate offers will not be entertained.</p>\n<p>Shelf life &amp;amp; Warrantees</p>\n<p>7. Not applicable for Surgical Consumable items</p>\n<p>8. Freshly manufactured stocks of the product shall be supplied; thereby the residual Shelf Life (shelf life</p>\n<p>remaining at the time of delivery of goods in Sri Lanka/MSD stores in case of local supplies) of the</p>\n<p>product, shall be 85% of the shelf life requested(specified in order/Indent/PO).</p>\n<p>In respect of the items with requested shelf life equal or more than 24 months, any deficit between the</p>\n<p>residual shelf life and requested shelf life, shall not be more than 04 months.</p>\n<p><br></p>\n<p>In the violation of the above tender condition, SPC/MSD reserves the right to accept a reduced quantity,</p>\n<p>that is usable (as per the consumption rate) up to three months before the expiry of same and will subject</p>\n<p>to application of a penalty (as clause No. 35 ).</p>\n<p>When the shelf life is not specified in the indent/PO/item spec; the requested shelf life shall be considered</p>\n<p>as, 36 months for surgical items and 24 months for pharma. / laboratory items.</p>\n<p>Standards &amp;amp; Quality</p>\n<p>9. Standards; In addition to Pharmacopoeial Standards that are indicated in the item specifications, other</p>\n<p>Pharmacopoeial Standards that are registered at National Medicines Regulatory Authority in Sri Lanka</p>\n<p>are also acceptable when no bidders have quoted for the standard specified in the item specification.</p>\n<p>10. Any product deficient of its sub components/ accessories, not at the specified quality standards or all its</p>\n<p>components not unitized appropriately in packaging (as a set), shall be rejected.</p>\n<p>11. Withdrawal from use of items due to quality failure found as manufacturer’s fault:</p>\n<p>(a). In case of batch withdrawal, value of entire batch quantity supplied shall be recovered from the</p>\n<p>supplier.</p>\n<p>(b).In case of product withdrawal, value of entire product quantity supplied shall be recovered from</p>\n<p>the supplier.</p>\n<p>(c). In the event of either a) or b) above, supplier shall be surcharged the total cost involved for MSD, of</p>\n<p>the quality failed supplies with 25% administrative surcharge of the same.</p>\n<p>12. The storage conditions and the packing requirements of the product shall conform to the information</p>\n<p>given by the manufacturer and accepted by NMRA for the product registration or shall conform to the</p>\n<p>information submitted for waiver of registration granted by NMRA in exceptional circumstances.(refer</p>\n<p>clause No.24)</p>\n<p>If the offered product, deviate from NMRA registered product features, supplier must provide with the bid,</p>\n<p>a declaration to certify the NMRA accepted product details such as; storage conditions, pack</p>\n<p>details/contents/sizes and standard batch quantity/size of the product.</p>\n<p>13. Immediately after delivery at MSD, the consignments shall be subjected to testing appropriately drawn,</p>\n<p>one random batch sample (Post-delivery sample) of the consignment at a government/semi-</p>\n<p>government/accredited laboratory.(to be selectively applied for Surgical &amp;amp; Lab items, depending on</p>\n<p>availability of testing methodology &amp;amp; facilities) If the sample is found to be substandard, random batch</p>\n<p>samples will be tested from all the batches/lots in the consignment, and entire expenses on such tests, like</p>\n<p>value of samples, transport, sampling &amp;amp; testing charges, etc, will be recovered from the supplier.</p>\n<p>14. Consignments supplied to MSD violating the storage conditions indicated on product labels and/or</p>\n<p>product information leaflet (as accepted for product registration at NMRA), shall be considered as quality</p>\n<p>affected consignments and quality assurance of such consignments shall be carried out by post-delivery</p>\n<p>testing at government / semi government laboratory in Sri Lanka or at an accredited laboratory</p>\n<p>(foreign/local). All the expenses on such an event, including storage cost shall be borne by the supplier. If</p>\n<p>found to be quality affected the consignment will be treated as quality failed (as clause No.11).</p>\n<p>Pack size, Labeling &amp;amp; Packaging</p>\n<p>15. Offers for pack sizes at a lower level(smaller quantity per pack) than the pack size specified in the item</p>\n<p>description/specification and MSD order List, are also acceptable, but higher level (larger quantity per</p>\n<p>pack) pack sizes will not be entertained unless otherwise offered with the original bid and accepted by the</p>\n<p>procurement committee, with the concurrence of MSD.</p>\n<p>16. Not applicable for Surgical Consumable items.</p>\n<p><br></p>\n<p>17. Each; innermost pack, vial/ampoule, pre-filled syringe or bottle, shall bear the item Description, SR No,</p>\n<p>Batch No/Lot no., Reference/Catalogue no.(not for pharmaceuticals), Date of Manufacture, Date of</p>\n<p>Expiry and “STATE LOGO” of Government of Sri Lanka.</p>\n<p>It is essential to include and exactly match the dates of Expiry &amp;amp; date of Manufacture (in any form as</p>\n<p>“Year &amp;amp; Month” or “No Exp.”), in the innermost pack and supplier’s invoice.</p>\n<p>18. Description of the Item, SR No, Date of Manufacture, Date of Expiry, Batch No, Name and address of</p>\n<p>manufacturer and “STATE LOGO” of Sri Lanka Government shall be clearly marked on the outer</p>\n<p>covering of the individual/innermost pack containing the minimum unit of measure, including blister &amp;amp;</p>\n<p>strip cards and on the outer cover of the carton/box. . Any deviations of the Date of</p>\n<p>Manufacture (DOM)/ Date of Expiry(DOE)declared in the offer shall be approved by MSD and DOM &amp;amp;</p>\n<p>DOE shall consist of at least the year &amp;amp; month.</p>\n<p>19. All outer most cartons (shipping packages) shall bear the MSD Purchase Order No, SPC Indent No., SR</p>\n<p>No, Batch No, and Date of Expiry in size 1.5cm letters / figures in prominently visible manner. This may</p>\n<p>be printed, stenciled or label properly affixed.</p>\n<p>20. Batch Number of the product shall be separately Barcoded (in Code 128 or 2D formats) and Barcode shall</p>\n<p>be printed on the labels at all levels of packing as described below, conforming to the industry standards</p>\n<p>in Barcode printing and pasting.</p>\n<p>Format shall be according to Code 128 or 2D standards.</p>\n<p>Maximum barcode size shall be 5.0cm (length) x 2.5cm (width).</p>\n<p>21. In case of receiving goods under inappropriate packaging conditions(not in good order), was to be sorted</p>\n<p>out by MSD to select the items in good order by 100% checking/handling of the consignment, all</p>\n<p>expenses incurred to MSD in such an event (including demurrage charges, cold stores charges, labor</p>\n<p>charges etc. or any other charges incurred until goods are ready for acceptance), have to be paid to MSD</p>\n<p>by the local supplier, before attending to checking the consignment 100%, by MSD.</p>\n<p>In respect of SPC imported supplies, if the local agent does not follow suit as above, such extra expenses</p>\n<p>incurred to MSD shall be recovered from the supplier by SPC and refund to MSD.</p>\n<p>Storage Conditions &amp;amp; Temperature</p>\n<p>22. If the storage temperature &amp;amp; conditions are not specified in the item specification, NMRA accepted</p>\n<p>product storage conditions, shall conform to Sri Lankan ambient storage conditions in the ranges of 30 0 c</p>\n<p>+/- 2 0 c temperature and 75% +/-5% relative humidity. The product storage conditions shall be clearly</p>\n<p>indicated at all levels of labels/packages/boxes.</p>\n<p>23. Maintenance of Cold Chain;</p>\n<p><br></p>\n<p><br></p>',
}

const accordionSummaryStyle = {
    color: '#020714',
    borderBottom: '1px solid #020714',
}

export default function PurchaseOrder() {
    const [pageData, setPageData] = useContext(PageContext)
    // const [dataIsLoading, setDataIsLoading] = useState(false)
    const [POType, setPOType] = useState('')
    const [suppplierDetails, setSupplierDetails] = useState('')
    const [procurementAgent, setProcurementAgent] = useState('')
    const [currency, setCurrency] = useState(null)
    const [modeOfDispatch, setModeOfDispatch] = useState('')
    const [tenderNo, setTender] = useState('')
    const [paymentTerms, setPaymentTerms] = useState('')
    const [quotedUnitPrice, setQuotedUnitPrice] = useState('')
    const [incoTerms, setIncoTerms] = useState('')
    const [HSCode, setHSCode] = useState('')
    const [intentNo, setIntentNo] = useState('')
    const [localAgent, setLocalAgent] = useState('')
    const [importLicenseNo, setImportLicenseNo] = useState('')
    const [validUpTo, setValidUpTo] = useState('')
    const [exchangeRate, setExchangeRate] = useState('')
    const [bank, setBank] = useState(null)
    const [isAddBankDetails, setIsAddBankDetails] = useState(false)
    const [supplierList, setSupplierList] = useState([])
    const [agentList, setAgentList] = useState([])
    const [localAgentList, setLocalAgentList] = useState([])
    const [conversion, setConversion] = useState('0')
    const [freightChargers, setFreightChargers] = useState('0')
    const [handlAndPackagingCharge, setHandlAndPackagingCharge] = useState('0')
    const [otherCharge, setOtherCharge] = useState('0')
    const [commission, setCommission] = useState('0')
    const [grandTotal, setGrandTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [supervisorRemark, setSupervisorRemark] = useState('')
    const [statusConfDialog, setStatusConfDialog] = useState(false)
    const [approvalStatus, setApprovalStatus] = useState('');
    const [note, setNote] = useState(RichTextEditor.createEmptyValue())
    const [condition, setCondition] = useState(
        RichTextEditor.createEmptyValue()
    )

    useEffect(() => {
        // TODO: check maximum count
        const getAllAgents = async () => {
            const res = await PrescriptionService.getAllAgents()
            const { data } = res.data.view
            setAgentList(data)
        }

        // TODO: check maximum count
        const getAllLocalAgents = async () => {
            const param = { limit: 50, page: 0 }
            let res = await HospitalConfigServices.getAllLocalAgents(param)
            const { data } = res.data.view
            setLocalAgentList(data)
        }

        getAllAgents()
        getAllLocalAgents()
    }, [])

    const goBack = () => {
        const tempPageData = { ...pageData, slug: 'all' }
        setPageData(tempPageData)
    }

    const removeBankDetails = () => {
        setImportLicenseNo('')
        setValidUpTo(null)
        setBank('')
        setIsAddBankDetails(false)
    }

    const loadAllSuppliers = (search) => {
        let params = { search: search, limit: 30, page: 0 }
        if (search.length > 1) {
            HospitalConfigServices.getAllSuppliers(params)
                .then((res) => {
                    setSupplierList(res.data.view.data)
                })
                .catch((err) => {
                    console.log('🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:', err)
                })
        }
    }

    const handleNoteChange = (value) => {
        setNote(value)
    }

    const handleConditionChange = (value) => {
        setCondition(value)
    }

    const saveData = () => { }

    const openConfirmAlert = (status) => {
        setApprovalStatus(status)
        setStatusConfDialog(true)
    }
    const reject = () => {
        setStatusConfDialog(false)
    }

    const confirm = () => {
        // TODO: confirm handle
        setStatusConfDialog(false)
    }



    return (
        <MainContainer>
            <LoonsCard style={{ minHeight: '80vh' }}>
                {/* header */}
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
                {/* End header */}
                <ValidatorForm onSubmit={saveData}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6">Order Details</Typography>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <p style={{ margin: 0 }}>
                                Purchase Order No : 8324823
                            </p>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <p style={{ margin: 0 }}>
                                MSD Order List No : {tempPayload.intend.orderNo}
                            </p>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Indent Number" />
                                <TextValidator
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
                                    onChange={(e) =>
                                        setIntentNo(e.target.value)
                                    }
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="PO Type" />
                                <Autocomplete
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
                                    className="w-full"
                                    options={appconst.payment_term}
                                    value={paymentTerms ? paymentTerms : null}
                                    onChange={(event, value) => {
                                        setPaymentTerms(value)
                                    }}
                                    getOptionLabel={(option) =>
                                        `${option?.label} - ${option?.name}`
                                    }
                                    getOptionSelected={(option, value) =>
                                        option.label === value.label
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
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
                                    className="w-full"
                                    options={supplierList}
                                    value={
                                        suppplierDetails
                                            ? suppplierDetails
                                            : null
                                    }
                                    onChange={(event, value) => {
                                        setSupplierDetails(value)
                                    }}
                                    getOptionLabel={(option) =>
                                        `${option?.name} - ${option?.registartion_no}`
                                    }
                                    getOptionSelected={(option, value) =>
                                        option.name === value.name
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Supplier Name"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={suppplierDetails?.name}
                                            onChange={(event) => {
                                                loadAllSuppliers(
                                                    event.target.value
                                                )
                                            }}
                                        // validators={['required']}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
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
                                    className="w-full"
                                    options={appconst.inco_terms}
                                    value={
                                        incoTerms ? { label: incoTerms } : null
                                    }
                                    onChange={(event, value) => {
                                        setIncoTerms(value?.label)
                                    }}
                                    getOptionLabel={(option) => option.label}
                                    getOptionSelected={(option, value) =>
                                        option.label === value.label
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
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
                                    className="w-full"
                                    options={agentList}
                                    onChange={(event, value) => {
                                        setProcurementAgent(value)
                                    }}
                                    value={
                                        procurementAgent
                                            ? procurementAgent
                                            : null
                                    }
                                    getOptionLabel={(option) => option.name}
                                    getOptionSelected={(option, value) =>
                                        option.name === value.name
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Procurement Agent"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={procurementAgent?.name}
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
                                    <SubTitle title="Local Agent" />
                                    <Autocomplete
                                        className="w-full"
                                        options={localAgentList}
                                        value={localAgent ? localAgent : null}
                                        onChange={(event, value) => {
                                            setLocalAgent(value)
                                        }}
                                        getOptionLabel={(option) => option.name}
                                        getOptionSelected={(option, value) =>
                                            option.name === value.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Local Agent"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={localAgent?.name}
                                            // validators={['required']}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />
                                        )}
                                    />
                                </FormControl>
                            )}
                        </Grid>

                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Currency" />
                                <Autocomplete
                                    className="w-full"
                                    options={appconst.all_currencies}
                                    value={currency ? currency : null}
                                    getOptionLabel={(option) => option.cc}
                                    onChange={(event, value) => {
                                        setCurrency(value)
                                    }}
                                    getOptionSelected={(option, value) =>
                                        option.cc === value.cc
                                    }
                                    renderInput={(params) => (
                                        <TextValidator
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
                                    onChange={(e) =>
                                        setExchangeRate(e.target.value)
                                    }
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </FormControl>
                            <FormControl className="w-full">
                                <SubTitle title="Quoted Unit Price" />
                                <Autocomplete
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
                                        <RadioGroup
                                            name="category"
                                            value={modeOfDispatch || ''}
                                            onChange={(e) =>
                                                setModeOfDispatch(
                                                    e.target.value
                                                )
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
                                        </RadioGroup>
                                    </FormControl>
                                </FormControl>
                            )}

                            {POType === 'F' && (
                                <FormControl className="w-full">
                                    <SubTitle title="HS Code" />
                                    <TextValidator
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
                                        onChange={(e) =>
                                            setHSCode(e.target.value)
                                        }
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
                                        className="w-full"
                                        placeholder="Valid Up To"
                                        // required={true}
                                        format="dd/MM/yyyy"
                                        value={validUpTo || null}
                                        onChange={(date) => {
                                            setValidUpTo(date)
                                        }}
                                    />
                                </FormControl>

                                <FormControl className="w-full">
                                    <SubTitle title="Bank" />
                                    <Autocomplete
                                        className="w-full"
                                        options={selectionData.bank}
                                        value={bank}
                                        onChange={(event, value) => {
                                            setBank(value)
                                        }}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Bank"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={bank ? bank.label : ''}
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

                        <Grid item xs={12}>
                            <Typography variant="h6">Item Details</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Other Genaral</Typography>
                        </Grid>

                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Conversion" />
                                <TextValidator
                                    fullWidth
                                    placeholder="Conversion"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={conversion}
                                    onChange={(e) =>
                                        setConversion(e.target.value)
                                    }
                                // validators={['required']}
                                // errorMessages={['this field is required']}
                                />
                            </FormControl>

                            {POType === 'F' && (
                                <FormControl className="w-full">
                                    <SubTitle title="Freight Chargers" />
                                    <TextValidator
                                        fullWidth
                                        placeholder="Freight Chargers"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={freightChargers}
                                        onChange={(e) =>
                                            setFreightChargers(e.target.value)
                                        }
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    />
                                </FormControl>
                            )}

                            {POType === 'F' && (
                                <FormControl className="w-full">
                                    <SubTitle title="Commission" />
                                    <TextValidator
                                        fullWidth
                                        placeholder="Commission"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={commission}
                                        onChange={(e) =>
                                            setCommission(e.target.value)
                                        }
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    />
                                </FormControl>
                            )}
                        </Grid>

                        <Grid item lg={4} md={4} sm={12} xs={12}>
                            {POType === 'F' && (
                                <FormControl className="w-full">
                                    <SubTitle title="Handling & Packaging Chargers" />
                                    <TextValidator
                                        fullWidth
                                        placeholder="Handling & Packaging Chargers"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={handlAndPackagingCharge}
                                        onChange={(e) =>
                                            setHandlAndPackagingCharge(
                                                e.target.value
                                            )
                                        }
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    />
                                </FormControl>
                            )}

                            {POType === 'F' && (
                                <FormControl className="w-full">
                                    <SubTitle title="Other Chargers" />
                                    <TextValidator
                                        fullWidth
                                        placeholder="Other Chargers"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={otherCharge}
                                        onChange={(e) =>
                                            setOtherCharge(e.target.value)
                                        }
                                    // validators={['required']}
                                    // errorMessages={['this field is required']}
                                    />
                                </FormControl>
                            )}

                            <FormControl className="w-full">
                                <SubTitle title="Grand Total" />
                                <Typography variant="subtitle2">
                                    {convertTocommaSeparated(grandTotal, 2)}
                                </Typography>
                            </FormControl>
                        </Grid>
                        {/* end other genaral */}
                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    style={accordionSummaryStyle}
                                >
                                    <Typography variant="h6">Note</Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <FormControl className="w-full">
                                        <RichTextEditor
                                            value={note}
                                            onChange={handleNoteChange}
                                            editorClassName="custom-editor-sm"
                                        />
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header2"
                                    style={accordionSummaryStyle}
                                >
                                    <Typography variant="h6">
                                        SPC Conditions
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <FormControl className="w-full">
                                        <RichTextEditor
                                            value={condition}
                                            onChange={handleConditionChange}
                                            editorClassName="custom-editor-sm"
                                        />
                                    </FormControl>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header3"
                                    style={accordionSummaryStyle}
                                >
                                    <Typography variant="h6">
                                        MSD Conditions
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Suspendisse malesuada
                                        lacus ex, sit amet blandit leo lobortis
                                        eget.
                                    </p>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">
                                Supervisor Approval
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl className="w-full">
                                <SubTitle title="Supervisor Remark" />

                                <TextareaAutosize
                                    aria-label="minimum height"
                                    placeholder="Remark"
                                    value={supervisorRemark}
                                    onChange={(e) =>
                                        setSupervisorRemark(e.target.value)
                                    }
                                    style={{
                                        padding: 10,
                                        borderRadius: 5,
                                        minWidth: '40vw',
                                        maxWidth: '40vw',
                                        minHeight: 80,
                                        margin: '1rem'
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="button"
                                style={{ margin: '10px' }}
                                color="secondary"
                                variant="contained"
                                startIcon={<BlockIcon />}
                                onClick={() => openConfirmAlert('reject')}

                            >
                                Reject
                            </Button>
                            <Button
                                type="submit"
                                style={{ margin: '10px' }}
                                color="primary"
                                variant="contained"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => openConfirmAlert('approve')}
                            >
                                Approve
                            </Button>
                            <Button
                                type="submit"
                                style={{ margin: '10px' }}
                                color="primary"
                                variant="contained"
                                startIcon={<SaveIcon />}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>

                {/* {!dataIsLoading && (
                    <LoonsTable
                        id={'completed'}
                        data={tableData}
                        columns={tableColumns}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: noOfData,
                            rowsPerPage: filterData.limit,
                            page: filterData.page,
                            onTableChange: (action, tableState) => {
                                switch (action) {
                                    case 'changePage':
                                        tablePageHandler(tableState.page)
                                        break
                                    case 'sort':
                                        //this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                    // TODO: Acction not hanled
                                }
                            },
                        }}
                    ></LoonsTable>
                )} */}

                {/* {dataIsLoading && (
                    <div
                        className="justify-center text-center w-full pt-12"
                        style={{ height: '50vh' }}
                    >
                        <CircularProgress size={30} />
                    </div>
                )} */}
            </LoonsCard>
            <ConfirmationDialog
                text="Are you sure?"
                open={statusConfDialog}
                onConfirmDialogClose={reject}
                onYesClick={confirm}
            />
        </MainContainer>
    )
}
