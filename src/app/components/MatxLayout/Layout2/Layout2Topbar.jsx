import React from 'react'
import { Icon, IconButton, Hidden, MenuItem, Avatar, Button, Tooltip } from '@material-ui/core'
import { MatxMenu, MatxToolbarMenu, MatxSearchBox } from 'app/components'
import NotificationBar2 from '../../NotificationBar2/NotificationBar2'
import ShoppingCart from '../../ShoppingCart/ShoppingCart'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import useSettings from 'app/hooks/useSettings'
import useAuth from 'app/hooks/useAuth'
import Layout2Navbar from './Layout2Navbar'
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { fullScreenRequest } from '../../../../utils'

const useStyles = makeStyles(({ palette, ...theme }) => ({
    root: {
        backgroundColor: palette.primary.main,
        borderColor: palette.divider,
        // display: "table",
        height: 'var(--topbar-height)',
        borderBottom: '1px solid transparent',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        zIndex: 98,
        paddingLeft: '1.75rem',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '1rem',
        },
    },
    brandText: {
        color: palette.primary.contrastText,
    },
    menuItem: {
        minWidth: 185,
        display: 'flex',
        alignItems: 'center',
    },
}))

const Layout2Topbar = () => {
    const classes = useStyles()
    const { settings, updateSettings } = useSettings()
    const { logout, user } = useAuth()

    const updateSidebarMode = (sidebarSettings) => {
        updateSettings({
            layout2Settings: {
                leftSidebar: {
                    ...sidebarSettings,
                },
            },
        })
    }

    const handleSidebarToggle = () => {
        let { layout2Settings } = settings

        let mode =
            layout2Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close'

        updateSidebarMode({ mode })
    }

    return (
        <div className={clsx('relative w-full', classes.root)}>
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center h-full">
                    <img
                        className="h-32"
                        src="/assets/images/logo.svg"
                        alt="company-logo"
                    />
                    <span
                        className={clsx(
                            'font-medium text-24 mx-4 text-primary',
                            classes.brandText
                        )}

                    >
                        Swastha
                    </span>
                </div>
                <div className="mx-auto"></div>
                <div className="flex items-center">
                    <MatxToolbarMenu offsetTop="64px">

                        <Layout2Navbar />

                        <NotificationBar2 />

                        <ShoppingCart />

                        <MatxMenu
                            menuButton={
                                <Avatar
                                    className="cursor-pointer mx-2"
                                    src={user.avatar}
                                />
                            }
                        >
                            <MenuItem className={classes.menuItem}>
                                <Icon> home </Icon>
                                <span className="pl-4"> Home </span>
                            </MenuItem>
                            <MenuItem>
                                <Link
                                    className={classes.menuItem}
                                    to="/page-layouts/user-profile"
                                >
                                    <Icon> person </Icon>
                                    <span className="pl-4"> Profile </span>
                                </Link>
                            </MenuItem>
                            <MenuItem className={classes.menuItem}>
                                <Icon> settings </Icon>
                                <span className="pl-4"> Settings </span>
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

                    </MatxToolbarMenu>

                    <Hidden mdUp>
                        <IconButton
                            className="text-white"
                            onClick={handleSidebarToggle}
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                    </Hidden>
                </div>
            </div>
        </div >
    )
}

export default Layout2Topbar
