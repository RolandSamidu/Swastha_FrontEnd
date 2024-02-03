import React from 'react'
import {
    Icon,
    IconButton,
    MenuItem,
    Avatar,
    useMediaQuery,
    Hidden,
    Tooltip,
    Button
} from '@material-ui/core'
import { MatxMenu, MatxSearchBox } from 'app/components'
import NotificationBar from '../../NotificationBar/NotificationBar'
import { Link } from 'react-router-dom'
import ShoppingCart from '../../ShoppingCart/ShoppingCart'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import useAuth from 'app/hooks/useAuth'
import useSettings from 'app/hooks/useSettings'
import { NotificationProvider } from 'app/contexts/NotificationContext'
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { fullScreenRequest } from '../../../../utils';
import localStorageService from 'app/services/localStorageService'
import IssueServices from 'app/services/IssueServices'

const useStyles = makeStyles(({ palette, ...theme }) => ({
    topbar: {
        top: 0,
        zIndex: 96,
        transition: 'all 0.3s ease',

        background: `linear-gradient(90deg, ${palette.primary.main} 1%, ${palette.primary.main} 290%, rgba(255, 255, 255, 0))`,//Edit by Roshan

        '& .topbar-hold': {
            backgroundColor: palette.primary.main,// Commit by Roshan
            height: 80,
            paddingLeft: 18,
            paddingRight: 20,
            [theme.breakpoints.down('sm')]: {
                paddingLeft: 16,
                paddingRight: 16,
            },
            [theme.breakpoints.down('xs')]: {
                paddingLeft: 14,
                paddingRight: 16,
            },
        },
        '& .fixed': {
            boxShadow: theme.shadows[8],
            height: 48,//changed by roshan
        },
    },
    userMenu: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: 24,
        padding: 4,
        '& span': {
            margin: '0 8px',
            // color: palette.text.secondary
        },
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        minWidth: 185,
    },
    menuItemWidthLess: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5
    },
}))

const Layout1Topbar = () => {
    const theme = useTheme()
    const classes = useStyles()
    const { settings, updateSettings } = useSettings()
    const { logout, user } = useAuth()
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'))
    const fixed = settings?.layout1Settings?.topbar?.fixed

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({
            layout1Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }

    const handleSidebarToggle = () => {
        let { layout1Settings } = settings
        let mode

        if (isMdScreen) {
            mode =
                layout1Settings.leftSidebar.mode === 'close'
                    ? 'mobile'
                    : 'close'
        } else {
            mode =
                layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full'
        }

        updateSidebarMode({ mode })
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const handleHelpLink = async () => {
        let screen_id = await localStorageService.getItem('screen_id');
        // localStorageService.setItem('screen_id', '');
        //console.log("screen id", window.screen_id)
        let params = { screen_id: 'Log in' }
        const data = await IssueServices.getHelpVideoLink(params);


        if (200 == data.status) {
            // window.open(data.data.view.data[0].ScreenUrls[0].url, "_blank")
            if (data.data.view.data[0]?.ScreenUrls[0]?.url) {
                openInNewTab(data.data.view.data[0]?.ScreenUrls[0]?.url)
            }
        }
    }

    return (
        <div className={classes.topbar}>
            <div className={clsx({ 'topbar-hold': true, fixed: fixed })}>
                <div className="flex justify-between items-center h-full">
                    <div className="flex">
                        <IconButton
                            onClick={handleSidebarToggle}
                            className="hide-on-pc"
                        >
                            <Icon>menu</Icon>



                        </IconButton>



                        <div className="hide-on-mobile">
                            {/* <IconButton>
                                <Icon>mail_outline</Icon>
                            </IconButton>

                            <IconButton>
                                <Icon>web_asset</Icon>
                            </IconButton>

                            <IconButton>
                                <Icon>star_outline</Icon>
                            </IconButton> */}
                        </div>
                    </div>
                    <div className="flex items-center">
                        {/*  <MatxSearchBox /> */}


                        {/* <NotificationProvider>
                            <NotificationBar />
                        </NotificationProvider> */}


                        <Link
                            className={[classes.menuItemWidthLess]}
                            to="/createIssue"
                            target="_blank"
                        >
                            <Icon> airplay </Icon>
                            <span> Raise to Issue </span>
                        </Link>

                        <a
                            className={[classes.menuItemWidthLess]}
                            href="https://www.youtube.com/watch?v=2pIHHnEPjuA&list=PL-ADJbmay8LdsWMNC_gUeiYuZnPcTy_op"
                            target="_blank"
                        >
                            <Icon> <span class="material-icons">
                                help_outline
                            </span> </Icon>
                            <span> Video Guide </span>
                        </a>

                        <a
                            className={[classes.menuItemWidthLess]}
                            href="https://drive.google.com/drive/folders/1revXfeXxTTT9dMpqzGqn_pSL0-SeFjUS?usp=drive_link"
                            target="_blank"
                        >
                            <Icon> <span class="material-icons">
                            folder_open
                            </span> </Icon>
                            <span> PDF Guides </span>
                        </a>

                        {/* <NotificationBar2 /> */}

                        {/*   <ShoppingCart /> */}

                        <MatxMenu
                            menuButton={
                                <div className={classes.userMenu}>
                                    <Hidden xsDown>
                                        <span>
                                            Hi <strong>{user.name}</strong>
                                        </span>
                                    </Hidden>
                                    <Avatar
                                        className="cursor-pointer"
                                        src={user.avatar}
                                    />
                                </div>
                            }
                        >
                            <MenuItem>
                                <Link className={classes.menuItem} to="/">
                                    <Icon> home </Icon>
                                    <span className="pl-4"> Home </span>
                                </Link>
                            </MenuItem>
                            {/* <MenuItem>
                                <Link
                                    className={classes.menuItem}
                                    to="/page-layouts/user-profile"
                                >
                                    <Icon> person </Icon>
                                    <span className="pl-4"> Profile </span>
                                </Link>
                            </MenuItem> */}

                            <MenuItem>
                                {/* <Link
                                    className={classes.menuItem}
                                    to="/createIssue"
                                >
                                    <Icon> airplay </Icon>
                                    <span className="pl-4"> Raise to Issue </span>
                                </Link> */}
                            </MenuItem>
                            <MenuItem className={classes.menuItem} onClick={() => {
                                handleHelpLink()
                            }}>
                                <Icon> help </Icon>
                                <span className="pl-4"> Help For Screen </span>
                            </MenuItem>
                            <MenuItem
                                onClick={logout}
                                className={classes.menuItem}
                            >
                                <Icon> power_settings_new </Icon>
                                <span className="pl-4"> Logout </span>
                            </MenuItem>
                        </MatxMenu>

                        <Tooltip title="Full Screen">
                            <FullscreenIcon className="cursor-pointer" color="action" onClick={() => {
                                fullScreenRequest('home123');
                            }} />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Layout1Topbar)
