
import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { linkToOrder } from "./redux/action";



const LinkToOrderScreens = ({ id, screen }) => {
  const history = useHistory();
  const linkToOrderStatus = useSelector(state => state?.returnReducer?.orderLinkStatus);
  const LinkToOrderData = useSelector(state => state?.returnReducer?.orderLink);

  const dispatch = useDispatch();

  useEffect(() => {
    linkToOrder(id, dispatch);
  }, []);



  const navigate = () => {
    if (LinkToOrderData.length != 0) {
      let id = LinkToOrderData[0]?.id;
      if (screen === "requestedByMe") {
        const deliveryPersonId = LinkToOrderData[0]?.Delivery?.Employee?.id
        history.push(`/hospital-ordering/all-items/${id}?pickUpPersonID=${deliveryPersonId}`);
      } else if (screen === "requestedToMe") {
        let orderId = LinkToOrderData[0]?.order_id;
        let employeName = LinkToOrderData[0]?.Employee?.name;
        let contactNo = LinkToOrderData[0]?.Employee?.contact_no;
        let status = LinkToOrderData[0]?.status;
        history.push(`/msa_all_order/all-orders/order/${id}/null/${orderId}/${encodeURI(employeName)}/${contactNo}/${status}/Return`)
      }
    }
  }

  return (
    <>
      <Button style={{ height: "40px", width: "150px", color: "white", backgroundColor: "blue" }} onClick={navigate}>Navigate to Order</Button>
    </>
  )


}



export default LinkToOrderScreens;