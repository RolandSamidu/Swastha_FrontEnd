import ConsignmentService from 'app/services/ConsignmentService';
import DonarService from 'app/services/DonarService';
import { includes } from 'lodash';

export async function divideAndMergeArray(items, chunkSize) {
  const chunkedArrays = [];

  // Split the items array into smaller chunks
  for (let i = 0; i < items.length; i += chunkSize) {
    chunkedArrays.push(items.slice(i, i + chunkSize));
  }

  const packData = [];

  // Call the getPackDetails function for each chunk and merge the results
  for (const chunk of chunkedArrays) {
    const chunkPackData = await getPackDetailsByIds(chunk);
    packData.push(...chunkPackData);
  }

  return packData;
}


export const getPackDetails = async (allItems) => {
  const chunkSize = 50; // You can adjust this value as needed
  const mergedPackData = await divideAndMergeArray(allItems, chunkSize);
  return mergedPackData;
}

export const getPackDetailsByIds = async (allItems) => {

  if (allItems.length > 0) {

    // console.log('checking incomming itemIds', details.map((item) => item.item_id))
    //console.log('checking incomming batchNo', batchNo)
    let item_ids = allItems?.map((item) => item.OrderItem.item_id)
    let batchNo = allItems?.map((dataset) => dataset.ItemSnapBatchBin?.ItemSnapBatch?.batch_no)
    let itemBatchArray = [];
    itemBatchArray = allItems?.map((item) => ({
      item_id: item.OrderItem.item_id,
      batch_no: item.ItemSnapBatchBin.ItemSnapBatch.batch_no,
      quantity: item.allocated_quantity,
      min_pack_size: item?.ItemSnapBatchBin?.ItemSnapBatch?.pack_size

    }));
    let params1 = {
      search_type: 'packingonly',
      batch_no: batchNo,
      item_id: item_ids,
      'order[0]': ['level', 'DESC'],
    }
    let params2 = {
      batch_no: batchNo,
      item_id: item_ids,
      'order[0]': ['package_qunatity', 'DESC'],
    }
    let params3 = {
      item_id: item_ids,
      batch_no: batchNo
    }

    // get packsize from consignemt items
    let res1 = await ConsignmentService.getConsignmentItems(params1)

    // get packisize from donations
    let res2 = await DonarService.getDonationDet(params2)

    // get packisize from temp pack size
    let res3 = await ConsignmentService.getTempPacksize(params3)


    console.log("pack size res 1", res1)
    console.log("pack size res 2", res2)
    console.log("pack size res 3", res3)

    let packageDataFinal = [];

    for (let index = 0; index < itemBatchArray.length; index++) {

      let element = itemBatchArray[index];

      const filteredItems = res1?.data?.view?.data?.filter(item => {
        const item_id = item?.item?.item_schedule?.Order_item?.item_id;
        const batch_nos = item?.item?.Batch?.map(batch => batch.batch_no);

        return item_id === element?.item_id && batch_nos.includes(element.batch_no);
      });

      // Log the filtered items
      if (filteredItems.length > 0) {// First Check
        let responseData = await getPackDetaFromConsingmentData(filteredItems, element)
        console.log("element from 1", element)
        console.log("element from response 1", responseData)
        packageDataFinal.push(responseData)
      } else {
        //starting second checking
        let packingData = res2?.data?.view?.data?.filter(
          (ele) => (ele?.DonationItemsBatch?.DonationItem?.item_id == element?.item_id && ele?.DonationItemsBatch?.batch_no == element.batch_no)
        );
        // Sort array by package quantity
        packingData.sort((a, b) => b.package_qunatity - a.package_qunatity);
        if (packingData.length > 0) {
          let responseData = await getPackDetaFromDonationData(packingData, element)
          packageDataFinal.push(responseData)
          console.log("element from 2", element)
          console.log("element from response 2", responseData)
        } else {
          //therd one
          let packingData = res3?.data?.view?.data.filter(
            (ele) => (ele?.item_id == element?.item_id && ele?.batch_no == element.batch_no)
          );
          if (packingData.length > 0) {

            let responseData = await getPackDetaFromTempPack(packingData[0], element)
            console.log("element from response 3", responseData)
            packageDataFinal.push(responseData)
          } else {
            //Cannot find the pack size
            console.log("element from 4", element)
            console.log("element wich is not pack size", element)
            let responseData = await getPackDetaFromMinPackSize(element)
            console.log("element from response 4", responseData)
            packageDataFinal.push(responseData)

          }

          // let responseData = getPackDetaFromTempPack(res3.data.view.data, itemBatchArray[index])
        }

      }
    }

    return packageDataFinal
    // console.log("final data", packageDataFinal)
  } else {
    return []
  }
}

const getPackDetaFromConsingmentData = async (packingData, element) => {
  let newPackingData = []
  const uniqueKeys = new Set();
  console.log("element from 1 packingData", packingData)
  for (const item of packingData) {
    const itemKey = JSON.stringify([item.level, item.quantity, item.conversation]);
    if (!uniqueKeys.has(itemKey)) {
      uniqueKeys.add(itemKey);
      newPackingData.push({
        level: item.level,
        quantity: item.quantity,
        conversation: item.conversation
      });
    }
  }





  let remainingQty = Number(element.quantity);
  let packingDetails = []
  for (let i = 0; i < newPackingData.length; i++) {
    let currentLevelData = newPackingData[i];
    if (remainingQty <= 0) {
      // Stop dividing if remainingQty is 0 or lowest level reached
    } else {

      let currentLevelQty = Math.floor(Number(remainingQty) / Number(currentLevelData.quantity));
      //remainingQty %= Number(currentLevelData.quantity);
      remainingQty = remainingQty % Number(currentLevelData.quantity);

      if (currentLevelQty > 0) {
        packingDetails.push((currentLevelData.conversation == '' || currentLevelData.conversation == null) ? currentLevelData.quantity + '(' + currentLevelQty + ")" : currentLevelData.conversation + '(' + currentLevelQty + ")");
      } else if ((Number(remainingQty) / Number(currentLevelData.quantity)) > 0 && (newPackingData.length - 1) == i) {
        packingDetails.push(Number(element.min_pack_size) + '(' + Number(remainingQty) / Number(element.min_pack_size) + ")");

      }
    }
  }

  if (packingDetails.length > 0) {
    //element.packingdetails = packingDetails.join(', ');
    element.packingdetails = packingDetails;
  } else {
    element.packingdetails = []

  }

  //console.log("packing detail res1", element)
  return element

}

const getPackDetaFromDonationData = async (packingData, element) => {

  let highestQty = packingData[0]?.package_qunatity;
  let highestConversation = packingData[0]?.conversion;

  if (element.quantity % highestQty === 0) {
    // element.quantity can be divided evenly by highestQty
    let data = element.quantity / highestQty;

    if (highestQty > 0 && data !== undefined && data !== null) {
      // Assign packing details: highest value. conversation X element.qty
      element.packingdetails = [highestConversation + '(' + Math.floor(data) + ')'];
    }
  } else {
    let remainingQty = element.quantity;
    let packingDetails = [];

    for (let i = 0; i < packingData.length; i++) {
      let currentLevelData = packingData[i];

      if (remainingQty <= 0) {
        break; // Stop dividing if remainingQty is 0 or lowest level reached
      }

      let currentLevelQty = Math.floor(remainingQty / currentLevelData.package_qunatity);
      remainingQty %= currentLevelData.package_qunatity;

      if (currentLevelQty > 0) {
        packingDetails.push(currentLevelData.conversion + '(' + currentLevelQty + ")");
      }
    }

    if (remainingQty > 0) {
      // Check if there is a lower level available
      let lowerLevelData = packingData.find((data) => data.package_quantity === packingData[1]?.package_quantity);
      // console.log('testing-highestConversation', highestConversation);

      if (lowerLevelData) {
        let data = remainingQty / lowerLevelData.package_quantity;
        packingDetails.push(lowerLevelData.conversion + 'X' + Math.floor(data));
      }
    }

    if (packingDetails.length > 0) {
      //element.packingdetails = packingDetails.join(', ');
      element.packingdetails = packingDetails;
    } else {
      element.packingdetails = []
    }
  }
  console.log("packing detail", element)
  return element

}


const getPackDetaFromTempPack = async (packData, element) => {
  let packLevels = [Number(packData.level_one), Number(packData.level_two), Number(packData.level_three), Number(packData.level_four), Number(packData.level_five)]

  let conversation = "";
  let conversationalArray = []


  for (let index = 0; index < packLevels.length; index++) {
    const packLevelsElement = packLevels[index];
    if (index == 0) {
      conversation = packLevelsElement
      conversationalArray.push({ conversation: conversation, total_qty: packLevelsElement })
    } else if (packLevelsElement != 0) {
      conversation = conversation + "X" + packLevelsElement / packLevels[index - 1]
      conversationalArray.push({ conversation: conversation, total_qty: packLevelsElement })
    }
  }

  console.log("conversation", conversationalArray)

  let reverseArray = conversationalArray.reverse()
  console.log("conversation reverse", reverseArray)

  let remainingQty = element.quantity;
  let packingDetails = []

  for (let i = 0; i < reverseArray.length; i++) {
    let currentLevelData = reverseArray[i];

    if (remainingQty <= 0) {
      break; // Stop dividing if remainingQty is 0 or lowest level reached
    }

    let currentLevelQty = Math.floor(remainingQty / currentLevelData?.total_qty);
    remainingQty %= currentLevelData.total_qty;

    if (currentLevelQty > 0) {
      packingDetails.push(currentLevelData?.conversation + '(' + currentLevelQty + ")");
    }
  }

  if (packingDetails.length > 0) {
    //element.packingdetails = packingDetails.join(', ');
    element.packingdetails = packingDetails;
  } else {
    element.packingdetails = []

  }

  console.log("packing detail", element)
  return element

}


const getPackDetaFromMinPackSize = async (element) => {
  let packingDetails = []
  let min_pack_size = Number(element.min_pack_size)
  if (min_pack_size > 0) {
    packingDetails.push(Number(min_pack_size) + '(' + (element.quantity / min_pack_size) + ")");
  }



  if (packingDetails.length > 0) {
    //element.packingdetails = packingDetails.join(', ');
    element.packingdetails = packingDetails;
  } else {
    element.packingdetails = []

  }

  console.log("packing detail 4", element)
  return element

}

