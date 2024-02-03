import { makeStyles } from '@material-ui/core/styles'

export const commonStyles = makeStyles(({ palette, ...theme }) => ({
    '@global': {
        '.circular-image-small': {
            height: '48px',
            width: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
        },
        '.card': { transition: 'all 0.3s ease' },
        '.card:hover': { boxShadow: theme.shadows[12] },
        '.card-title': {
            fontSize: '1rem',
            textTransform: 'capitalize',
            fontWeight: '500',
        },
        '.card-subtitle': { fontSize: '0.875rem', color: 'var(--text-muted)' },
        '.theme-dark .card-subtitle': { color: 'rgba(255, 255, 255, 0.54)' },
        '.hide-on-mobile': { display: 'inherit' },
        '@media screen and (max-width: 767px)': {
            '.hide-on-mobile': { display: 'none !important' },
            '.show-on-mobile': { display: 'inherit !important' },
            '.invisible-on-pc': { visibility: 'visible' },
        },
        '@media screen and (min-width: 1200px)': {
            '.hide-on-pc': { display: 'none !important' },
        },
        '@media screen and (max-width: 1200px)': {
            '.show-on-pc': { display: 'none !important' },
        },
        '.VictoryContainer svg': { height: '100% !important' },
        '.box-shadow-none': { boxShadow: 'none !important' },
        '.circle-44': { height: '44px !important', width: '44px !important' },
        '.circle-32': {
            height: '32px !important',
            minHeight: '32px !important',
            width: '32px !important',
        },
        '.circle-32 .MuiFab-root': { minHeight: '32px !important' },
        '.circle-32 .MuiIcon-root': { fontSize: '13px !important' },
        '.show-on-mobile': { display: 'none !important' },
        '.invisible-on-pc': { visibility: 'hidden' },
        '.highlight-js pre': { whiteSpace: 'pre-line' },
        '.cursor-pointer': {
            cursor: 'pointer',
        },
        '.cursor-move': {
            cursor: 'move',
        },
        '.avatar': {
            height: '32px !important',
            width: '32px !important',
        },
        '.face-group .avatar:not(:first-child)': {
            marginLeft: '-0.875rem !important',
        },
        '.opacity-1': {
            opacity: 1,
        },
        '.MuiTable-root': {
            width: 'unset !important',
            minWidth: '100%',
            //width: '1500px !important'
            //maxWidth: '98vw',
            // display: 'block !important',
        },

        '.MuiTableBody-root': {
            // display: 'block !important',
        },
        '.MuiTableHead-root': {
            // display: 'block !important',
        },
        '.MuiTableCell-head span': {
            // justifyContent: 'center'
        },
        '.MuiTableRow-footer': {
            display: 'grid !important',
        },
        '.MuiTableFooter-root': {
            display: 'block !important',
            width: '100%',
        },
        '.MuiTableCell-head .MuiButtonBase-root': {
            fontWeight: '600 !important',
            margin: '0px'
        },
        '.MuiTableCell-head':{
            fontWeight: '600 !important',
        },


        '.grabbable': {
            cursor: 'move', /* fallback if grab cursor is unsupported */
            cursor: 'grab',

        },
        '.MuiTableCell-root': {
            wordBreak: 'keep-all !important',
            //paddingLeft: '-1px !important',
            padding: '4px 4px 4px 4px !important',
            borderColor: '#f3f4f4 !important',

            //textAlign: 'center !important',
        },
        '::-webkit-scrollbar': {
            width: 10,
            height: 5,
        },

        '::-webkit-scrollbar-track': {
            background: '#d6d6d6'
        },

        '::-webkit-scrollbar-thumb': {
            background: '#bfbdbd',
            borderRadius: '10px'
        },

        '::-webkit-scrollbar-thumb:hover': {
            background: '#afadad',
            borderRadius: '10px'
        },

        '::-webkit-scrollbar-track-piece:end': {
            marginBottom: '10px'
        },

        '::-webkit-scrollbar-track-piece:start': {
            marginTop: '10px'
        },

        '.ps__rail-y': {
            backgroundColor: 'transparent !important'
        },

        '.ps__rail-y:start': {
            marginBottom: '10px'
        },

        '.ps__rail-y:start': {
            marginTop: '10px'
        },



        '.react-resizable': {
            position: 'relative',
            overflow: 'auto'
        },
        '.react-resizable-handle': {
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundRepeat: 'no-repeat',
            backgroundOrigin: 'content-box',
            boxSizing: 'border-box',
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
            backgroundPosition: 'bottom right',
            padding: '0 3px 3px 0'
        },
        '.react-resizable-handle-sw': {
            bottom: 0,
            left: 0,
            cursor: 'sw-resize',
            transform: 'rotate(90deg)',
        },
        '.react-resizable-handle-se': {
            bottom: 0,
            right: 0,
            cursor: ' se-resize',
        },
        '.react-resizable-handle-nw': {
            top: 0,
            left: 0,
            cursor: 'nw-resize',
            transform: 'rotate(180deg)',
        },
        '.react-resizable-handle-ne': {
            top: 0,
            right: 0,
            cursor: ' ne-resize',
            transform: 'rotate(270deg)',
        },
        '.react-resizable-handle-w .react-resizable-handle-e': {
            top: '50%',
            marginTop: '-10px',
            cursor: 'ew-resize'
        },
        '.react-resizable-handle-w': {
            left: 0,
            transform: 'rotate(135deg)'
        },
        '.react-resizable-handle-e': {
            right: 0,
            transform: 'rotate(315deg)'
        },
        '.react-resizable-handle-n .react-resizable-handle-s': {
            left: '50%',
            marginLeft: '-10px',
            cursor: 'ns-resize'
        },
        '.react-resizable-handle-n': {
            top: 0,
            transform: 'rotate(225deg)',
        },
        '.react-resizable-handle-s': {
            bottom: 0,
            transform: 'rotate(45deg)'
        },

        //Input field customize


        '.MuiOutlinedInput-notchedOutline': {
            top: '0px'
        },
        '.MuiOutlinedInput-inputMarginDense': {
            paddingTop: '11.5px',
            paddingBottom: '5.5px'
        },
        '.MuiOutlinedInput-root': {
            borderRadius: '3px'
        },
        '.MuiOutlinedInput-input': {
            //paddingLeft: '4px',
            //paddingRight: '4px'
        },
        '.MuiButton-root': {
            padding: '2px 9px'
        },

        //app full screen
        '#app-fullscreen-1856': {
            //zIndex: 9999,
            display: 'none',
            position: 'absolute',
            minHeight: '100%',
            width: '100%',
            top: '0px',
            backgroundColor: 'white',
            paddingLeft: 5,
            paddingRight: 5,
            paddingTop: 5,
            paddingBottom: 5
        },
        '.show-on-fullScreen': {
            display: 'none'
        },
        '.show-on-appfullScreen': { display: 'none' },

        'div,MuiTableCell-body,textarea,input': {
            // color: "#6f6f70"
        },

        '#home123': {
            overflow: 'auto !important',
            overflowX: 'hidden'
        },


        //Alert Set
        '.MuiAlert-filledSuccess': {
            // color: '#015b05 !important',
            //fontWeight: 500,
            //borderColor: '#35cd0c',
            //borderStyle: 'solid',
            //borderWidth: '1px',
            // borderRadius: '10px !important',
            // backgroundColor: '#f4fff7  !important',
        },
        '.show-on-fullScreen div': {
            //  width: '100%'
        },
        '.hover_point:hover': {
            cursor: 'pointer',

        },
        '.overlay_container': {
            position: 'relative'
        },
        '.round_button:hover': {
            backgroundColor: '#0aa0ba !important'
        },

        '.overlay_box': {

            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.7,
            background: '#0057e3',
        },

        '.overlay': {
            zIndex: 9,
            margin: '30px',
            background: '#009938'
        },

        '.MuiOutlinedInput-adornedEnd': {
            paddingRight: '0px'
        },
        '.MuiInputAdornment-positionEnd': {
            marginTop: '5px'
        },
        '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"][class*="MuiOutlinedInput-marginDense"] .MuiAutocomplete-input': {
            padding: '5px 4.5px 0px !important'
        },
        '.full-height-on-fullScreen': {
            height: '100% !important'
        },
        '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-endAdornment': {
            top: '5px !important',
        },

        '.MuiAutocomplete-inputRoot .MuiAutocomplete-tag': {
            height: 15,

        },
        '.MuiAutocomplete-inputRoot .MuiChip-deleteIcon': {
            width: 17,
            height: 17
        },
        '.MuiPaper-root.MuiAccordion-root::before': {
            backgroundColor: '#f7f7f7'
        },
        '.widget-container::-webkit-scrollbar': {
            width: '0px !important'
        },

        '.react-multi-carousel-item': {
            width: 'auto !important',
            padding: '2px'
        },
        'body': {
            // zoom: '85% !important'
        },
       '.text-10': {
            fontSize:'10px !important'
        },

        '.image_hover':{
            cursor: 'pointer'
        },
        // add by spc dev
        '.custom-editor':{
            minHeight: '70vh'
        },
        '.custom-editor-sm':{
            minHeight: '100px'
        },

        '.react-rte-itemMaster':{
            minHeight: '350px'
        }
    }
}))
