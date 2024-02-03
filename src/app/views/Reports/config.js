export const Reports = [
    {
        reportName: 'Due on orders',
        id: 'e3d451e5-9820-fb60-8f8d-e0a9f233db31',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_from',
                placeholder: 'Order Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_to',
                placeholder: 'Order Date To',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'schedule_date_from',
                placeholder: 'Schedule Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'schedule_date_to',
                placeholder: 'Schedule Date To',
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'Item',
                required: false,
            },
            { name: 'Agents', required: false },
            // { name: "MainSupplier", required: false },
            { name: 'Category', required: false },
            { name: 'Groups', required: false },
            { name: 'Class', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Short expiry institute wise',
        id: '8595418a-744c-444c-9859-33af80324f37',
        filterFields: [
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
            },
            {
                name: 'Institute',
                required: true,
            },
            {
                name: 'Warehouse',
                required: false,

            },
            {
                name: 'Item',
                required: false,
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_exp_date',
                placeholder: 'From Exp Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_exp_date',
                placeholder: 'To Exp Date',
            },
            {
                name: 'StringSearch',
                placeholder: 'Batch No',
                eventName: 'batch_no',
                size: 3,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
        ],
    },
    {
        reportName: 'Check Stock',
        id: '947ee922-bdee-ec4f-4802-7a33924643c7',
        owner_id_fixed: false,
        filterFields: [
            { name: 'UsageType', required: false },
            { name: 'Category', required: false },
            { name: 'VenId', required: false },
            { name: 'Groups', required: false },
            { name: 'Class', required: false },
            { name: 'MainSupplier', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Short Expiery Institute',
        id: '039aca5a-14d6-43b8-a340-be1f4f2bab27',
        filterFields: [
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'Warehouse',
                required: false,
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_exp_date',
                placeholder: 'From Exp Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_exp_date',
                placeholder: 'To Exp Date',
            },
            {
                name: 'StringSearch',
                placeholder: 'Batch No',
                eventName: 'batch_no',
                size: 3,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'GRN Details',
        id: '8ebf07f3-3273-95ca-ff3f-6341dce3b4da',
        filterFields: [
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
            },
            {
                name: 'Item',
                required: false,
            },
            {
                name: 'StringSearch',
                placeholder: 'Grn No',
                eventName: 'grn_no',
                size: 3,
            },
            {
                name: 'GrnStatus',
                required: false,
            },
            {
                name: 'OrderCategory',
                required: false,
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },
            { name: 'MainSupplier', required: false },
            { name: 'Manufacturer', required: false },
            {
                name: 'StringSearch',
                placeholder: 'Batch No',
                eventName: 'batch_no',
                size: 3,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: ' Report for entity Item snap',
        id: '',
        filterFields: [
            {
                name: 'StringSearch',
                placeholder: 'Ven Name',
                eventName: 'ven_name',
                size: 3,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Report for entity Item snap',
        id: '',
        filterFields: [
            {
                name: 'StringSearch',
                placeholder: 'Ven Name',
                eventName: 'ven_name',
                size: 3,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'SPC Debit Notes',
        id: '21e5a884-0915-531c-e5b5-2f093a76dc9b',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'debit_note_from',
                placeholder: 'Order Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'debit_note_to',
                placeholder: 'Order Date To',
            },

            { name: 'MainSupplier', required: false },
            {
                name: 'Item',
                required: false,
            },

            {
                name: 'DebitNoteTypesSubTypes',
                required: false,
                placeholder: 'Debit Note Type',
                eventName: 'debit_note_type',
                size: 6,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Invoice No',
                eventName: 'invoice_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Shipment No',
                eventName: 'shipment_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'WDN No',
                eventName: 'wdn_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Wharf Ref No',
                eventName: 'wharf_ref_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'LDCN No',
                eventName: 'ldcn_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'LDCN Ref No',
                eventName: 'ldcn_ref_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'PO No',
                eventName: 'po_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Order No',
                eventName: 'order_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'Status',
                required: false,
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Report for Item Distributions',
        id: 'd9199c37-1e76-0bdd-fa2a-d100980786b9',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },
            {
                name: 'Institute',
                required: true,
                placeholder: 'From Owner ID',
                eventName: 'from_owner_id',
            },
            {
                name: 'Institute',
                required: false,
                placeholder: 'To Owner ID',
                eventName: 'to_owner_id',
            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'SR No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Non Moving Items',
        id: 'ccd12891-bac1-f640-8b0b-c9f2dcaca667',
        filterFields: [
            {
                name: 'Institute',
                required: true,
            },
            {
                name: 'Warehouse',
                required: false,
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From  Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Slow Moving Items for MSD',
        id: '19ed32ad-da25-5cc8-544c-c956c54589a1',
        filterFields: [
            {
                name: 'Warehouse',
                required: false,
                owner_id: "000"
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From  Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Slow Moving Items for Institute',
        id: '1f5cca64-9748-faa4-bfd7-f205dd940e58',
        filterFields: [
            {
                name: 'Institute',
                required: true,
                placeholder: 'Owner ID',
                eventName: 'owner_id',
                params: ['Hospital', 'RMSD Main'],

            },
            {
                name: 'Warehouse',
                required: false,
                loadWithOwner: true
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From  Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'LP Report',
        id: 'e37144a0-9024-520c-2da5-9601e5035eb5',
        filterFields: [
            {
                name: 'Institute',
                required: false,
                placeholder: 'Owner ID',
                eventName: 'owner_id',
                // params: ['Hospital', 'RMSD Main'],

            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
            },
            {
                name: 'Item',
                required: false,
            },
            { name: 'Class', required: false },
            { name: 'Groups', required: false },
            { name: 'Category', required: false },
            { name: 'ItemUsageType', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'YesNo',
                required: false,
                placeholder: 'Priority',
                eventName: 'priority',
                size: 3,
                label: "Priority"
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },


            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },

        ],
    },
    {
        reportName: 'LP Report for audit',
        id: '8c3a9394-9abf-6c34-768a-a0f1187f059f',
        filterFields: [
            {
                name: 'Institute',
                required: false,
                placeholder: 'Owner ID',
                eventName: 'owner_id',
                // params: ['Hospital', 'RMSD Main'],

            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
            },
            {
                name: 'Item',
                required: false,
            },
            { name: 'Class', required: false },
            { name: 'Groups', required: false },
            { name: 'Category', required: false },
            { name: 'ItemUsageType', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'YesNo',
                required: false,
                placeholder: 'Priority',
                eventName: 'priority',
                size: 3,
                label: "Priority"
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },


            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },



        ],
    },

    {
        reportName: 'Due on Orders irrespective of PO status',
        id: '242afcf3-03bd-f05b-b312-aba95eeff85f',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_from',
                placeholder: 'Order Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_to',
                placeholder: 'Order Date To',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'schedule_date_from',
                placeholder: 'Schedule Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'schedule_date_to',
                placeholder: 'Schedule Date To',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'po_date_from',
                placeholder: 'PO Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'po_date_to',
                placeholder: 'PO Date To',
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'Item',
                required: false,
            },
            { name: 'Agents', required: false },
            // { name: "MainSupplier", required: false },
            { name: 'Category', required: false },
            { name: 'Groups', required: false },
            { name: 'Class', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            { name: 'ItemUsageType', required: false },
            {
                name: 'YesNo',
                required: false,
                placeholder: 'Priority',
                eventName: 'priority',
                size: 3,
                label: "Priority"
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },

    {
        reportName: 'estimation',
        id: 'e07331b6-2c42-be60-bdc8-ac45840ca006',
        filterFields: [

            {
                name: 'Institute',
                required: true,
                placeholder: 'Owner ID',
                eventName: 'owner_id',
                // params: ['Hospital', 'RMSD Main'],

            },
            {
                name: 'Item',
                required: false,
            },
            {
                name: 'Warehouse',
                required: false,

            },
            { name: 'VenId', required: false },
            { name: 'Category', required: false },
            { name: 'Class', required: false },
            { name: 'UsageType', required: false },
            { name: 'Groups', required: false },
            // {
            //     name: 'StringSearch',
            //     required: false,
            //     placeholder: 'Year',
            //     eventName: 'year',
            //     size: 3,
            //     // validators: ['maxStringLength:8'],
            //     // errorMessages: ['required']
            // },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },



            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },

        ],
    },

    {
        reportName: 'All Orders irrespective of PO summary',
        id: 'dd13a0d1-b475-abbe-4980-4ee6c778346a',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_from',
                placeholder: 'Order Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'order_date_to',
                placeholder: 'Order Date To',
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'po_date_from',
                placeholder: 'PO Date From',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'po_date_to',
                placeholder: 'PO Date To',
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'Item',
                required: false,
            },
            { name: 'Agents', required: false },
            // { name: "MainSupplier", required: false },
            { name: 'Category', required: false },
            { name: 'Groups', required: false },
            { name: 'Class', required: false },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            { name: 'ItemUsageType', required: false },
            {
                name: 'YesNo',
                required: false,
                placeholder: 'Priority',
                eventName: 'priority',
                size: 3,
                label: "Priority"
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },

    {
        reportName: 'Report for Item Distributions batch wise with stvs',
        id: '75337add-6246-66a9-49ea-364e560218b6',
        filterFields: [
            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },
            {
                name: 'Institute',
                required: true,
                placeholder: 'From Owner ID',
                eventName: 'from_owner_id',
            },
            {
                name: 'Institute',
                required: false,
                placeholder: 'To Owner ID',
                eventName: 'to_owner_id',
            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'SR No',
                eventName: 'sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Start SR No',
                eventName: 'start_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'End  SR No',
                eventName: 'end_sr_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Batch No',
                eventName: 'batch_no',
                size: 3,
                // validators: ['maxStringLength:8'],
                // errorMessages: ['required']
            },
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
    {
        reportName: 'Consumptoin Monthly Report Institution wise',
        id: 'd4319acd-f174-3ac4-1782-a2ae580cf1f4',
        filterFields: [
            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Sr No',
                eventName: 'sr_no',
                size: 3,
            },
            {
                name: 'Item',
                required: true,
            },

            {
                name: 'DateSelect',
                required: false,
                eventName: 'from_date',
                placeholder: 'From Date',
            },
            {
                name: 'DateSelect',
                required: false,
                eventName: 'to_date',
                placeholder: 'To Date',
            },
            {
                name: 'Institute',
                required: false,
                placeholder: 'Owner ID',
                eventName: 'owner_id',

            },
            {
                name: 'Warehouse',
                required: false,

            },

            {
                name: 'StringSearch',
                required: false,
                placeholder: 'Search',
                eventName: 'search',
            },
        ],
    },
]
