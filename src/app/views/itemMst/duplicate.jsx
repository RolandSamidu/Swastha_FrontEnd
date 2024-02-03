// getUOM() {
//       let uoms = [];
//       this.state.formData.uoms.forEach(element => {
//           uoms.push(this.state.allUOMS.filter((ele) => ele.id === element.id)[0]
       
//           )
//       });
//       this.setState({
//           formData: {
//               uoms:uoms
//           }
//       })
//       setTimeout(() => {
//           console.log("uom2", uoms)
//       }, 2000);

//       return uoms;
//   }
//   async submit() {

//       let itemId = this.props.match.params.id;
//       var form_data2 = new FormData();
//       if(this.state.files.fileList.length !== 0 && this.state.files.fileList.length !== ''){
//           form_data2.append(`file`, this.state.files.fileList[0].file);
//       }
//       form_data2.append(`sr_no`, this.state.formData.sr_no)
//       form_data2.append(`serial_id`, this.state.formData.serial_id)
//       form_data2.append(`short_description`, this.state.formData.short_description)
//       form_data2.append(`item_unit_size`, this.state.formData.item_unit_size)
//       form_data2.append(`medium_description`, this.state.formData.medium_description)
//       form_data2.append(`long_description`, this.state.formData.long_description)
//       form_data2.append(`note`, this.state.formData.note)
//       form_data2.append(`group_id`, this.state.formData.group_id)
//       // form_data2.append(`stock_id`, this.state.formData.stock_id)
//       // form_data2.append(`condition_id`, this.state.formData.condition_id)
//       // form_data2.append(`abc_class_id`, this.state.formData.abc_class_id)
//       form_data2.append(`storage_id`, this.state.formData.storage_id)
//       // form_data2.append(`batch_trace_id`, this.state.formData.batch_trace_id)
//       // form_data2.append(`cyclic_code_id`, this.state.formData.cyclic_code_id)
//       // form_data2.append(`movement_type_id`, this.state.formData.movement_type_id)
//       form_data2.append(`shelf_life`, this.state.formData.shelf_life)
//       form_data2.append(`standard_cost`, this.state.formData.standard_cost)
//       // form_data2.append(`standard_shelf_life`, this.state.formData.standard_shelf_life)

//       this.state.formData.uoms.forEach((element, index) => {
//           form_data2.append(`uoms[` + index + `]`, element.id)
//       });

//       // form_data2.append(`conversion_facter`, this.state.formData.conversion_facter)
//       // form_data2.append(`pack_quantity`, this.state.formData.pack_quantity)
//       // form_data2.append(`cubic_size`, this.state.formData.cubic_size)
//       // form_data2.append(`pack_weight`, this.state.formData.pack_weight)
//       form_data2.append(`common_name`, this.state.formData.common_name)
//       form_data2.append(`primary_wh`, this.state.formData.primary_wh)
//       form_data2.append(`item_type_id`, this.state.formData.item_type_id)
//       form_data2.append(`institution_id`, this.state.formData.institution_id)
//       form_data2.append(`consumables`, this.state.formData.consumables)
//       form_data2.append(`ven_id`, this.state.formData.ven_id)
//       form_data2.append(`used_for_estimates`, this.state.formData.used_for_estimates)
//       form_data2.append(`item_usage_type_id`, this.state.formData.item_usage_type_id)
//       form_data2.append(`used_for_formulation`, this.state.formData.used_for_formulation)
//       form_data2.append(`formulatory_approved`, this.state.formData.formulatory_approved)
//       // form_data2.append(`critical`, this.state.formData.critical)
//       // form_data2.append(`nearest_round_up_value`, this.state.formData.nearest_round_up_value)
//       form_data2.append(`specification`, this.state.formData.specification)
//       // form_data2.append(`source_of_creation`, this.state.formData.source_of_creation)
//       form_data2.append(`status`, this.state.formData.status)
//       form_data2.append(`primary_id`, this.state.formData.primary_id)

//       form_data2.append(`previous_system_sr`, this.state.formData.previous_system_sr)
//       form_data2.append(`previous_sr`, this.state.formData.previous_sr)
//       form_data2.append(`dosage_code`, this.state.formData.dosage_code)

//       console.log('new Form',form_data2)
//       let res = await InventoryService.editItem(itemId,form_data2)
//       if (res.status == 200) {
//           this.setState({
//               alert: true,
//               message: 'Item has been Edited Successfully.',
//               severity: 'success',
//           })
//       } else {
//           this.setState({
//               alert: true,
//               message: 'Cannot Edit Item ',
//               severity: 'error',
//           })
//       }




//   }
//   <Grid className=" w-full" item lg={3} md={4} sm={12} xs={12} >
//   <SubTitle title="UOM" />

//   <Autocomplete
                                        disableClearable
//       className="w-full"
//       options={this.state.allUOMS.filter((ele) => ele.status == "Active")}
//       onChange={(e, value) => {
//           if (value != null) {
//               // let formData = this.state.formData;
//               let formData = this.state.formData;
//               formData.uoms =[]
//               value.forEach(element => {
//                   formData.uoms.push(element)
//               });
//               //formData.uoms = value.id
//               this.setState({ formData },()=>{
//                   console.log("formdataUOM",this.state.formData.uoms)
//               })

//           }
//       }}
//       value={this.state.formData.uoms}        
//       multiple
//       getOptionLabel={(option) => option.name}
//       renderInput={(params) => (
//           <TextValidator
//               {...params}
//               placeholder="UOM"
//               //variant="outlined"
//               fullWidth
//               variant="outlined"
//               size="small"
//           />
//       )}
//   />
// </Grid>
//    res.data.view.ItemUOM.forEach(element => {
//       uoms.push(element.UOM)
//       console.log('UOMSS',element.UOM)
//   });

{/* <Button
className="mt-2 mr-2"
progress={false}
type="submit"
scrollToTop={true}
startIcon="save"
//onClick={this.handleChange}
>
<span className="capitalize">
    Save
</span>
</Button> */}