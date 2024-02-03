import React from 'react'
import { Redirect } from 'react-router-dom'

import dashboardRoutes from './views/dashboard/DashboardRoutes'
//import playgroundRoutes from './views/playgound/PlaygroundRoutes'
import prescriptionRoutes from './views/Prescription/PrescriptionRoutes'
import AptituteRoutes from './views/Temp/TempRoutes'
import PatientsRoutes from './views/Patients/PatientsRoutes'
import ItemRoutes from './views/itemMst/ItemRoutes'
import DataSetupRoutes from './views/data-setups/DataSetupRoutes'
import warehouseRoutes from './views/warehouse/warehouseRoutes'
import msdRoutes from './views/MSD/msdRoutes'
import spcRoutes from './views/SPC/spcRoutes'
import orderRoutes from './views/orders/orderRoutes'
import VehicleRoutes from './views/Vehicles/VehicleRoutes'
import ConsignmentRoutes from './views/Consignments/ConsignmentRoutes'
import IssueRoutes from './views/RaiseIssue/IssueRoutes'
import HospitalOrderingRoutes from './views/orders/HospitalOrderingRoutes'
import distributionRoutes from './views/Distribution/distributionRoutes'
import CPRoutes from './views/ChiefPharmacist/CPRoutes'
import WardRoutes from './views/Ward/WardRoutes'
import returnRoutes from './views/return/returnRoutes'
import orderRoutesMDS from './views/MDS_Create_Orders/orderRoutes'
import CPRoutesMDS from './views/MDS_ChiefPharmacist/MDS_CPRoutes'
import EstimationRoutes from './views/Estimations/EstimationsRoutes'
import DirectorRoutesMDS from './views/MDS_Director/MDS_DirectorRoutes'
import MSDNewRoutes from './views/MSD_Distribution_officer/MSDAllOrdersRoute'
import orderRoutesRMSD from './views/RMSD/orderRoutes'
import MainDrugStoreRoutes from './views/Main_Drug_Store/MainDrugStoreRoutes'
import MSDMSA from './views/MSD_Medical_Supply_Assistant/MSD_MSA_Route'
import MSDGatePassRoutes from './views/MSD-GatePass/MSDGatePassRoutes'
import MSDWarehouse from './views/MSD-warehouse/MSDWarehouse'
import MRORoutes from './views/MRO/MRORoutes'
import RMSDRoutes from './views/RMSD_AllOrder_IndividualOrder/RMSDRoutes'
import DonationsRoutes from './views/Donations/DonationsRoutes'
import stvRoutes from './views/STV/StvRoutes'
import DrugBalancingRoutes from './views/DrugBalancing/DrugBalancingRoutes'
import QARoutes from './views/QAprocess/QARoutes'
import RefferencesRoute from './views/RefferenceFiles/RefferencesRoute'
import ARVRoutes from './components/LoonsLabComponents/WidgetComponent/ARV/ARVRoutes'
import ProceduresRouts from './components/LoonsLabComponents/WidgetComponent/Procedures/ProceduresRouts'
import CardiovascularRoutes from './components/LoonsLabComponents/WidgetComponent/Cardiovascular/CardiovascularRoutes'
import NewWarehouse from './views/WarehouseNew/NewWarehouse'
import OrderingRoutes from './views/ordering/orderingRoutes'
import EMMRoutes from './views/EMMR/EMMRoutes'
import MSMIS_Print from './views/MSD_Medical_Supply_Assistant/MSMIS_Print/MSMIS_Print_Routes'
import OrderConfigRoutes from './views/OrderConfig/OrderConfigRoutes'
import voucherRoutes from './views/Voucher/voucherRoutes'
import fundRoutes from './views/Fund/fundRoutes'
import PricingRoutes from './views/Pricing/PricingRoutes'
import LocalPurchaseRoutes from './views/LocalPurchase/LocalPurchaseRoutes'
import accountantRoutes from './views/Accountant/accountantRoutes'
import moveItemsRoutes from './views/MoveItems/moveItemsRoutes'
import CashSalesRoutes from './views/CashSales/CashSalesRoutes'
import LedgerRoute from './views/Legder/LedgerRoute'
import GRNRoute from './views/GRNDetails/GrnDetailsRoutes'
import StockInquiryRoutes from './views/StockInquiry/StockInquiryRoutes'
import dashboarComponentdRoutes from './views/DashboardReport/dashboarComponentdRoutes'
import PreStockCheckRoutes from './views/StockVerification/PreStockCheck/PreStockCheckRoutes'
import PrepareStockTakeRoutes from './views/StockVerification/PrepareStockTake/PrepareStockTakeRoutes'
import AssignEmployeesRoutes from './views/StockVerification/AssignEmployees/AssignEmployeesRoutes'
import HeadPreStockCheckRoutes from './views/StockVerification/HeadPreStock/HeadPreStockCheckRoutes'
import PharmacistViewManageRoutes from './views/StockVerification/Pharmacist/PharmacistViewManageRoutes'
import InstitutionViewManageRoutes from './views/StockVerification/InstitutionAcc/InstitutionViewManageRoutes'
import StockVerificationApprovalRoutes from './views/StockVerification/VerificationApproval/StockVerificationApprovalRoutes'



import InstitutionStockRoutes from './views/InstitutionStock/InstitutionStock_Route'
import reportRoutes from './views/Reports/ReportRoutes'
import RegisterExternalCustomers from './views/ExternalCustomers/RegisterExternalCustomersRoutes'
import tempRoutes from './components/LoonsLabComponents/DashboardComponent/Hospitalwidgets/tempRoutes'
import HospitalUserRoutes from './views/MSDDatasetup/HospitalUserRoutes'
import PreStockCheckRoute from './views/PreStockCheck/PreStockCheckRoute'
import OrderControlRoutes from './views/OrderControlForm/OrderControlRoutes'

const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to="/dashboard" />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to="/session/404" />,
    },
]

const routes = [
    ...dashboardRoutes,
    ...prescriptionRoutes,
    ...AptituteRoutes,
    ...accountantRoutes,
    ...PatientsRoutes,
    ...DataSetupRoutes,
    ...warehouseRoutes,
    ...VehicleRoutes,
    ...msdRoutes,
    ...ItemRoutes,
    ...spcRoutes,
    ...voucherRoutes,
    ...fundRoutes,
    ...orderRoutes,
    ...VehicleRoutes,
    ...ConsignmentRoutes,
    ...IssueRoutes,
    ...HospitalOrderingRoutes,
    ...distributionRoutes,
    ...CPRoutes,
    ...WardRoutes,
    ...orderRoutesMDS,
    ...EstimationRoutes,
    ...CPRoutesMDS,
    ...DirectorRoutesMDS,
    ...MSDNewRoutes,
    ...orderRoutesRMSD,
    ...MainDrugStoreRoutes,
    ...MSDGatePassRoutes,
    ...MRORoutes,
    ...MSDWarehouse,
    ...MSDMSA,
    ...RMSDRoutes,
    ...DonationsRoutes,
    ...stvRoutes,
    ...ARVRoutes,
    ...MSMIS_Print,
    ...CardiovascularRoutes,
    ...ProceduresRouts,
    ...EMMRoutes,
    ...RefferencesRoute,
    ...redirectRoute,
    ...QARoutes,
    ...DrugBalancingRoutes,
    ...NewWarehouse,
    ...returnRoutes,
    ...OrderingRoutes,
    ...OrderConfigRoutes,
    ...PricingRoutes,
    ...LocalPurchaseRoutes,
    ...moveItemsRoutes,
    ...CashSalesRoutes,
    ...LedgerRoute,
    ...dashboarComponentdRoutes,
    ...GRNRoute,
    ...PreStockCheckRoutes,
    ...PrepareStockTakeRoutes,
    ...AssignEmployeesRoutes,
    ...HeadPreStockCheckRoutes,
    ...PharmacistViewManageRoutes,
    ...InstitutionViewManageRoutes,
    ...PreStockCheckRoute,


    ...StockInquiryRoutes,
    ...InstitutionStockRoutes,
    ...reportRoutes,
    ...RegisterExternalCustomers,
    ...tempRoutes,
    ...HospitalUserRoutes,
    ...StockVerificationApprovalRoutes,
    ...OrderControlRoutes,
    ...errorRoute,


]

export default routes
