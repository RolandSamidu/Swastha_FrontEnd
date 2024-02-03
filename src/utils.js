import { caseSaleCharges } from 'appconst'
import { differenceInSeconds } from 'date-fns'
import fscreen from 'fscreen'
import moment from 'moment'

export const convertHexToRGB = (hex) => {
    // check if it's a rgba
    if (hex.match('rgba')) {
        let triplet = hex.slice(5).split(',').slice(0, -1).join(',')
        return triplet
    }

    let c
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('')
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        c = '0x' + c.join('')

        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')
    }
}

export function debounce(func, wait, immediate) {
    var timeout
    return function () {
        var context = this,
            args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function () {
            timeout = null
            if (!immediate) func.apply(context, args)
        }, wait)
        if (immediate && !timeout) func.apply(context, args)
    }
}

export function isMobile() {
    if (window) {
        return window.matchMedia(`(max-width: 767px)`).matches
    }
    return false
}

export function isMdScreen() {
    if (window) {
        return window.matchMedia(`(max-width: 1199px)`).matches
    }
    return false
}

export function scrollToTop() {
    let ele = document.getElementsByClassName('scroll-y')[0]
    ele.scrollTo(0, 0)
}

function currentYPosition(elm) {
    if (!window && !elm) {
        return
    }
    if (elm) return elm.scrollTop
    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) return window.pageYOffset
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop
    return 0
}

function elmYPosition(elm) {
    var y = elm.offsetTop
    var node = elm
    while (node.offsetParent && node.offsetParent !== document.body) {
        node = node.offsetParent
        y += node.offsetTop
    }
    return y
}

export function scrollTo(scrollableElement, elmID) {
    var elm = document.getElementById(elmID)

    if (!elmID || !elm) {
        return
    }

    var startY = currentYPosition(scrollableElement)
    var stopY = elmYPosition(elm)

    var distance = stopY > startY ? stopY - startY : startY - stopY
    if (distance < 100) {
        scrollTo(0, stopY)
        return
    }
    var speed = Math.round(distance / 50)
    if (speed >= 20) speed = 20
    var step = Math.round(distance / 25)
    var leapY = stopY > startY ? startY + step : startY - step
    var timer = 0
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout(
                (function (leapY) {
                    return () => {
                        scrollableElement.scrollTo(0, leapY)
                    }
                })(leapY),
                timer * speed
            )
            leapY += step
            if (leapY > stopY) leapY = stopY
            timer++
        }
        return
    }
    for (let i = startY; i > stopY; i -= step) {
        setTimeout(
            (function (leapY) {
                return () => {
                    scrollableElement.scrollTo(0, leapY)
                }
            })(leapY),
            timer * speed
        )
        leapY -= step
        if (leapY < stopY) leapY = stopY
        timer++
    }
    return false
}

export function getTimeDifference(date) {
    let difference = differenceInSeconds(new Date(), date)

    if (difference < 60) return `${Math.floor(difference)} sec`
    else if (difference < 3600) return `${Math.floor(difference / 60)} min`
    else if (difference < 86400) return `${Math.floor(difference / 3660)} h`
    else if (difference < 86400 * 30)
        return `${Math.floor(difference / 86400)} d`
    else if (difference < 86400 * 30 * 12)
        return `${Math.floor(difference / 86400 / 30)} mon`
    else return `${(difference / 86400 / 30 / 12).toFixed(1)} y`
}

export function generateRandomId() {
    let tempId = Math.random().toString()
    let uid = tempId.substr(2, tempId.length - 1)
    return uid
}

export function getQueryParam(prop) {
    var params = {}
    var search = decodeURIComponent(
        window.location.href.slice(window.location.href.indexOf('?') + 1)
    )
    var definitions = search.split('&')
    definitions.forEach(function (val, key) {
        var parts = val.split('=', 2)
        params[parts[0]] = parts[1]
    })
    return prop && prop in params ? params[prop] : params
}

export function classList(classes) {
    return Object.entries(classes)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join(' ')
}

export function fullScreenRequest(documentID) {
    if (fscreen.fullscreenElement == null) {
        fscreen.requestFullscreen(document.getElementById(documentID))

        if (document.getElementById(documentID).style.backgroundColor == '') {
            document.getElementById(documentID).style.backgroundColor =
                '#fffefe'
        } else if (
            document.getElementById(documentID).style.backgroundColor ==
            '#fffefe'
        ) {
            document.getElementById(documentID).style.backgroundColor = ''
        }

        // document.getElementById(documentID).style.backgroundColor = "white"
    } else {
        if (
            document.getElementById(documentID).style.backgroundColor ==
            'rgb(255, 254, 254)'
        ) {
            document.getElementById(documentID).style.backgroundColor = ''
        }
        fscreen.exitFullscreen()
    }
    makedefaultAfterExitFullScreen(documentID)
}

export function fullScreenRequestInsideApp(documentID) {
    let maindiv = document.getElementById('app-fullscreen-1856')
    let childDiv = document.getElementById(documentID)
    //console.log("full screen elemnet", fscreen.fullscreenElement)
    if (fscreen.fullscreenElement != null) {
        if (fscreen.fullscreenElement.id == documentID) {
            fscreen.exitFullscreen()
            if (
                document.getElementById(documentID).style.backgroundColor ==
                'rgb(255, 254, 254)'
            ) {
                document.getElementById(documentID).style.backgroundColor = ''
            }
            //hide in minimum size
            makeHideInSmall()
        } else {
            fscreen.requestFullscreen(document.getElementById(documentID))
            makedefaultAfterExitFullScreen(documentID)
            if (
                document.getElementById(documentID).style.backgroundColor == ''
            ) {
                document.getElementById(documentID).style.backgroundColor =
                    '#fffefe'
            } else if (
                document.getElementById(documentID).style.backgroundColor ==
                'rgb(255, 254, 254)'
            ) {
                //document.getElementById(documentID).style.backgroundColor = '';
            }

            // add globle css to show in fullscreen
            makeShowInFullScreen()
        }
    } else {
        if (maindiv.style.zIndex == 116) {
            maindiv.style.zIndex = -99
            maindiv.style.display = 'none'
            let beforParentElementid = childDiv.getAttribute('beforParent')
            document.getElementById(beforParentElementid).append(childDiv)

            //hide in minimum size
            makeHideInSmall()
        } else {
            maindiv.style.zIndex = 116
            maindiv.style.display = 'unset'

            let perentElement = childDiv.parentElement
            let parentElementID = perentElement.id
            if (parentElementID == '') {
                parentElementID = makeid()
                perentElement.id = parentElementID
            }
            childDiv.setAttribute('beforParent', parentElementID)
            maindiv.append(childDiv)

            // add globle css to show in fullscreen
            makeShowInFullScreen()
        }
    }

    // maindiv.classList.add()
}

export function makeid() {
    let length = 5
    var result = ''
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}
export function generatePassword() {
    let length = 8
    var result = ''
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export function makedefaultAfterExitFullScreen(documentID) {
    document
        .getElementById(documentID)
        .addEventListener('fullscreenchange', (event) => {
            // document.fullscreenElement will point to the element that
            // is in fullscreen mode if there is one. If not, the value
            // of the property is null.
            if (document.fullscreenElement) {
                console.log(
                    `Element: ${document.fullscreenElement.id} entered fullscreen mode.`
                )

                var style = document.createElement('style')
                style.type = 'text/css'
                if (style.styleSheet) {
                    style.styleSheet.cssText =
                        '.show-on-appfullScreen{display:flex}'
                } else {
                    style.appendChild(
                        document.createTextNode(
                            '.show-on-appfullScreen{display:flex}'
                        )
                    )
                }
                document.getElementsByTagName('head')[0].appendChild(style)
            } else {
                console.log('Leaving full-screen mode.')
                //hide in minimum size
                var style = document.createElement('style')
                style.type = 'text/css'
                if (style.styleSheet) {
                    style.styleSheet.cssText =
                        '.show-on-fullScreen{display:none},.show-on-appfullScreen{display:none}'
                } else {
                    style.appendChild(
                        document.createTextNode(
                            '.show-on-fullScreen{display:none}'
                        )
                    )
                    style.appendChild(
                        document.createTextNode(
                            '.show-on-appfullScreen{display:none}'
                        )
                    )
                }
                document.getElementsByTagName('head')[0].appendChild(style)

                if (
                    document.getElementById(documentID).style.backgroundColor ==
                    'rgb(255, 254, 254)'
                ) {
                    document.getElementById(documentID).style.backgroundColor =
                        ''
                }
            }
        })
}

export function makeHideInSmall() {
    //hide in minimum size
    var style = document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet) {
        style.styleSheet.cssText =
            '.show-on-fullScreen{display:none} .hide-on-fullScreen{display:flex} '
    } else {
        style.appendChild(
            document.createTextNode(
                '.show-on-fullScreen{display:none} .hide-on-fullScreen{display:flex} '
            )
        )
    }
    document.getElementsByTagName('head')[0].appendChild(style)

    var ele = document.getElementsByClassName('widget-container')
    for (let i = 0; i < ele.length; i++) {
        //ele[i].className += " full-height-on-fullScreen";
        ele[i].classList.remove('full-height-on-fullScreen')
    }
}

export function makeShowInFullScreen() {
    var style = document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet) {
        style.styleSheet.cssText =
            '.show-on-fullScreen{display:flex} .hide-on-fullScreen{display:none} '
    } else {
        style.appendChild(
            document.createTextNode(
                '.show-on-fullScreen{display:flex} .hide-on-fullScreen{display:none} '
            )
        )
    }
    document.getElementsByTagName('head')[0].appendChild(style)

    var ele = document.getElementsByClassName('widget-container')
    for (let i = 0; i < ele.length; i++) {
        //ele[i].className += " full-height-on-fullScreen";
        ele[i].classList.add('full-height-on-fullScreen')
    }
    /* document.getElementsByClassName('widget-container').forEach(element => {
        element.classList.add('full-height-on-fullScreen')
    }); */
}

export function addBackgroundColor(documentID) {
    if (document.getElementById(documentID).style.backgroundColor == '') {
        document.getElementById(documentID).style.backgroundColor = '#fffefe'
    } else if (
        document.getElementById(documentID).style.backgroundColor ==
        'rgb(255, 254, 254)'
    ) {
        document.getElementById(documentID).style.backgroundColor = ''
    }
}

export function dateParse(date) {
    let data = moment(date).format('yyyy-MM-DD')
    if (data != 'Invalid date' && date != null) {
        return data
    } else {
        return ''
    }
}

export function dateTimeParse(date) {
    let data = moment(date).format('yyyy-MM-DD HH:mm:ss')
    if (data != 'Invalid date' && date != null) {
        return data
    } else {
        return ''
    }
}
export function timeParse(time) {
    let data = moment(time).format('HH:mm')
    if (data != 'Invalid date' && time != null) {
        return data
    } else {
        return ''
    }
}
export function padLeadingZeros(num, size) {
    var s = num + ''
    while (s.length < size) s = '0' + s
    return s
}

export function yearParse(date) {
    return moment(date).format('yyyy')
}
export function yearMonthParse(date) {

    return moment(date).format('yyyy-MM');
}

export function roundDecimal(value, precision) {
    var multiplier = Math.pow(10, precision || 0)
    return Math.round(value * multiplier) / multiplier
}

export function convertTocommaSeparated(value, precision, minimumFractionDigits = 2) {
    if (precision == 0) {
        return (parseFloat(value).toLocaleString('en-US', { style: 'decimal' }))
    } else {
        return (parseFloat(roundDecimal(value, precision)).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: minimumFractionDigits }))
    }
}

export function calculatePOA(date) {
    var paoWD = ''
    var lmpDate = new Date(date)
    var nowDate = new Date()
    if (lmpDate > nowDate) {
        return 0
    }

    var diffDays = dateDiffInDays(lmpDate, nowDate)

    var ww = Math.trunc(diffDays / 7)
    var dd = diffDays % 7

    var poaWD = ww + '(W) ' + dd + '(D)'

    return poaWD
}

export function dateDiffInDays(a, b) {
    var _MS_PER_DAY = 1000 * 60 * 60 * 24
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor((utc2 - utc1) / _MS_PER_DAY)
}

export function generateEED(date) {
    var edd = ''
    var inputDate = new Date(date)

    var newDate = inputDate.setTime(
        Date.UTC(
            inputDate.getFullYear(),
            inputDate.getMonth(),
            inputDate.getDate()
        ) +
        40 * 7 * 24 * 60 * 60 * 1000
    )

    var edd = new Date(newDate)

    var date = edd.getDate()
    var month = edd.getMonth() + 1

    edd = edd.getFullYear() + '-' + month + '-' + date
    return edd
}

export function getDiffInDays(date1, date2) {
    var date1 = new Date(date1);
    var date2 = new Date(date2);

    var diffInMilliseconds = date2.getTime() - date1.getTime();
    var diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    var years = Math.floor(diffInDays / 365);
    var months = Math.floor((diffInDays % 365) / 30);
    var days = (diffInDays % 365) % 30;

    console.log(years + " years, " + months + " months, " + days + " days");
    let output = years + " Y " + months + " M " + days + " D"
    return output;
}

// get date difference between two days
export function getDateDifference(date1, date2) {
    const momentDate1 = moment(date1);
    const momentDate2 = moment(date2);

    const diffInMilliseconds = Math.abs(momentDate2 - momentDate1);
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffInDays / 365);
    const months = Math.floor((diffInDays % 365) / 30);
    const days = Math.abs((diffInDays % 365) % 30);

    if (momentDate1.isBefore(momentDate2)) {
        return ['-', years, months, days];
    } else {
        return ['+', years, months, days];
    }
}


export function numberToName(inputNumber) {
    const singleDigits = [
        "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"
    ];

    const tens = [
        "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
    ];

    const teens = [
        "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN",
        "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
    ];

    const magnitude = [
        "", "THOUSAND", "MILLION", "BILLION"
    ];

    let number = Math.floor(inputNumber);
    let decimalPart = Math.round((inputNumber - number) * 10000);

    function convertNumber(n) {
        if (n < 10) {
            return singleDigits[n];
        } else if (n < 20) {
            return teens[n - 10];
        } else if (n < 100) {
            return tens[Math.floor(n / 10)] + " " + convertNumber(n % 10);
        } else {
            return singleDigits[Math.floor(n / 100)] + " HUNDRED " + convertNumber(n % 100);
        }
    }

    function convertDecimal(n) {
        // Convert the number to a string
        const numberStr = n.toString();
        // Initialize an empty array to store the digits
        const digitArray = [];

        // Iterate through each character in the string
        for (let i = 0; i < numberStr.length; i++) {
            let number = parseInt(numberStr[i])
            // Parse the character back to a number and push it to the array
            if (number === 0) {
                digitArray.push("ZERO");
            } else {
                digitArray.push(singleDigits[number]);
            }
        }

        // Return the array of digits
        return digitArray.join(" ");
    }

    if (number === 0) {
        return "zero";
    }

    let result = "";
    let magnitudeIndex = 0;

    while (number > 0) {
        if (number % 1000 !== 0) {
            let partialResult = convertNumber(number % 1000);
            result = partialResult + " " + magnitude[magnitudeIndex] + " " + result;
        }
        number = Math.floor(number / 1000);
        magnitudeIndex++;
    }
    result = result.trim()

    if (decimalPart > 0) {
        let decimalPartName = convertDecimal(decimalPart);
        result += " AND POINT " + decimalPartName + " ONLY";
    } else {
        result += " ONLY";
    }

    return result.trim();
}

export function POnumberToName(inputNumber) {
    const singleDigits = [
        "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"
    ];

    const tens = [
        "", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
    ];

    const teens = [
        "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN",
        "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
    ];

    const magnitude = [
        "", "THOUSAND", "MILLION", "BILLION"
    ];

    let number = Math.floor(inputNumber);
    let decimalPart = Math.round((inputNumber - number) * 100);

    function convertNumber(n) {
        if (n < 10) {
            return singleDigits[n];
        } else if (n < 20) {
            return teens[n - 10];
        } else if (n < 100) {
            return tens[Math.floor(n / 10)] + " " + convertNumber(n % 10);
        } else {
            return singleDigits[Math.floor(n / 100)] + " HUNDRED " + convertNumber(n % 100);
        }
    }

    function convertDecimal(n) {
        // // Convert the number to a string
        // const numberStr = n.toString();
        // // Initialize an empty array to store the digits
        // const digitArray = [];

        // // Iterate through each character in the string
        // for (let i = 0; i < numberStr.length; i++) {
        //     let number = parseInt(numberStr[i])
        //     // Parse the character back to a number and push it to the array
        //     if(number === 0){
        //         digitArray.push("ZERO");
        //     }else{
        //         digitArray.push(singleDigits[number]);
        //     }
        // }

        // Convert the number to a string
        const numberStr = n.toString();
        // Initialize an empty array to store the digits
        const digitArray = [];

        // Iterate through each character in the string
        for (let i = 0; i < numberStr.length; i++) {
            let number = parseInt(numberStr[i]);
            // Parse the character back to a number and push it to the array
            if (number === 0) {
                digitArray.push("ZERO");
            } else {
                digitArray.push(singleDigits[number]);
            }
        }

        // If there is only one digit, explicitly state "ZERO"
        if (digitArray.length === 1) {
            digitArray.unshift("ZERO");
        }

        // Return the array of digits
        return digitArray.join(" ");
    }

    if (number === 0) {
        return "zero";
    }

    let result = "";
    let magnitudeIndex = 0;

    while (number > 0) {
        if (number % 1000 !== 0) {
            let partialResult = convertNumber(number % 1000);
            result = partialResult + " " + magnitude[magnitudeIndex] + " " + result;
        }
        number = Math.floor(number / 1000);
        magnitudeIndex++;
    }
    result = result.trim()

    if (decimalPart > 0) {
        let decimalPartName = convertDecimal(decimalPart);
        result += " AND POINT " + decimalPartName + " ONLY";
    }else{
        result += " ONLY";
    }

    return result.trim();
}

export function includesArrayElements(arr1, arr2) {
    return arr2.some(element => arr1.includes(element));
}

export function msdServiceChargesCal(cost) {
    return (Number(cost) / 100) * caseSaleCharges;
}

export function msdTotalChagesCal(cost) {
    return Number(cost) + ((Number(cost) / 100) * caseSaleCharges);
}

export function addDateToToday(numberOfDaysToAdd) {
    const currentDate = new Date();

    // Add the specified number of days to the current date
    currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);

    // Get the year, month, and day from the new date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are 0-based, so we add 1 to get the correct month number
    const day = currentDate.getDate();

    // Format the date as a string (e.g., "YYYY-MM-DD")
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate
}

export function convertM3ToOtherUnit(value, unit) {
    const conversionFactors = {
        m3: 1,
        cm3: 0.000001,
        mm3: 1e-9,

    };
    return value / conversionFactors[unit];
}

