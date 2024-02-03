import React, { useState, useContext, useEffect, useMemo, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles';
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
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    CircularProgress,
    Checkbox,
    FormGroup
} from '@material-ui/core'
import {
    MainContainer,
    LoonsCard,
    SubTitle,
    DatePicker,
    LoonsSnackbar,
    LoonsTable,
    CardTitle,
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
import SPCServices from 'app/services/SPCServices'
import SchedulesServices from 'app/services/SchedulesServices';
import CloseIcon from '@material-ui/icons/Close'

import AssignItem from '../../create/stepper/AssignItem';
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import ApprovalIcon from '@mui/icons-material/Approval';

import { dateParse } from 'utils';
import PreProcumentService from 'app/services/PreProcumentService';
import localStorageService from 'app/services/localStorageService';
import InventoryService from 'app/services/InventoryService';
import { isNull, isUndefined } from 'lodash';
import LoonsButton from 'app/components/LoonsLabComponents/Button';

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
        currencyDate: '2023-11-14',
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

const useStyles = makeStyles((theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
}));

export default function PurchaseOrder() {
    const classes = useStyles()
    const [pageData, setPageData] = useContext(PageContext)
    // const [dataIsLoading, setDataIsLoading] = useState(false)
    const [POType, setPOType] = useState(null)
    const [suppplierDetails, setSupplierDetails] = useState(null)
    const [procurementAgent, setProcurementAgent] = useState(null)
    const [currency, setCurrency] = useState(null)
    const [modeOfDispatch, setModeOfDispatch] = useState([])
    const [tenderNo, setTender] = useState(null)
    const [paymentTerms, setPaymentTerms] = useState(null)
    const [quotedUnitPrice, setQuotedUnitPrice] = useState(null)
    const [incoTerms, setIncoTerms] = useState(null)
    const [HSCode, setHSCode] = useState(null)
    const [intentNo, setIntentNo] = useState(null)
    const [localAgent, setLocalAgent] = useState(null)
    const [importLicenseNo, setImportLicenseNo] = useState(null)
    const [validUpTo, setValidUpTo] = useState(null)
    const [exchangeRate, setExchangeRate] = useState(null)
    const [currencyDate, setCurrencyDate] = useState(null)
    const [bank, setBank] = useState(null)
    const [isAddBankDetails, setIsAddBankDetails] = useState(false)
    const [supplierList, setSupplierList] = useState([])
    const [agentList, setAgentList] = useState([])
    const [localAgentList, setLocalAgentList] = useState([])
    const [bankList, setBankList] = useState([])
    const [conversion, setConversion] = useState('0')
    const [freightChargers, setFreightChargers] = useState('0')
    const [handlAndPackagingCharge, setHandlAndPackagingCharge] = useState('0')
    const [otherCharge, setOtherCharge] = useState('0')
    const [commission, setCommission] = useState({ value: '0', percentage: '0' })
    const [commissionType, setCommissionType] = useState('percentage')
    const [commissionValue, setCommissionValue] = useState(0)
    const [grandTotal, setGrandTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [totalTax, setTotalTax] = useState(0)
    const [supervisorRemark, setSupervisorRemark] = useState('')
    const [submitOpen, setSubmitOpen] = useState(false)
    const [saveOpen, setSaveOpen] = useState(false)
    const [approvalStatus, setApprovalStatus] = useState('');
    const [note, setNote] = useState(RichTextEditor.createEmptyValue())
    const [condition, setCondition] = useState(
        RichTextEditor.createEmptyValue()
    )
    const [shippingCondition, setShippingCondition] = useState(
        RichTextEditor.createEmptyValue()
    )

    const [shippingID, setShippingID] = useState(null);
    const [isShippingData, setIsShippingData] = useState(null)

    const [open, setOpen] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [approved, setApproved] = useState(false);
    const [data, setData] = useState({})
    const [printData, setPrintData] = useState({})
    const [tableData, setTableData] = useState([])
    const assignList = useRef([])
    const [selectedId, setSelectedId] = useState(null)
    const [rowData, setRowData] = useState({})
    const [snackbar, setSnackbar] = useState({ alert: false, severity: "success", message: "" })
    const [dataIsLoading, setDataIsLoading] = useState(true);
    const [noOfData, setNoOfData] = useState(0);
    const [userRoles, setUserRoles] = useState([])
    const [progess, setProgress] = useState(false)
    const [printLoaded, setPrintLoaded] = useState(false)
    const [resetOpen, setResetOpen] = useState(false)

    const [filterData, setFilterData] = useState({
        // limit: 10,
        // page: 0,
        // order_no: null,
        order_list_id: '',
        'order[0]': ['updatedAt', 'DESC'],
        // agent_type: '',
    })

    const calDiscount = (price, orderQuantity, unit, discount, discountType) => {
        if (discountType === 'percentage') {
            return ((orderQuantity / unit) * price) * (discount / 100)
        } else {
            return discount
        }
    }

    const ActionButton = ({ onClick, status, create, condition }) => {
        if (status) {
            return (
                <Chip
                    size="small"
                    icon={<DoneIcon />}
                    label="Assigned"
                    onDelete={onClick}
                    deleteIcon={<EditIcon />}
                    color={"secondary"}
                />
            )
        } else {
            return (
                <Tooltip title={!create && condition ? "No Available Qty" : "Assign Item"}>
                    <IconButton onClick={onClick}>
                        <EditIcon size="small" color={!create && condition ? 'error' : "primary"} />
                    </IconButton>
                </Tooltip>
            )
        }
    }

    const tableColumns = [
        {
            name: 'action',
            label: 'Action',
            options: {
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]
                    return (
                        <ActionButton
                            status={data.assing}
                            create={data.create}
                            condition={parseFloat(data?.allocated_quantity) >= parseFloat(data?.quantity)}
                            onClick={() => parseFloat(data?.allocated_quantity) >= parseFloat(data?.quantity) && !data?.create ? null : handleClickOpen(data, dataIndex)}
                        />
                    )
                },
            },
        },
        {
            name: 'SR Number', // field name in the row object
            label: 'SR Number', // column title that will be shown in table
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.ItemSnap?.sr_no
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'SR Description',
            label: 'SR Description',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data =
                        tableData[dataIndex]?.ItemSnap?.medium_description
                    return <p>{data}</p>
                },
            },
        },

        {
            name: 'Schedule Date',
            label: 'Schedule Date',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex].order_date_to
                    return <p>{dateParse(data)}</p>
                },
            },
        },
        {
            name: 'Order Qunatity',
            label: 'Order Qunatity',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.quantity
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'Allocated Qunatity',
            label: 'Allocated Qunatity',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.allocated_quantity
                    return <p>{data}</p>
                },
            },
        },
        {
            name: 'Status',
            label: 'Status',
            options: {
                filter: true,
                display: true,
                customBodyRenderLite: (dataIndex) => {
                    let data = tableData[dataIndex]?.status
                    return <p>{data}</p>
                },
            },
        },
    ]

    const handleClose = () => {
        setOpen(false);
    }

    const handleClickOpen = (data, index) => {
        setRowData(data)
        setSelectedId(index)
        setOpen(true)
    }

    const tablePageHandler = (pageNumber) => {
        const tempFilterData = { ...filterData, page: pageNumber }
        setFilterData(tempFilterData)
    }

    // item assign handling
    const updateDataTable = async (data) => {
        const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

        if (userRoles.includes('SPC MA')) {
            const tempTableData = [...tableData]
            tableData[selectedId] = data
            setTableData(tempTableData)

            const subTotalAmountPromise = assignList.current.reduce(async (accumulatorPromise, item) => {
                const { itemData } = item || {};
                const subTotal = parseFloat(itemData?.total ?? 0);
                const accumulator = await accumulatorPromise;
                return accumulator + subTotal;
            }, Promise.resolve(0));

            const totalDiscountAmountPromise = assignList.current.reduce(async (accumulatorPromise, item) => {
                const { itemData } = item || {};
                const amount = parseFloat(itemData?.subTotal + itemData?.taxAmount - itemData?.total);
                const discount = parseFloat(amount ?? 0);
                const accumulator = await accumulatorPromise;
                return accumulator + discount;
            }, Promise.resolve(0));

            const totalTaxAmountPromise = assignList.current.reduce(async (accumulatorPromise, item) => {
                const { itemData } = item || {};
                const tax = parseFloat(itemData?.taxAmount ?? 0);
                const accumulator = await accumulatorPromise;
                return accumulator + tax;
            }, Promise.resolve(0));

            const [subTotalAmount, totalDiscountAmount, totalTaxAmount] = await Promise.all([
                subTotalAmountPromise,
                totalDiscountAmountPromise,
                totalTaxAmountPromise,
            ]);

            // console.log("Value: ", subTotalAmount, totalDiscountAmount, totalTaxAmount)

            if (subTotalAmount !== subTotal) {
                setSubTotal(subTotalAmount)
                setTotalDiscount(totalDiscountAmount)
                setTotalTax(totalTaxAmount)
                // try {
                //     const status = await saveData();
                //     if (!status) {
                //         handleClose();
                //         return;
                //     }
                // } catch (error) {
                //     console.error("Error:", error);
                // }
            }

            const selectedItem = assignList.current.find(
                (rs) => rs.rowData.id === data.id
            )

            if (!isUndefined(selectedItem)) {
                const { itemData, rowData } = selectedItem;
                if (isNull(itemData?.id) || isUndefined(itemData?.id)) {
                    let tempData = {
                        "spc_po_id": printData?.id,
                        "order_list_item_id": rowData?.id,
                        "manufacture_id": itemData.manufacture?.id,
                        "item_id": rowData?.item_id,
                        "country_of_origin": itemData.countryOfOrigin?.description,
                        "price": itemData.price ? parseFloat(itemData.price) : 0,
                        "unit": itemData.unit,
                        "unit_type": itemData.unitType,
                        "tax_code": itemData.taxCode,
                        "tax_percentage": itemData.taxPercentage ? parseFloat(itemData.taxPercentage) : 0,
                        "tax_amount": itemData.taxAmount ? parseFloat(itemData.taxAmount) : 0,
                        "discount": calDiscount(parseFloat(itemData?.price ?? 0), parseFloat(itemData?.orderQuantity ?? 0), parseFloat(itemData?.unit ?? 0), parseFloat(itemData?.discount ?? 0), itemData.discountType),
                        'discount_precentage': itemData.discountType === 'percentage' ? itemData.discount : '0',
                        "discount_type": itemData.discountType,
                        "total": itemData.total,
                        "remark": itemData.remark,
                        "specification": itemData.specification,
                        // "shelf_life": itemData.shelfLife,
                        "shelf_life": itemData.type === 'Warranty' ? '' : itemData.shelfLife,
                        "warranty": itemData.type === 'Warranty' ? itemData.shelfLife : "",
                        "order_quantity": itemData.orderQuantity ? parseFloat(itemData.orderQuantity) : 0,
                        "delivery_schedule": itemData.deliverySchedule.map((rs) => {
                            return {
                                "shedule_date": rs.sheduleDate,
                                "delivery_location": rs.deliveryLocation,
                                "quantity": rs.quantity,
                                "remarks": rs.remark
                            }
                        }),
                        "packing_details": itemData.packingDetails.map((rs) => {
                            return {
                                "pack_size": parseFloat(rs.packSize),
                                "uom": rs.UOM,
                                "quantity": parseInt(rs.quantity, 10),
                                "conversion": parseFloat(rs.conversion),
                                "min_pack_factor": rs.minPackFactor,
                                "storing_level": rs.storingLevel
                            }
                        })
                    }
                    try {
                        let res = await SPCServices.createSPCPOItem(tempData);
                        if (res.status) {
                            const indexToUpdate = assignList.current.findIndex(rs => rs.rowData.id === data.id);
                            if (indexToUpdate !== -1) {
                                const selectedItemToUpdate = assignList.current[indexToUpdate];

                                const updatedItemData = {
                                    ...itemData,
                                    id: res.data?.posted?.res?.id,
                                    spc_po_id: res.data?.posted?.res?.spc_po_id,
                                    order_list_item_id: res.data?.posted?.res?.order_list_item_id
                                };

                                const updatedRowData = {
                                    ...rowData,
                                    assing: true,
                                    create: true,
                                    edit: true,
                                    added: true,
                                };

                                const updatedSelectedItem = {
                                    ...selectedItemToUpdate,
                                    itemData: updatedItemData,
                                    rowData: updatedRowData
                                };

                                tableData[selectedId] = { ...data, assing: true, create: true, edit: true }
                                setTableData(tempTableData)
                                // Update the assignList by replacing the element at the found index
                                assignList.current.splice(indexToUpdate, 1, updatedSelectedItem);
                            }
                            setSnackbar({ alert: true, severity: "success", message: "Item Data was Added Successfully" })
                        }
                    } catch (error) {
                        setSnackbar({ alert: true, severity: "error", message: `Error in updating for item ${itemData?.id}: ${error.message}` })
                        console.error(`Error for item ${itemData?.id}: ${error.message}`);
                    } finally {
                        handleClose()
                    }
                } else if (!isNull(itemData?.id) || !isUndefined(itemData?.id)) {
                    let tempData = {
                        "order_list_item_id": itemData?.order_list_item_id,
                        "manufacture_id": itemData.manufacture?.id,
                        "item_id": rowData?.item_id,
                        "country_of_origin": itemData.countryOfOrigin?.description,
                        "price": itemData.price ? parseFloat(itemData.price) : 0,
                        "unit": itemData.unit,
                        "unit_type": itemData.unitType,
                        "tax_code": itemData.taxCode,
                        "tax_percentage": itemData.taxPercentage ? parseFloat(itemData.taxPercentage) : 0,
                        "tax_amount": itemData.taxAmount ? parseFloat(itemData.taxAmount) : 0,
                        "discount": calDiscount(parseFloat(itemData?.price ?? 0), parseFloat(itemData?.orderQuantity ?? 0), parseFloat(itemData?.unit ?? 0), parseFloat(itemData?.discount ?? 0), itemData.discountType),
                        'discount_precentage': itemData.discountType === 'percentage' ? itemData.discount : '0',
                        "discount_type": itemData.discountType,
                        "total": itemData.total,
                        "remark": itemData.remark,
                        "specification": itemData.specification,
                        // "shelf_life": itemData.shelfLife,
                        "shelf_life": itemData.type === 'Warranty' ? '' : itemData.shelfLife,
                        "warranty": itemData.type === 'Warranty' ? itemData.shelfLife : "",
                        "order_quantity": itemData.orderQuantity ? parseFloat(itemData.orderQuantity) : 0,
                    }

                    try {
                        let res = await SPCServices.changeSPCPOItem(itemData?.id, tempData);
                        if (res.status) {
                            setSnackbar({ alert: true, severity: "success", message: "Item Data was Updated Successfully" })
                        }
                    } catch (error) {
                        setSnackbar({ alert: true, severity: "error", message: `Error in updating for item ${itemData?.id}: ${error.message}` })
                        console.error(`Error for item ${itemData?.id}: ${error.message}`);
                    } finally {
                        handleClose()
                    }
                } else {
                    handleClose()
                }
            } else {
                setSnackbar({ alert: true, severity: "success", message: "Item Details has been removed" })
                handleClose();
            }
        }
    }

    // useEffect(() => {
    //     if (filterData.order_list_id) {
    //         loadTableData(filterData)
    //     }
    // }, [filterData, data, loadTableData])

    const loadItemData = async (id) => {
        let res = await InventoryService.getItemById(id)
        if (res.status === 200) {
            return res.data.view?.specification
        }
        return null
    }

    // const loadTableData = useCallback((params) => {
    //     const SPCData = data
    //     const condition = userRoles.includes('SPC MA')
    //     setDataIsLoading(true)

    //     // SchedulesServices.getScheduleOrderList(params)
    //     PreProcumentService.getSingleOrderLists(params)
    //         .then((result) => {
    //             const { data, totalItems } = result.data.view
    //             let tempList = []
    //             // check whether item is assing
    //             const tempData = data.map((res) => {
    //                 if (Array.isArray(SPCData?.SPCPOItems)) {
    //                     let tempItemData = SPCData.SPCPOItems.find((rs) => res.item_id === rs.item_id)
    //                     if (tempItemData) {
    //                         SPCServices.getAllSPCPOItem({ spc_po_id: tempItemData?.spc_po_id, item_id: res.item_id }).then(async (result) => {
    //                             const specification = await loadItemData(res.item_id)
    //                             const { data, totalItems } = result.data.view
    //                             const manufacture = Array(data) && data.length > 0 ? data[0]?.Manufacturer : {}
    //                             const id = data?.[0]?.id
    //                             // console.log("Data: ", data)
    //                             let itemData = {
    //                                 "id": id,
    //                                 "order_list_item_id": data?.[0]?.order_list_item_id,
    //                                 "spc_po_id": tempItemData?.spc_po_id,
    //                                 "manufacture": manufacture,
    //                                 "countryOfOrigin": { description: tempItemData?.country_of_origin },
    //                                 "price": tempItemData?.price,
    //                                 "unit": tempItemData?.unit,
    //                                 "unitType": tempItemData?.unit_type,
    //                                 "taxCode": tempItemData?.tax_code,
    //                                 "taxPercentage": tempItemData?.tax_percentage,
    //                                 "taxAmount": tempItemData?.tax_amount,
    //                                 "discount": tempItemData?.discount_type === 'percentage' ? tempItemData?.discount_precentage : tempItemData?.discount,
    //                                 "discountType": tempItemData?.discount_type,
    //                                 "total": tempItemData?.total,
    //                                 "remark": tempItemData?.remark,
    //                                 "specification": specification,
    //                                 "shelfLife": tempItemData?.warranty !== '' ? tempItemData?.warranty : tempItemData?.shelf_life,
    //                                 "type": tempItemData?.warranty !== '' ? "Warranty" : 'Shelf Life',
    //                                 "orderQuantity": tempItemData?.order_quantity,
    //                                 "deliverySchedule": Array.isArray(tempItemData?.SPCPODeliverySchedules) && tempItemData?.SPCPODeliverySchedules.map((rs) => {
    //                                     return {
    //                                         "sheduleDate": rs?.shedule_date,
    //                                         "deliveryLocation": rs?.delivery_location,
    //                                         "quantity": rs?.quantity,
    //                                         'remark': rs?.remarks ? rs?.remarks : ""
    //                                     }
    //                                 }),
    //                                 "packingDetails": Array.isArray(tempItemData?.SPCPOPackDetails) && tempItemData?.SPCPOPackDetails.map((rs) => {
    //                                     return {
    //                                         "packSize": rs?.pack_size,
    //                                         "UOM": rs?.uom,
    //                                         "conversion": rs?.conversion,
    //                                         "minPackFactor": rs?.min_pack_factor,
    //                                         "storingLevel": rs?.storing_level

    //                                     }
    //                                 })
    //                             }
    //                             tempList.push({ itemData: itemData, rowData: res })
    //                         })
    //                         return { ...res, assing: true, create: true, edit: condition }
    //                     }
    //                 }
    //                 return { ...res, assing: false, create: false, edit: false }
    //             })

    //             assignList.current = tempList
    //             setNoOfData(totalItems)
    //             setTableData(tempData)
    //         })
    //         .catch((err) => {
    //             console.log(
    //                 '🚀 ~ file: SingleOrders.jsx:60 ~ loadTableData ~ err:',
    //                 err
    //             )
    //         })
    //         .finally(() => {
    //             setDataIsLoading(false)
    //         })
    // }, [data])

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

    const processSPCPOItem = async (res, SPCData) => {
        if (Array.isArray(SPCData?.SPCPOItems)) {
            const tempItemData = SPCData.SPCPOItems.find((rs) => res.item_id === rs.item_id);
            if (tempItemData) {
                try {
                    const result = await SPCServices.getAllSPCPOItem({ spc_po_id: tempItemData?.spc_po_id, item_id: res.item_id });
                    const { data } = result.data.view;
                    const specification = await loadItemData(res?.primary_item_id ? res.primary_item_id : res?.item_id);
                    const manufacture = Array(data) && data.length > 0 ? data[0]?.Manufacturer : {};
                    const id = data?.[0]?.id;

                    const itemData = {
                        "id": id,
                        "order_list_item_id": data?.[0]?.order_list_item_id,
                        "spc_po_id": tempItemData?.spc_po_id,
                        "manufacture": manufacture,
                        "countryOfOrigin": { description: tempItemData?.country_of_origin },
                        "price": tempItemData?.price,
                        "unit": tempItemData?.unit,
                        "unitType": tempItemData?.unit_type,
                        "taxCode": tempItemData?.tax_code,
                        "taxPercentage": tempItemData?.tax_percentage,
                        "taxAmount": tempItemData?.tax_amount,
                        "discount": tempItemData?.discount_type === 'percentage' ? tempItemData?.discount_precentage : tempItemData?.discount,
                        "discountType": tempItemData?.discount_type,
                        "total": tempItemData?.total,
                        "remark": tempItemData?.remark,
                        "specification": specification,
                        "shelfLife": tempItemData?.warranty !== '' ? tempItemData?.warranty : tempItemData?.shelf_life,
                        "type": tempItemData?.warranty !== '' ? "Warranty" : 'Shelf Life',
                        "orderQuantity": tempItemData?.order_quantity,
                        "deliverySchedule": Array.isArray(tempItemData?.SPCPODeliverySchedules) && tempItemData?.SPCPODeliverySchedules.map((rs) => {
                            return {
                                "id": rs?.id,
                                "sheduleDate": rs?.shedule_date,
                                "deliveryLocation": rs?.delivery_location,
                                "quantity": rs?.quantity,
                                'remark': rs?.remarks ? rs?.remarks : ""
                            }
                        }),
                        "packingDetails": Array.isArray(tempItemData?.SPCPOPackDetails) && tempItemData?.SPCPOPackDetails.map((rs) => {
                            return {
                                "id": rs?.id,
                                "packSize": rs?.pack_size,
                                "UOM": rs?.uom,
                                "conversion": rs?.conversion,
                                "minPackFactor": rs?.min_pack_factor,
                                "storingLevel": rs?.storing_level
                            }
                        })
                    }
                    return { itemData: itemData, rowData: res };
                } catch (err) {
                    console.log("Error: ", err)
                    setSnackbar({ alert: true, severity: "error", message: `Error: ${err}` })
                }
            }
        }
        return { itemData: null, rowData: res };
    };

    const loadAssignTable = async (view) => {
        try {
            const result = await PreProcumentService.getSingleOrderLists({
                ...filterData,
                order_by_sr: "ASC",
                order_list_id: pageData.orderId,
            });
            const { data, totalItems } = result.data.view;
            const tempList = [];

            const tempData = await Promise.all(
                data.map(async (res, i) => {
                    const processedData = await processSPCPOItem(res, view);
                    if (processedData.itemData) {
                        tempList.push(processedData);
                        return { ...res, assing: true, create: true, edit: true };
                    }
                    return { ...res, assing: false, create: false, edit: false };
                })
            );

            assignList.current = tempList;
            setNoOfData(totalItems);
            setTableData(tempData);
        } catch (err) {
            console.log('Error:', err);
            setSnackbar({ alert: true, severity: "error", message: `Error: ${err}` })
        }
    }

    const changeShippingCondition = async (data) => {
        const type = data?.po_type === "F" ? "SPC PO Foreign Shipment" : "SPC PO Local Shipment"
        const id = pageData?.id
        if (shippingID) {
            try {
                if (isShippingData) {
                    const res = await SPCServices.changeShippingConditions(shippingID, { conditions: shippingCondition.toString('html') })
                    setSnackbar({ alert: true, severity: "success", message: 'Shipping Conditions Editted Sucessfully' })
                    setIsShippingData(true)
                } else {
                    const res = await SPCServices.createShippingConditions({ po_id: id, default_condition_id: shippingID, type: type, condition: shippingCondition })
                    setSnackbar({ alert: true, severity: "success", message: `Shipping Conditions Added Sucessfully` })
                    setIsShippingData(true)
                    setShippingID(res.data?.posted?.id);
                }
            } catch (err) {
                console.log("Error: ", err)
                setSnackbar({ alert: true, severity: "error", message: `Error: ${err}` })
            }
        }
    }

    useEffect(() => {
        const id = pageData?.id
        const userRoles = localStorageService.getItem('userInfo')?.roles

        // TODO: check maximum count
        const getAllAgents = async () => {
            const param = { limit: 20, page: 0, }
            try {
                const res = await PrescriptionService.getAllAgents(param)
                const { data } = res.data?.view
                setAgentList(data)
            } catch (err) {
                console.log("Error: ", err)
                setSnackbar({ alert: true, severity: "error", message: `Error: ${err}` })
            }
        }

        const getShippingCondition = async (view) => {
            const param = { po_id: id };
            const type = view?.po_type === "F" ? "SPC PO Foreign Shipment" : "SPC PO Local Shipment";

            try {
                const res = await SPCServices.getShippingConditions(param);
                const { data } = res.data?.view;

                if (data.length > 0) {
                    const condition = data[0].conditions;
                    setShippingID(data[0].id);
                    setShippingCondition(RichTextEditor.createValueFromString(condition, 'html'));
                    setIsShippingData(true);
                } else {
                    const res = await SPCServices.getAllConditions({ type: type });
                    const { data } = res.data?.view;
                    const condition = data[0]?.conditions;

                    const itemsDetails = Array.isArray(assignList.current) && assignList.current.length > 0 ? assignList.current.length === 1 ? assignList.current?.[0]?.rowData?.ItemSnap?.sr_no : "As per the Indent" : "";

                    const itemManuacture = Array.isArray(assignList.current) && assignList.current.length > 0 ? assignList.current.length === 1 ? assignList.current?.[0]?.itemData?.manufacture?.name : "As per above Purchase Order" : "";

                    let formattedCondition = condition;
                    if (type === "SPC PO Foreign Shipment") {
                        formattedCondition = condition
                            .replace('${orderNo}', view?.orderNo)
                            .replace('${srNo}', itemsDetails)
                            .replace('${indentNo}', view?.indent_no);
                    } else {
                        formattedCondition = condition
                            .replace('${supplier}', itemManuacture)
                            .replace('${tenderNo}', view?.tender_no)
                            .replace('OF ${date}', dateParse(new Date()));
                    }

                    setShippingID(data[0]?.id);
                    setShippingCondition(RichTextEditor.createValueFromString(formattedCondition, 'html'));
                    setIsShippingData(false);
                }
            } catch (err) {
                console.log("Error: ", err);
                setSnackbar({ alert: true, severity: "error", message: `Error: ${err}` });
            }
        };

        const getData = async () => {
            try {
                const res = await SPCServices.getPurchaseOrderByID(id);
                const { view } = res.data;

                setData(view);
                setPrintData(view);

                const {
                    indent_no,
                    tender_no,
                    currency,
                    po_type,
                    inco_terms,
                    exchange_rate,
                    currency_date,
                    payment_terms_short,
                    payment_terms,
                    Supplier,
                    LocalAgent,
                    a,
                    mode_of_dispatch,
                    quoted_unit_price,
                    hs_code,
                    import_license_no,
                    valid_date,
                    Bank_Detail,
                    conversion,
                    freight_chargers,
                    handl_and_packaging_charge,
                    other_charge,
                    commission_precentage,
                    commission,
                    grand_total,
                    sub_total,
                    notes,
                    additional_conditions,
                    total_tax,
                    total_discount
                } = view;

                setIntentNo(indent_no);
                setTender(tender_no);
                setTotalTax(total_tax);
                setTotalDiscount(total_discount)
                setCurrency(currency);
                setPOType(po_type === 'F' ? "F" : "L");
                setIncoTerms(inco_terms);
                setExchangeRate(exchange_rate);
                setCurrencyDate(currency_date);
                setPaymentTerms({ label: payment_terms_short, name: payment_terms });
                setSupplierDetails(Supplier);
                setLocalAgent(LocalAgent);
                setProcurementAgent(a);
                setModeOfDispatch(mode_of_dispatch ? mode_of_dispatch.split(" & ") : []);
                setQuotedUnitPrice(quoted_unit_price);
                setHSCode(hs_code);
                setImportLicenseNo(import_license_no);
                setValidUpTo(valid_date);
                setBank(Bank_Detail);
                setIsAddBankDetails(!!Bank_Detail);
                setConversion(parseFloat(conversion));
                setFreightChargers(parseFloat(freight_chargers));
                setHandlAndPackagingCharge(parseFloat(handl_and_packaging_charge));
                setOtherCharge(parseFloat(other_charge));

                const commissionType = !isNaN(parseFloat(commission_precentage)) && parseFloat(commission_precentage) > 0 ? 'percentage' : 'value';
                const commissionValue = !isNaN(parseFloat(commission_precentage)) && parseFloat(commission_precentage) > 0 ? parseFloat(commission_precentage) : parseFloat(commission);
                setCommissionType(commissionType);
                setCommissionValue(commissionValue);
                setCommission({ value: parseFloat(commission), percentage: parseFloat(commission_precentage) });

                setGrandTotal(parseFloat(grand_total));
                setSubTotal(parseFloat(sub_total));
                setNote(RichTextEditor.createValueFromString(notes, 'html'));
                setCondition(RichTextEditor.createValueFromString(additional_conditions, 'html'));

                await loadAssignTable(view);
                await getShippingCondition(view);
                await getAllAgents();
                setDataIsLoading(false);
            } catch (error) {
                setSnackbar({ alert: true, severity: "error", message: `Error: ${error}` })
            }
        };

        // TODO: check maximum count
        // const getAllLocalAgents = async () => {
        //     const param = { limit: 20, page: 0 }
        //     let res = await HospitalConfigServices.getAllLocalAgents(param)
        //     const { data } = res.data.view
        //     setLocalAgentList(data)
        // }

        // const getAllBanks = async () => {
        //     const param = { limit: 20, page: 0, }
        //     let res = await SPCServices.getAllBanks(param)
        //     const { data } = res.data.view
        //     setBankList(data);
        // }

        // const setParam = async () => {
        //     const params = {
        //         ...filterData,
        //         order_list_id: pageData.orderId,
        //     }
        //     setFilterData(params)
        // }

        setUserRoles(userRoles)
        getData()
        // getAllAgents()
        // getAllLocalAgents()
        // getAllBanks()
        // setParam()
    }, [])

    const getShippingData = async (view) => {
        const type = view?.po_type === "F" ? "SPC PO Foreign Shipment" : "SPC PO Local Shipment";
        const res = await SPCServices.getAllConditions({ type: type });
        const { data } = res.data?.view;
        const condition = data[0]?.conditions;

        const itemsDetails = Array.isArray(assignList.current) && assignList.current.length > 0 ? assignList.current.length === 1 ? assignList.current?.[0]?.rowData?.ItemSnap?.sr_no : "As per the Indent" : "";

        const itemManuacture = Array.isArray(assignList.current) && assignList.current.length > 0 ? assignList.current.length === 1 ? assignList.current?.[0]?.itemData?.manufacture?.name : "As per above Purchase Order" : "";

        let formattedCondition = condition;
        if (type === "SPC PO Foreign Shipment") {
            formattedCondition = condition
                .replace('${orderNo}', view?.order_no)
                .replace('${srNo}', itemsDetails)
                .replace('${indentNo}', view?.indent_no);
        } else {
            formattedCondition = condition
                .replace('${supplier}', itemManuacture)
                .replace('${tenderNo}', view?.tender_no)
                .replace('OF ${date}', "");
        }

        if (isShippingData) {
            setShippingCondition(RichTextEditor.createValueFromString(formattedCondition, 'html'));
        } else {
            setShippingID(data[0]?.id);
            setShippingCondition(RichTextEditor.createValueFromString(formattedCondition, 'html'));
            setIsShippingData(false);
        }
    }

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
        let params = { search: search, limit: 20, page: 0 }
        if (search.length > 2) {
            HospitalConfigServices.getAllSuppliers(params)
                .then((res) => {
                    setSupplierList(res.data.view.data)
                })
                .catch((err) => {
                    console.log('🚀 ~ file: OrderDetails.jsx:78 ~ HospitalConfigServices.getAllSuppliers ~ err:', err)
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

    const handleNoteChange = (value) => {
        setNote(value)
    }

    const handleConditionChange = (value) => {
        setCondition(value)
    }

    const handleApproval = async () => {
        setProgress(true);
        SPCServices.createPOReSubmission({ purchase_order_id: data?.id }).then((res => {
            setSnackbar({ alert: true, severity: "info", message: "Successfully Resubmitted the PO" })
            setApproved(true)
        })).catch(err => {
            setSnackbar({ alert: true, severity: "info", message: `Error:  ${err.code} ${err.message}` })
        }).finally(() => {
            setProgress(false);
        })
        setProgress(false);
    }

    const saveData = async () => {
        let id = pageData?.id
        let data = {
            total_tax: totalTax,
            total_discount: totalDiscount,
            po_type: POType,
            type: POType === 'F' ? "foreign" : "local",
            supplier_id: suppplierDetails?.id,
            agent_id: procurementAgent?.id,
            currency: currency,
            currency_short: currency,
            // currency_date: dateParse(new Date()),
            mode_of_dispatch: modeOfDispatch.join(" & "),
            tender_no: tenderNo,
            payment_terms: paymentTerms?.name,
            payment_terms_short: paymentTerms?.label,
            quoted_unit_price: quotedUnitPrice,
            hs_code: HSCode,
            indent_no: intentNo,
            inco_terms: incoTerms,
            conversion: conversion,
            exchange_rate: exchangeRate,
            currency_date:  currencyDate,
            local_agent_id: localAgent?.id,
            bank_details: bank ? [bank] : [],
            bank_details_id: bank?.id,
            conversion: conversion,
            freight_chargers: freightChargers,
            handl_and_packaging_charge: handlAndPackagingCharge,
            other_charge: otherCharge,
            commission: commission?.value ? commission?.value : '0',
            commission_precentage: commissionType === 'percentage' ? commission.percentage : '0',
            grand_total: parseFloat(grandTotal),
            total_payable: parseFloat(grandTotal) + parseFloat(commission?.value ?? 0),
            sub_total: subTotal,
            notes: note.toString('html'),
            additional_conditions: condition.toString('html'),
            valid_date: validUpTo,
            import_license_no: importLicenseNo,
        }

        let res = await SPCServices.changePurchaseOrder(id, data);
        if (res.status === 200) {
            setSnackbar({ alert: true, severity: "success", message: "Successfully updated the Purchase Order" });
            setUpdated(true)
            return true
        } else {
            setSnackbar({ alert: true, severity: "error", message: "Failed to update the Purchase Order" });
            return false
        }
    }

    const calCommission = (total) => {

        let tempCommissionValue = commissionValue ? parseFloat(commissionValue) : 0
        let value = 0
        let percentage = 0

        if (commissionType === 'percentage') {
            value = (total * tempCommissionValue) / 100
            percentage = tempCommissionValue
        } else {
            value = tempCommissionValue
            percentage = (tempCommissionValue / total) * 100
            percentage = percentage.toFixed(2)
        }

        setCommission({ value, percentage })
        return { value, percentage }
    }

    const handlePrintLoaded = async () => {
        try {
            setPrintLoaded(false); // Set printLoaded to false before fetching data

            const res = await SPCServices.getPurchaseOrderByID(pageData?.id);
            const { view } = res.data;

            setPrintData(view);

            // Data fetching and state updates are complete, set printLoaded to true
            setPrintLoaded(true);
        } catch (error) {
            // Handle errors here if needed
            console.error("Error fetching data:", error);
        } finally {
            setPrintLoaded(true);
        }
    };


    useMemo(() => {
        let tempFreightChargers = freightChargers ? parseFloat(freightChargers) : 0
        let tempHandlAndPackagingCharge = handlAndPackagingCharge ? parseFloat(handlAndPackagingCharge) : 0
        let tempOtherCharge = otherCharge ? parseFloat(otherCharge) : 0
        let tempGrandTotal =
            subTotal +
            tempFreightChargers +
            tempHandlAndPackagingCharge +
            tempOtherCharge

        let tempCommission = calCommission(tempGrandTotal).value

        tempGrandTotal -= tempCommission

        setGrandTotal(tempGrandTotal)
        setData({ ...data, grand_total: grandTotal, sub_total: subTotal })
    }, [freightChargers, handlAndPackagingCharge, otherCharge, commissionValue, commissionType, subTotal])



    return (
        <div style={{ width: '100%' }}>
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
                <Grid
                    item
                    lg={4}
                    md={4}
                    sm={12}
                    xs={12}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Tooltip title="Status">
                        <Chip
                            size="small"
                            label={data?.status ? `Status: ${data?.status}` : "Status: N/A"}
                            color="primary"
                            variant="outlined"
                        />
                    </Tooltip>
                </Grid>
            </Grid>
            {/* End header */}
            <ValidatorForm onSubmit={() => null}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Order Details</Typography>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <p style={{ margin: 0 }}>
                            Purchase Order No : {data?.po_no}
                        </p>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <p style={{ margin: 0 }}>
                            MSD Order List No : {data?.order_no}
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
                                    `${option?.name} - ${option?.registration_no}`
                                }
                                getOptionSelected={(option, value) =>
                                    option.name === value.name
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Supplier Name (Type 3 Letters)"
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
                                {suppplierDetails?.registration_no
                                    ? suppplierDetails?.registration_no
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
                            </FormControl>
                        )}
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <FormControl className="w-full">
                            <SubTitle title="Currency" />
                            <Autocomplete
                                className="w-full"
                                options={appconst.all_currencies}
                                value={currency ? { cc: currency } : null}
                                // value={currency ? currency : null}
                                getOptionLabel={(option) => option.cc}
                                onChange={(event, value) => {
                                    if (value?.cc === "LKR") {
                                        setExchangeRate('1');
                                    }
                                    setCurrency(value?.cc)
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
                                        value={currency}
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
                                disabled={currency?.cc === "LKR"}
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
                                validators={['isFloat', 'minNumber: 0']}
                                errorMessages={['Invalid Type', 'Qty Should be Greater-than: 0']}
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
                                    {/* <RadioGroup
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
                                        <FormControlLabel
                                            value="Sea & Air"
                                            control={<Radio />}
                                            label="Sea & Air"
                                        />
                                    </RadioGroup> */}
                                    <FormGroup style={{ display: "block" }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={modeOfDispatch.includes('Sea')} onChange={handleModeChange} value="Sea" />}
                                            label="Sea"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox checked={modeOfDispatch.includes('Air')} onChange={handleModeChange} value="Air" />}
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
                                        setValidUpTo(date || null)
                                    }}
                                />
                            </FormControl>

                            <FormControl className="w-full">
                                <SubTitle title="Bank" />
                                {/* <Autocomplete
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
                                /> */}
                                <Autocomplete
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
                    <Grid item xs={12}>
                        <Typography variant="h6">Item Details</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {!dataIsLoading && (
                            <LoonsTable
                                id={'orderList'}
                                data={tableData}
                                columns={tableColumns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: noOfData,
                                    rowsPerPage: tableData.length,
                                    page: 0,
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
                        )}

                        {dataIsLoading && (
                            <div className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Other Generals</Typography>
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
                                validators={['isFloat', 'minNumber:0']}
                                errorMessages={['Invalid Format',
                                    'Qty Should Greater-than: 0 ',]}
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
                                    validators={['isFloat', 'minNumber:0']}
                                    errorMessages={['Invalid Format',
                                        'Qty Should Greater-than: 0 ',]}
                                />
                            </FormControl>
                        )}

                        {POType === 'F' && (
                            // <FormControl className="w-full">
                            //     <SubTitle title="Commission" />
                            //     <TextValidator
                            //         fullWidth
                            //         placeholder="Commission"
                            //         InputLabelProps={{
                            //             shrink: false,
                            //         }}
                            //         type="text"
                            //         variant="outlined"
                            //         size="small"
                            //         value={commission}
                            //         onChange={(e) =>
                            //             setCommission(e.target.value)
                            //         }
                            //     // validators={['required']}
                            //     // errorMessages={['this field is required']}
                            //     />
                            // </FormControl>
                            <FormControl className="w-full">
                                <SubTitle title="Commission" />
                                <RadioGroup
                                    name="category"
                                    value={commissionType}
                                    onChange={(e) =>
                                        setCommissionType(e.target.value)
                                    }
                                    style={{ display: 'block' }}
                                >
                                    <FormControlLabel
                                        value="percentage"
                                        control={<Radio />}
                                        label="%"
                                    />
                                    <FormControlLabel
                                        value="value"
                                        control={<Radio />}
                                        label="Value"
                                    />
                                </RadioGroup>
                                <TextValidator
                                    fullWidth
                                    placeholder="Commission"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    value={commissionValue}
                                    onChange={(e) =>
                                        setCommissionValue(e.target.value)
                                    }
                                    validators={commissionType === 'percentage' ? ['isFloat', 'minNumber:0', 'maxNumber:100'] : ['isFloat', 'minNumber:0',]}
                                    errorMessages={commissionType === 'percentage' ? ['Invalid Format', 'Qty Should be Greater-than: 0 ', 'Qty Should be Less-than: 100'] : ['Invalid price format', 'Qty Should Greater-than: 0 ']}
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
                                    validators={['isFloat', 'minNumber:0']}
                                    errorMessages={['Invalid Format',
                                        'Qty Should Greater-than: 0 ',]}
                                />
                            </FormControl>
                        )}

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
                                validators={['isFloat', 'minNumber:0']}
                                errorMessages={['Invalid Format',
                                    'Qty Should Greater-than: 0 ',]}
                            />
                        </FormControl>

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
                                <Typography variant="h6">Special Conditions</Typography>
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
                                    MSD Conditions
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
                        {!dataIsLoading && ((data?.Category?.description !== "Pharmaceutical" && data?.po_type === "L") || data?.po_type === "F") && (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header3"
                                    style={accordionSummaryStyle}
                                >
                                    <Typography variant="h6">Logistic Conditions</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}>
                                            <FormControl className="w-full">
                                                <RichTextEditor
                                                    value={shippingCondition}
                                                    onChange={(value) => {
                                                        setResetOpen(true)
                                                    }}
                                                    editorClassName="custom-editor-sm"
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        // style={{ padding: '2rem 1rem' }}
                                        >
                                            <Grid container spacing={2} className='my-2'>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                    className=" w-full flex justify-end"
                                                    style={{ paddingRight: 0 }}
                                                >
                                                    <LoonsButton
                                                        className="mr-2 mt-2"
                                                        progress={dataIsLoading}
                                                        variant="contained"
                                                        startIcon="refresh"
                                                        onClick={() => {
                                                            getShippingData({ po_type: POType, order_no: data?.order_no, indent_no: intentNo, tender_no: tenderNo })
                                                            // changeShippingCondition(data)
                                                        }}
                                                    >
                                                        <span className="capitalize">
                                                            Refresh
                                                        </span>
                                                    </LoonsButton>
                                                    <LoonsButton
                                                        className="mt-2"
                                                        progress={dataIsLoading}
                                                        variant="contained"
                                                        startIcon="save"
                                                        onClick={() => {
                                                            changeShippingCondition(data)
                                                        }}
                                                    >
                                                        <span className="capitalize">
                                                            Save
                                                        </span>
                                                    </LoonsButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )}
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header3"
                                style={accordionSummaryStyle}
                            >
                                <Typography variant="h6">
                                    Rejected Reason
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <p>
                                    {data?.status}
                                </p>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* <Grid item xs={12}>
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
                    </Grid> */}
                    <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <Grid container spacing={2} className='my-2'>
                            <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                className=" w-full flex justify-end"
                                style={{ paddingRight: 0 }}
                            >
                                {/* <Button
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
                                </Button> */}
                                {userRoles.includes("SPC MA") &&
                                    <>
                                        <LoonsButton
                                            // type="submit"
                                            style={{ margin: '10px' }}
                                            color="primary"
                                            progress={progess}
                                            variant="contained"
                                            onClick={() => setSubmitOpen(true)}
                                            disabled={dataIsLoading || !updated || approved}
                                            startIcon='approval'
                                        >
                                            Submit for Approval
                                        </LoonsButton>
                                        <LoonsButton
                                            style={{ margin: '10px' }}
                                            color="primary"
                                            progress={progess}
                                            variant="contained"
                                            disabled={dataIsLoading || updated || approved}
                                            startIcon='save'
                                            onClick={() => setSaveOpen(true)}
                                        >
                                            Save
                                        </LoonsButton>
                                    </>
                                }
                            </Grid>
                        </Grid>
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

            <ConfirmationDialog
                text={"Are you sure to Reset the Logistic Condition"}
                open={resetOpen}
                onConfirmDialogClose={() => { setResetOpen(false) }}
                onYesClick={() => {
                    setResetOpen(false);
                    getShippingData({ po_type: POType, order_no: data?.order_no, indent_no: intentNo, tender_no: tenderNo });
                }}
            />
            <ConfirmationDialog
                text={"Are you sure to update the PO?"}
                open={saveOpen}
                onConfirmDialogClose={() => { setSaveOpen(false) }}
                onYesClick={() => {
                    setSaveOpen(false);
                    saveData();
                }}
            />
            <ConfirmationDialog
                text="Are you sure to submit for Approval?"
                open={submitOpen}
                onConfirmDialogClose={() => { setSubmitOpen(false) }}
                onYesClick={() => {
                    setSubmitOpen(false);
                    handleApproval()
                }}
            />
            <Dialog fullWidth="fullWidth" maxWidth="xl" open={open}>
                <DialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                    <CardTitle title="Add Item Details" />
                    <IconButton aria-label="close" className={classes.closeButton}
                        onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {/* <DialogTitle style={{ borderBottom: '1px solid #000' }}>
                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            display: 'flex',
                            padding: 3,
                            cursor: 'pointer',
                        }}
                        onClick={handleClose}
                    >
                        <CloseIcon
                            style={{ color: 'white', width: 14, height: 14 }}
                        />
                    </div>
                </DialogTitle> */}

                <DialogContent>
                    <AssignItem
                        rowData={rowData}
                        assignList={assignList}
                        updateDataTable={updateDataTable}
                        handleClose={handleClose}
                    />
                </DialogContent>
            </Dialog>
            <LoonsSnackbar
                open={snackbar.alert}
                onClose={() => {
                    setSnackbar({ alert: false })
                }}
                message={snackbar.message}
                autoHideDuration={1200}
                severity={snackbar.severity}
                elevation={2}
                variant="filled"
            ></LoonsSnackbar>
        </div>
    )
}
