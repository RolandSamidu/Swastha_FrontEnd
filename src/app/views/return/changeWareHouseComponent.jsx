import { Autocomplete } from "@material-ui/lab";
import { CardTitle } from "app/components/LoonsLabComponents";
import React, { useEffect, useState } from "react";
import { TextValidator } from "react-material-ui-form-validator";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Dialog } from "@material-ui/core";
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import { useDispatch, useSelector } from "react-redux";
import localStorageService from "app/services/localStorageService";
import { closewareHouseModal, getAllMovingAndNonMovingItems, getAllReturnRequests, getWareHouseDetails } from "./redux/action"

const Changewarehouse = ({ isOpen, type }) => {
  const wareHouseStatus = useSelector((state) => state?.returnReducer?.wareHouseStatus);
  const wareHouseDetails = useSelector((state) => state?.returnReducer?.wareHouseDetails);
  const [wareHouseOptions, setWarehouseOptions] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    getWareHouseDetails(dispatch, { employee_id: localStorageService.getItem("userInfo")?.id });
  }, [])

  useEffect(() => {
    console.log(wareHouseDetails, "wareHouseDetails")
    if (wareHouseStatus) {
      let details = wareHouseDetails?.map((data) => {
        return {
          warehouse: data.Warehouse,
          name: data.Warehouse.name,
          main_or_personal: data.Warehouse.main_or_personal,
          owner_id: data.Warehouse.owner_id,
          id: data.warehouse_id,
          pharmacy_drugs_stores_id: data.Warehouse.pharmacy_drugs_store_id,
        }
      });
      setWarehouseOptions(details)
    }
  }, [wareHouseStatus])

  return (
    <>
      <Dialog
        fullWidth="fullWidth"
        maxWidth="sm"
        open={isOpen}>

        <MuiDialogTitle disableTypography="disableTypography">
          <CardTitle title="Select Your Warehouse" />
        </MuiDialogTitle>

        <div className="w-full h-full px-5 py-5">
          <ValidatorForm
            onError={() => null} className="w-full">
            <Autocomplete
                                        disableClearable className="w-full"
              options={wareHouseOptions}
              onChange={(e, value) => {
                if (value != null) {
                  localStorageService.setItem('Selected_Warehouse', value);
                  if (type === "returnMode") {
                    getAllMovingAndNonMovingItems(dispatch, { warehouse_id: value?.id, page: 0, limit: 20 });
                  }
                  if (type === "returnDeliveryDetails") {
                    getAllReturnRequests(dispatch, { warehouse_id: value?.id, page: 0, limit: 20 })
                  }
                  if (type === "myAllReturnRequests-counter") {
                    getAllReturnRequests(dispatch, { page: 0, limit: 20, from: value?.id });
                    getWareHouseDetails(dispatch, { employee_id: localStorageService.getItem("userInfo")?.id });
                  }
                  if (type === "myAllReturnRequestsTobeRecieved") {
                    getAllReturnRequests(dispatch, { page: 0, limit: 20, to: localStorageService.getItem("Selected_Warehouse")?.id });
                    getWareHouseDetails(dispatch, { employee_id: localStorageService.getItem("userInfo")?.id });
                  }
                  if (type === "myAllReturnRequests") {
                    getAllReturnRequests(dispatch, { page: 0, limit: 20, to: localStorageService.getItem("Selected_Warehouse")?.id });

                  }
                  closewareHouseModal(dispatch, value.name);
                }
              }}
              value={localStorageService.getItem("Selected_Warehouse") ? localStorageService.getItem("Selected_Warehouse") : null}
              getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
              renderInput={(params) => (
                <TextValidator {...params} placeholder="Select Your Warehouse"
                  //variant="outlined"
                  fullWidth="fullWidth" variant="outlined" size="small" />
              )} />

          </ValidatorForm>
        </div>
      </Dialog>
    </>
  )


}

export default Changewarehouse;
