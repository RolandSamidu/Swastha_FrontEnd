import moment from 'moment';
import localStorageService from './localStorageService';
class UtilityServices {



    DateToLocal = async (date) => {
        var stillUtc = moment.utc(date).toDate();
        var local = moment(stillUtc).local().format('YYYY-MM-DD');
        return local;
    }


    getBdayByNic = async (NICNo) => {

        var dayText = 0;
        var year = "";
        var month = "";
        var day = "";
        var gender = "";

        // var exp = /^([0-9]{9}[x|X|v|V]|[0-9]{12})/;
        var exp = /^([0-9]{9}$|[0-9]{12}$)/;

        let length = NICNo.length;
        if (length == 10) {
            NICNo = NICNo.slice(0, -1)
        }
        if (!exp.test(NICNo)) {
            return false;
        }
        else {
            // Year
            if (NICNo.length == 9) {
                year = "19" + NICNo.substr(0, 2);
                dayText = parseInt(NICNo.substr(2, 3));
            } else {
                year = NICNo.substr(0, 4);
                dayText = parseInt(NICNo.substr(4, 3));
            }

            // Gender
            if (dayText > 500) {
                gender = "female";
                dayText = dayText - 500;
            } else {
                gender = "male";
            }

            // Day Digit Validation
            if (dayText < 1 && dayText > 366) {
                return false;
            } else {

                //Month
                if (dayText > 335) {
                    day = dayText - 335;
                    month = "12";
                }
                else if (dayText > 305) {
                    day = dayText - 305;
                    month = "11";
                }
                else if (dayText > 274) {
                    day = dayText - 274;
                    month = "10";
                }
                else if (dayText > 244) {
                    day = dayText - 244;
                    month = "09";
                }
                else if (dayText > 213) {
                    day = dayText - 213;
                    month = "08";
                }
                else if (dayText > 182) {
                    day = dayText - 182;
                    month = "07";
                }
                else if (dayText > 152) {
                    day = dayText - 152;
                    month = "06";
                }
                else if (dayText > 121) {
                    day = dayText - 121;
                    month = "05";
                }
                else if (dayText > 91) {
                    day = dayText - 91;
                    month = "04";
                }
                else if (dayText > 60) {
                    day = dayText - 60;
                    month = "03";
                }
                else if (dayText < 32) {
                    month = "01";
                    day = dayText;
                }
                else if (dayText > 31) {
                    day = dayText - 31;
                    month = "02";
                }

                // Show Details
                // $("#gender").html("Gender : " + gender);
                //$("#year").html("Year : " + year);
                //$("#month").html("Month : " + month);
                //$("#day").html("Day :" + day);
                if (day < 10) {
                    day = '0' + day.toString();
                }
                let dat = await this.DateToLocal(year + "-" + month + "-" + day);
                console.log("date", dat)
                if (dat != "Invalid date") {
                    return { "bday": year + "-" + month + "-" + day, "bdayIn": dat, "gender": gender };
                }
                return false;
            }
        }
    }
    getAge = async (bday) => {
        var date2 = await this.DateToLocal(bday);
        var today = moment();

        var diffDuration = moment.duration(today.diff(date2));
        
        var age = { "age_years":  ("0" +  diffDuration.years()).slice(-2)?("0" +  diffDuration.years()).slice(-2):'', "age_months": ("0" +  diffDuration.months()).slice(-2)?("0" +  diffDuration.months()).slice(-2):'', "age_days": ("0" +  diffDuration.days()).slice(-2)?("0" +  diffDuration.days()).slice(-2):'' };
        console.log('age',age)
        return age;
    }
    getAgeString = async (bday) => {
        var date2 = await this.DateToLocal(bday);
        var today = moment();

        var diffDuration = moment.duration(today.diff(date2));
        
        var age = { "age_years":  ("0" +  diffDuration.years()).slice(-2), "age_months": ("0" +  diffDuration.months()).slice(-2), "age_days": ("0" +  diffDuration.days()).slice(-2) };
        console.log('age',age)
        return age.age_years+"Y - "+age.age_months+"M - "+age.age_days+"D";
    }

    getAgeStringYearAndMonth = async (bday) => {
        var date2 = await this.DateToLocal(bday);
        var today = moment();

        var diffDuration = moment.duration(today.diff(date2));
        
        var age = { "age_years":  ("0" +  diffDuration.years()).slice(-2), "age_months": ("0" +  diffDuration.months()).slice(-2), "age_days": ("0" +  diffDuration.days()).slice(-2) };
        console.log('age',age)
        return age.age_years+"Y "+age.age_months+"M";
    }

}
export default new UtilityServices();