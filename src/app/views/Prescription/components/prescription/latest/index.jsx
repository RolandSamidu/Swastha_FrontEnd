import React from 'react';
import { withStyles } from '@material-ui/styles';
import Titles from './titles';
import { useState } from 'react';
import { format } from 'date-fns';
import TableHead from './tableHead';
import TableFoot from './tableFoot';
import Legends from './legends';
import Row from './row';
import { CardTitle, LoonsSnackbar } from "app/components/LoonsLabComponents";
import { Button, CircularProgress, Grid, Chip, Dialog, IconButton } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PrescriptionService from 'app/services/PrescriptionService';
import { useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DoneIcon from '@material-ui/icons/Done';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import PrintPrescription from '../PrintPrescription';
import PatientSummaryNew from 'app/views/dashboard/Summary/PatientSummaryNew';
import PatientReferral from 'app/views/dashboard/Summary/PatientReferral';
import CloseIcon from '@material-ui/icons/Close';
import PharmacyService from 'app/services/PharmacyService';
import moment from "moment";
import _ from "lodash";

const styles = (theme) => ({
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
    btnContainer: {
        display: 'flex',
        justifyContent: 'end',
        marginTop: 10,
        marginBottom: 10
    },
    roundButton: {
        borderRadius: 20,
        padding: '5px 10px',
        background: '#06b6d4',
        color: 'white',
        margin: '1px',
        minWidth: '10em'
    },
    roundButtonOutline: {
        borderRadius: 20,
        padding: '5px 10px',
        background: 'white',
        border: '1px solid #06b6d4',
        color: '#06b6d4',
        margin: '1px',
        minWidth: '10em'
    }
}
);

const LatestPrescription = (props) => {
    const { classes, latest, clinic, patientClinic, favourites, fetchFavItem, favouritesItems, allergedrugList, patientInfo, old, warehouses, pharmacies } = props;
    const [editing, setEditing] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState(null);
    const [drugList, setDrugList] = useState([]);
    const [drugListStore, setDrugListStore] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewSnack, setViewSnack] = useState("");
    const [snackType, setSnackType] = useState("");
    var [snackMassage, setSnackMassage] = useState("");
    var [severity, setSeverity] = useState("success");

    var [selectedFavourites, setSelectedFavourites] = useState([]);
    const [patientSummeryView, setPatientSummeryView] = useState(false);
    const [patientSummeryForEMR, setPatientSummeryForEMR] = useState(false);
    const [patientReferralView, setPatientReferralView] = useState(false);
    const [drugObj, setDrugObj] = useState('');
    const [clear, setClear] = useState(false);

    var [favouriteView, setAddFavouriteView] = useState(false)
    var [favouriteName, setFavouriteName] = useState(null)
    const [favSubbmitting, setFavSubbmitting] = useState(false);
    const vertical = 'bottom';
    const horizontal = 'center';

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    const removeDrugByIndex = (drug, pos) => {
        const filtered = [...drugList].filter((item, pos) => !_.isEqual(item, drug));
        setDrugList(filtered)

        /*    if (drug.drug_id == null) {
               const filtered = [...drugList].filter((item, pos) => item.drug !== drug.drug);
               setDrugList(filtered)
           } else {
              const filtered = [...drugList].filter((item, pos) => item.drug_id !== drug.drug_id);
               setDrugList(filtered)
           } */

    }


    const checkIncludes = (value) => {
        let i = drugList.indexOf(value);
        let newDrugList = drugList;
        let count = 0;
        if (i > -1) {
            // newDrugList.splice(i, 1);
        }

        /*   const isFound = newDrugList.some(element => {
              //.split(' ')[0]
              if (element.drug === value.drug) {
                  console.log("check includes element no")
                  return true;
              } else {
                  console.log("check includes element no")
                  return false;
              }
          }); */


        newDrugList.forEach(element => {
            if (element.drug && value.drug && element.drug.split(' ')[0] === value.drug.split(' ')[0]) {
                console.log("check includes element yes")
                count++;
            }
        });

        if (count > 1) {
            return true;
        } else {
            return false;
        }



        //return isFound;
    }



    const checkAllergic = (value) => {
        let i = drugList.indexOf(value);
        let newDrugList = allergedrugList;
        console.log("allergic drugs", value)
        console.log("allergic drugs list", newDrugList)
        let count = 0;
        if (i > -1) {
            // newDrugList.splice(i, 1);
        }

        newDrugList.forEach(element => {
            if (element.sr_no === value.sr_no) {
                console.log("check allergiec element yes")
                count++;
            }
        });

        if (count > 0) {
            return true;
        } else {
            return false;
        }



        //return isFound;
    }



    const updateMyStocks = async (drugs) => {
        const warehouse = warehouses;
        const pharmacy = pharmacies;
        console.log("colling")

        const stocks = await PharmacyService.getDrugStocks({
            "warehouse_id": warehouse,
            "items": drugs.map(a => a.drug_id),
            "zero_needed": true,
            main_needed: true,
            pharmacy_drugs_store_id: pharmacy
        });
        const recs = stocks.data.posted ? stocks.data.posted.data : [];
        setDrugListStore(recs);
    }

    useEffect(() => {
        console.log("LAT", latest);
        if (latest) {
            if (favouritesItems) {
                setDrugList([...latest.drugs, ...favouritesItems.drugs]);
                updateMyStocks([...latest.drugs, ...favouritesItems.drugs]);
            } else {
                setDrugList(latest.drugs);
                updateMyStocks(latest.drugs);
            }
        } else {
            setDrugList([]);
            updateMyStocks([]);
        }
    }, [latest]);

    // useEffect(() => {
    //     updateMyStocks(drugList);
    // }, [drugList]);

    useEffect(() => {
        if (favouritesItems) {
            console.log("letest favouritesItems", favouritesItems)
            if (latest) {
                setDrugList([...latest.drugs, ...favouritesItems.drugs]);
                updateMyStocks([...latest.drugs, ...favouritesItems.drugs]);
            } else {
                setDrugList(favouritesItems.drugs);
                updateMyStocks(favouritesItems.drugs);
            }
        }
    }, [favouritesItems]);



    const onSubmit = async () => {
        if (drugObj) {
            console.log("drugObj", drugList);
            setSeverity("error");
            setSnackMassage("Unsubmitted drugs available. Please Save the Drug first");
            setViewSnack(true)

            /* if (!window.confirm("Unsubmitted drugs available. Do you want to continue?")) {
                return;
            } */
        } else {
            console.log("drugObj", drugList);
            if (drugList.length < 1) {
                // alert("No drug lines available");
                setSeverity("error");
                setSnackMassage("No drug lines available");
                setViewSnack(true)
                return;
            }

            setLoading(true);
            const drugsArr = [];

            for (let i = 0; i < drugList.length; i++) {
                const drug = drugList[i];
                drug.quantity = 0

                for (let index = 0; index < drug.params.length; index++) {
                    const obj = drug.params[index];
                    console.log("drug obj 123", obj)
                    if (drug.params.length > 1) {
                        drug.quantity += (Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength);

                        console.log("quantity", drug.quantity)

                        if (drug.params.length == index + 1) {
                            if (obj.is_dosage_count == "0") {
                                //drug.quantity = Number(obj.dosage)
                                //drug.params[index].quantity = Number(obj.dosage)
                                drug.quantity = 1
                                drug.params[index].quantity = 1
                            } else {
                                if (drug.sr_no == null) {
                                    drug.quantity = 0;
                                    drug.params[index].quantity = 0;
                                } else {
                                    drug.quantity = Math.ceil(drug.quantity)
                                    drug.params[index].quantity = drug.quantity
                                }
                            }
                        } else {
                            drug.params[index].quantity = 0
                        }



                    } else {


                        if (obj.is_dosage_count == "0") {
                            //drug.quantity = Number(obj.dosage);
                            // drug.params[index].quantity = Number(obj.dosage);
                            drug.quantity = 1;
                            drug.params[index].quantity = 1;

                        } else {
                            if (drug.sr_no == null) {
                                drug.quantity = 0;
                                drug.params[index].quantity = 0;
                            } else {
                                drug.quantity += Math.ceil((Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength));
                                drug.params[index].quantity = Math.ceil(Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1) / Number(drug.strength))
                            }

                            console.log("quantity check", drug)
                        }
                    }


                }


                drug.drug_name = drug.drug;
                drug.sr_no = drug.sr_no;
                drug.type = drug.availability && drug.sr_no ? "IS" : "OS";
                if (!drug.drug_id) {
                    delete drug.drug_id;
                }

                /*  if(drug.drug_name!=drug.ItemSnap.name){
                     setSeverity("error");
                     setSnackMassage("Mismatch Drugs are ");
                     setViewSnack(true)
                 } */
                 if (drug.quantity == null) {
                    setTimeout(() => {
                        setSeverity("error");
                    setSnackMassage("Item adding was not successful!Please delete '"+drug.drug_name+"' and add it once again.Thank you!");
                    setViewSnack(true)
                    }, 1000);
                    
                }

                drugsArr.push(drug);
            }





            /*   drugList.forEach((drug) => {
                  drug.quantity = 0;
                  drug.params.forEach((obj, index) => {
                      if (drug.params.length > 1) {
                          drug.quantity += (Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength);
  
                          if (drug.params.length == index + 1) {
                              if (obj.is_dosage_count == "0") {
                                  //drug.quantity = Number(obj.dosage)
                                  //drug.params[index].quantity = Number(obj.dosage)
                                  drug.quantity = 1
                                  drug.params[index].quantity = 1
                              } else {
                                  if (drug.sr_no == null) {
                                      drug.quantity = 0;
                                      drug.params[index].quantity = 0;
                                  } else {
                                      drug.quantity = Math.ceil(drug.quantity)
                                      drug.params[index].quantity = drug.quantity
                                  }
                              }
                          } else {
                              drug.params[index].quantity = 0
                          }
  
  
  
                      } else {
  
  
                          if (obj.is_dosage_count == "0") {
                              //drug.quantity = Number(obj.dosage);
                              // drug.params[index].quantity = Number(obj.dosage);
                              drug.quantity = 1;
                              drug.params[index].quantity = 1;
  
                          } else {
                              if (drug.sr_no == null) {
                                  drug.quantity = 0;
                                  drug.params[index].quantity = 0;
                              } else {
                                  drug.quantity += Math.ceil((Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength));
                                  drug.params[index].quantity = Math.ceil(Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1) / Number(drug.strength))
                              }
  
                              console.log("quantity check", drug.quantity)
                          }
                      }
                  });
                  drug.drug_name = drug.drug;
                  drug.sr_no = drug.sr_no;
                  drug.type = drug.availability && drug.sr_no ? "IS" : "OS";
                  if (!drug.drug_id) {
                      delete drug.drug_id;
                  }
  
                  drugsArr.push(drug);
              })
   */
            const param = {
                clinic_id: window.dashboardVariables.clinic_id,
                doctor_id: JSON.parse(await localStorage.getItem('userInfo')).id,
                patient_id: window.dashboardVariables.patient_id,
                doctor_remark: "",
                owner_id: JSON.parse(await localStorage.getItem('Login_user_Hospital')).owner_id,
                drugs: drugsArr,
                latest_update_date_time: new Date().toJSON().slice(0, 19).replace('T', ' '),
            }

            console.log("sending Drug list", param)
            PrescriptionService.createPrescription(param).then((out) => {
                console.log(out.status);
                if (out.status !== 200 && out.status !== 201) {
                    setSeverity("error");
                    setSnackMassage("Error occured Status");
                    setViewSnack(true)
                } else {
                    //handlePrintClick()
                    setPatientSummeryForEMR(true)
                    setPatientSummeryView(true)

                    setSeverity("success");
                    setSnackMassage("Prescription Submitted");
                    setViewSnack(true)
                }
                setLoading(false);

            }).catch((e) => {
                setSeverity("error");
                setSnackMassage("Error occured Exception");
                setViewSnack(true)
                setLoading(false);

            })
        }


    }



    const onAddFavourite = async () => {
        if (drugObj) {
            console.log("drugObj", drugList);
            setSeverity("error");
            setSnackMassage("Unsubmitted drugs available. Please Save the Drug first");
            setViewSnack(true)

            /* if (!window.confirm("Unsubmitted drugs available. Do you want to continue?")) {
                return;
            } */
        } else {
            console.log("drugObj", drugList);
            if (drugList.length < 1) {
                // alert("No drug lines available");
                setSeverity("error");
                setSnackMassage("No drug lines available");
                setViewSnack(true)
                return;
            }

            setFavSubbmitting(true);
            const drugsArr = [];

            for (let i = 0; i < drugList.length; i++) {
                const drug = drugList[i];
                drug.quantity = 0

                for (let index = 0; index < drug.params.length; index++) {
                    const obj = drug.params[index];
                    console.log("drug obj", obj)
                    if (drug.params.length > 1) {
                        drug.quantity += (Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength);

                        console.log("quantity", drug.quantity)

                        if (drug.params.length == index + 1) {
                            if (obj.is_dosage_count == "0") {
                                //drug.quantity = Number(obj.dosage)
                                //drug.params[index].quantity = Number(obj.dosage)
                                drug.quantity = 1
                                drug.params[index].quantity = 1
                            } else {
                                if (drug.sr_no == null) {
                                    drug.quantity = 0;
                                    drug.params[index].quantity = 0;
                                } else {
                                    drug.quantity = Math.ceil(drug.quantity)
                                    drug.params[index].quantity = drug.quantity
                                }
                            }
                        } else {
                            drug.params[index].quantity = 0
                        }



                    } else {


                        if (obj.is_dosage_count == "0") {
                            //drug.quantity = Number(obj.dosage);
                            // drug.params[index].quantity = Number(obj.dosage);
                            drug.quantity = 1;
                            drug.params[index].quantity = 1;

                        } else {
                            if (drug.sr_no == null) {
                                drug.quantity = 0;
                                drug.params[index].quantity = 0;
                            } else {
                                drug.quantity += Math.ceil((Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1)) / Number(drug.strength));
                                drug.params[index].quantity = Math.ceil(Number(obj.duration) * Number(obj.dosage) * (obj.frequency_val ? Number(obj.frequency_val) : 1) / Number(drug.strength))
                            }

                            console.log("quantity check", drug)
                        }
                    }


                }


                drug.drug_name = drug.drug;
                drug.sr_no = drug.sr_no;
                drug.type = drug.availability && drug.sr_no ? "IS" : "OS";
                if (!drug.drug_id) {
                    delete drug.drug_id;
                }

                /*  if(drug.drug_name!=drug.ItemSnap.name){
                     setSeverity("error");
                     setSnackMassage("Mismatch Drugs are ");
                     setViewSnack(true)
                 } */
                drugsArr.push(drug);
            }


            const param = {
                clinic_id: window.dashboardVariables.clinic_id,
                doctor_id: JSON.parse(await localStorage.getItem('userInfo')).id,
                patient_id: window.dashboardVariables.patient_id,
                doctor_remark: "",
                owner_id: JSON.parse(await localStorage.getItem('Login_user_Hospital')).owner_id,
                drugs: drugsArr,
                latest_update_date_time: new Date().toJSON().slice(0, 19).replace('T', ' '),
                name: favouriteName,
                type: "Clinical Doctor"
            }

            console.log("sending Drug list", param)
            PrescriptionService.createFavourite(param).then((out) => {
                console.log(out.status);
                if (out.status !== 200 && out.status !== 201) {
                    setSeverity("error");
                    setSnackMassage("Error occured Status");
                    setViewSnack(true)
                } else {
                    //handlePrintClick()

                    setSeverity("success");
                    setSnackMassage("Prescription Submitted As a Favourite");
                    setViewSnack(true)
                    setAddFavouriteView(false)
                    setFavSubbmitting(false)
                }

            }).catch((e) => {
                setSeverity("error");
                setSnackMassage("Error occured Exception");
                setViewSnack(true)
                setFavSubbmitting(false)

            })
        }


    }








    const checkAvailability = (drugslist) => {
        let newDrugList = drugslist;

        for (let index = 0; index < newDrugList.length; index++) {
            const element = newDrugList[index];
            if (!element.availability) {
                var newArray = drugListStore.filter(function (el) {
                    return el.item_id == element.drug_id;
                }
                );
                if (newArray.length > 0 && newArray[0].quantity > Number(element.quantity)) {
                    newDrugList[index].availability = true
                } else {
                    newDrugList[index].availability = false
                }
            }
        }

        /* 
                newDrugList.forEach((element, index) => {
                    if (!element.availability) {
                        var newArray = drugListStore.filter(function (el) {
                            return el.item_id == element.drug_id;
                        }
                        );
                        if (newArray.length > 0 && newArray[0].quantity > Number(element.quantity)) {
                            newDrugList[index].availability = true
                        } else {
                            newDrugList[index].availability = false
                        }
                    }
                }); */


        return newDrugList;
    }

    const handlePrintClick = () => {
        document.getElementById('print_presc_003').click()
    };

    const closeAction = () => {
        setPatientSummeryView(false)
        window.location.href = "/prescription/search/patients";
    }
    const handleClose = () => {
        setPatientSummeryView(false);
        window.location.href = "/prescription/search/patients";
    };

    useEffect(() => {
        console.log("selectedDrug", selectedDrug);
    }, [selectedDrug]);

    return <div>
        <Grid container>
            <Grid xs={4} style={{ marginBottom: '1.5em' }}>
                <Titles clinic={clinic.name} clinicAll={clinic} title={"Latest Physician Order"} date={latest && !editing ? latest.date : format(new Date(), 'dd/mm/yyyy')} />
            </Grid>
            <Grid xs={8} className="pt-4" style={{ marginBottom: '1em' }}>
                {/* <LabeledInput label="Favourites" multiple={true} inputType="dropdown" data={favourites} onUpdate={(e, out) => {
                    console.log("fav", out)
                    fetchFavItem(out)
                      out.forEach(element => {
                         fetchFavItem(element)
                     });  

                }} />  */}

                <Carousel
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    responsive={responsive}
                    ssr={false} // means to render carousel on server-side.
                    infinite={false}
                    autoPlay={false}
                    //autoPlaySpeed={1000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    //transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    //deviceType={this.props.deviceType}
                    dotListClass="custom-dot-list-style"
                    arrows={false}
                    //renderButtonGroupOutside={true}
                    centerMode={true}
                    itemClass="carousel-item-padding-2-px"
                >

                    {favourites.map((item, key) => (
                        <Chip
                            icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                            label={item.label}
                            clickable
                            color={selectedFavourites.includes(item) ? "primary" : "default"}
                            //onDelete={handleDelete}
                            onClick={() => {
                                let data = selectedFavourites;

                                if (data.includes(item)) {
                                    console.log("favadditem", item)

                                    var index = data.indexOf(item);
                                    data.splice(index, 1);
                                    setSelectedFavourites(data)
                                    fetchFavItem(data)
                                } else {
                                    data.push(item);
                                    setSelectedFavourites(data)
                                    fetchFavItem(data)
                                }


                            }}
                            //deleteIcon={<DoneIcon />}
                            variant="outlined"
                        />


                    ))
                    }
                </Carousel>




            </Grid>
        </Grid>
        <TableHead />
        {
            checkAvailability(drugList).map((drug, index) => <Row key={index} drug={drug} index={index} isInclude={checkIncludes(drug)} isAllergiec={checkAllergic(drug)} remove={removeDrugByIndex} select={setSelectedDrug} selected={selectedDrug} old={old} />)
        }
        <TableFoot index={selectedDrug ? selectedDrug.line : (drugList.length)} clinic={clinic} drugList={drugList} select={setSelectedDrug} setDrugList={setDrugList} selectedDrug={selectedDrug} warehouses={warehouses} pharmacies={pharmacies} setDrugObj={setDrugObj} clear={clear} setClear={setClear} />

        <div className={classes.btnContainer}>
            {/* <Button className={[classes.roundButton, "round_button"]} onClick={() => { window.open(`http://172.16.15.58/HIMS_V2_NEW/?targetModule=Clinic-module&targetMainDashboardId=ContollerClinicDoctorDashboard`, "_blank").focus(); }}>Show Old</Button> */}
            <Button className={[classes.roundButton, "round_button"]} onClick={() => { setAddFavouriteView(true) }}>Add Favourite</Button>
            <Button className={classes.roundButtonOutline} onClick={() => setPatientReferralView(true)}>Referral</Button>
            <Button className={classes.roundButtonOutline} onClick={() => { setPatientSummeryView(true); setPatientSummeryForEMR(false) }}>Summary</Button>
            <Button className={classes.roundButtonOutline} onClick={() => {
                setDrugList([]);
                setClear(true);
            }}>Clear Prescription</Button>
            {loading ? <Button className={[classes.roundButton, "round_button"]} disabled><CircularProgress style={{ color: 'white' }} size={15} /></Button> : null}
            {!loading ? <Button className={[classes.roundButton, "round_button"]} onClick={onSubmit}>Submit Prescription</Button> : null}
        </div>
        {/*  <Snackbar style={{ position: 'static' }} open={viewSnack} autoHideDuration={3000} onClose={() => setViewSnack("")}  >
            <Alert onClose={() => setViewSnack("")} severity={snackType} sx={{ width: '100%' }} variant="filled">
                {viewSnack}
            </Alert>
        </Snackbar> */}
        <Legends />



        <PrintPrescription
            letterTitle="Patient Referral"
            refferenceSection={false}
            patientInfo={patientInfo}
            clinic={patientClinic}
            drugList={checkAvailability(drugList)}
            date={moment(new Date()).format('yyyy/MM/DD')}
            address={""}
            title={"Patient Referral"}
            //letterBody={this.state.letterBody}
            signature={""}
        />


        <Dialog
            fullWidth="fullWidth"
            maxWidth="lg"
            //onClose={handleClose}
            open={selectedDrug}

        >

            <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                <CardTitle title="Edit Drug" />
                <IconButton aria-label="close" className={classes.closeButton}
                    onClick={() => {
                        setSelectedDrug(null)
                        // window.location.reload();
                    }
                    } >
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>

            <div className="w-full h-full px-5 py-5">
                <TableFoot index={selectedDrug ? selectedDrug.line : (drugList.length)} clinic={clinic} drugList={drugList} select={setSelectedDrug} setDrugList={setDrugList} selectedDrug={selectedDrug} warehouses={warehouses} pharmacies={pharmacies} setDrugObj={setDrugObj} clear={clear} setClear={setClear} />
            </div>
        </Dialog>

        <Dialog
            fullWidth="fullWidth"
            maxWidth="lg"
            onClose={handleClose}
            open={patientSummeryView}

        >

            <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                <CardTitle title="Patient Summery" />
                <IconButton aria-label="close" className={classes.closeButton}
                    onClick={
                        handleClose
                        // window.location.reload();
                    }>
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>

            <div className="w-full h-full px-5 py-5">
                <PatientSummaryNew
                    letterTitle="Patient Summary"
                    refferenceSection={false}
                    patientInfo={patientInfo}
                    clinic={patientClinic}
                    drugList={checkAvailability(drugList)}
                    date={moment(new Date()).format('yyyy/MM/DD h:mma')}
                    address={""}
                    title={"Patient Summary"}
                    patientSubmitForEMR={patientSummeryForEMR}
                    onAfterPrint={() => {
                        setPatientSummeryView(false);
                        window.location.href = "/prescription/search/patients";
                    }}
                    //letterBody={this.state.letterBody}
                    //onPrint={setPatientSummeryView(false)}
                    signature={""}
                />
            </div>
        </Dialog>



        <Dialog
            fullWidth="fullWidth"
            maxWidth="lg"
            onClose={() => { setPatientReferralView(false) }}
            open={patientReferralView}

        >

            <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                <CardTitle title="Patient Referral" />
                <IconButton aria-label="close" className={classes.closeButton}
                    onClick={() => {
                        setPatientReferralView(false)
                        // window.location.reload();
                    }
                    }>
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>

            <div className="w-full h-full px-5 py-5">
                <PatientReferral
                    letterTitle="Patient Referral"
                    refferenceSection={false}
                    patientInfo={patientInfo}
                    clinic={clinic}
                    drugList={checkAvailability(drugList)}
                    date={moment(new Date()).format('yyyy/MM/DD')}
                    address={""}
                    title={"Patient Referral"}
                    //letterBody={this.state.letterBody}
                    signature={""}
                />

            </div>
        </Dialog>



        <Dialog
            fullWidth="fullWidth"
            maxWidth="sm"
            onClose={() => { setAddFavouriteView(false) }}
            open={favouriteView}

        >

            <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                <CardTitle title="Set Favourite Name" />
                <IconButton aria-label="close" className={classes.closeButton}
                    onClick={() => {
                        setAddFavouriteView(false)
                        // window.location.reload();
                    }
                    }>
                    <CloseIcon />
                </IconButton>
            </MuiDialogTitle>

            <div className="w-full h-full px-5 py-5">
                <ValidatorForm
                    onSubmit={() => onAddFavourite()}
                    onError={() => null}
                    className="w-full"
                >


                    <TextValidator
                        className='w-full'
                        variant="outlined"
                        size="small"
                        value={favouriteName}
                        onChange={(e) => {
                            setFavouriteName(e.target.value)
                        }}
                        validators={['required']}
                        errorMessages={['this field is required']}
                    />



                    <LoonsButton className="mt-2" progress={favSubbmitting}

                        type="submit"
                        scrollToTop={true}
                    >
                        <span className="capitalize">Save</span>
                    </LoonsButton>



                </ValidatorForm>
            </div>
        </Dialog>


        <LoonsSnackbar
            open={viewSnack}
            onClose={() => {
                setViewSnack(false)
            }}
            message={snackMassage}
            autoHideDuration={5000}
            severity={severity}
            elevation={2}
            variant="filled"
        ></LoonsSnackbar>

    </div>
}

LatestPrescription.propTypes = {
}

export default withStyles(styles)(LatestPrescription);