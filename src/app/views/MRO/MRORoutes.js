import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MRORoutes = [

   {
      path: '/mro/patients/info/:id',
      component: React.lazy(() => import('./MROPatientsInfo')),
      auth: authRoles.mro,
  },
    {
        path: '/mro/patients/search',
        component: React.lazy(() => import('./MROPatientsSearch')),
        auth: authRoles.mro,
    },
    {
        path: '/mro/patients/midnightreports',
        component: React.lazy(() => import('./MROMidNightReport')),
        auth: authRoles.mro,
    },
    {
        path: '/mro/patients/emmrlogin',
        component: React.lazy(() => import('./MROLoginToEIMMR')),
        auth: authRoles.mro,
    },
    {
        path: '/mro/patients/emmrsearch',
        component: React.lazy(() => import('../EMMR/EMMRSearch')),
        auth: authRoles.mro,
    },
]

export default MRORoutes


// {
//       name: 'action',
//       label: 'Action',
//       options: {
//           filter: true,
//           display: true,
//           customBodyRender: (value, tableMeta, updateValue) => {
//               let id = this.state.data[tableMeta.rowIndex].id
//               return (
//                   <Grid className='flex items-center'>
//                       <Tooltip title='Admit'>
//                           <IconButton
//                               disabled={(this.state.data[tableMeta.rowIndex].status == 'Admitted') || (this.state.data[tableMeta.rowIndex].status == 'Discharged') || (this.state.data[tableMeta.rowIndex].status == 'Transfer')}
//                               onClick={() => {
//                                   console.log('clicked')
//                                   let selected_data = this.state.data[tableMeta.rowIndex]
//                                   console.log('clicked', selected_data)
//                                   this.setState({ selectedPatient: selected_data, admissiondialogView: true })

//                               }}
//                           >
//                               <PersonAddIcon color='secondary' />
//                           </IconButton>
//                       </Tooltip>
//                       <Tooltip title='Transfer'>
//                           <IconButton
//                               disabled={(this.state.data[tableMeta.rowIndex].status == 'Pending') || (this.state.data[tableMeta.rowIndex].status == 'Transfer') || (this.state.data[tableMeta.rowIndex].status == 'Discharged')}
//                               onClick={() => {
//                                   console.log('clicked')
//                                   let selected_data = this.state.data[tableMeta.rowIndex]
//                                   console.log('clicked', selected_data)
//                                   this.setState({ selectedPatient: selected_data, trasnsferDialogView: true })
//                               }}
//                           >
//                               <TransferWithinAStationIcon />
//                           </IconButton>
//                       </Tooltip>
//                       <Tooltip title='Discharge'>
//                           <IconButton
//                               disabled={(this.state.data[tableMeta.rowIndex].status == 'Discharged')}
//                               onClick={() => {
//                                   console.log('clicked')
//                                   let selected_data = this.state.data[tableMeta.rowIndex]
//                                   console.log('clicked', selected_data)
//                                   this.setState({ selectedPatient: selected_data, dischargeDialogView: true })
//                               }}
//                           >
//                               <CancelIcon color='error' />
//                           </IconButton>
//                       </Tooltip>
//                       <Tooltip title='Prescription'>
//                           <IconButton
//                               onClick={() => {
//                                   console.log('clicked')
//                                   let selected_data = this.state.data[tableMeta.rowIndex]
//                                   console.log('clicked', selected_data)
//                                   window.dashboardVariables=selected_data;
//                                   console.log("dashboard Variables",window.dashboardVariables)

//                                   window.location = `/mro/patients/info/${id}`
                                 
//                               }}
//                           >
//                               <PersonAddIcon color='secondary' />
//                           </IconButton>
//                       </Tooltip>
//                   </Grid>
//               )
//           },
//       },
//   },
