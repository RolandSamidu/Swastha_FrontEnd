import React, { useState } from 'react';
import {
  Card,
  Button,
  CircularProgress,
  Dialog,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import history from 'history.js';
import clsx from 'clsx';
import useAuth from 'app/hooks/useAuth';
import localStorageService from 'app/services/localStorageService';
import * as appConst from '../../../../appconst';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  cardHolder: {
    background: '#fff', // White background
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'row', // Image and form side by side
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 800,
    borderRadius: 12,
    padding: '1rem',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  loginForm: {
    width: '45%', // Adjust as needed
  },
  image: {
    width: '50%', // Adjust as needed
    objectFit: 'cover',
  },
  welcomeText: {
    marginLeft: '80px',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },

  signUpLink: {
    color: palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const JwtLogin = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    totp: '',
  });
  const [message, setMessage] = useState('');
  const [selectUserRole, setSelectUserRole] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [userInfoRes, setUserInfoRes] = useState(null);
  const [otherUserRole, setOtherUserRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const classes = useStyles();

  const handleChange = ({ target: { name, value } }) => {
    let temp = { ...userInfo };
    temp[name] = value;
    setUserInfo(temp);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFormSubmit = async (event) => {
    setLoading(true);
    try {
      let res = await login(userInfo.email, userInfo.password, userInfo.totp);

      if (res.error) {
        setMessage(res.message);
        setLoading(false);
      } else {
        let other_roles = res.roles;

        if (other_roles.includes('default-roles-swastharealm')) {
          other_roles.splice(
            other_roles.indexOf('default-roles-swastharealm'),
            1
          );
        }
        if (other_roles.includes('offline_access')) {
          other_roles.splice(other_roles.indexOf('offline_access'), 1);
        }
        if (other_roles.includes('uma_authorization')) {
          other_roles.splice(other_roles.indexOf('uma_authorization'), 1);
        }

        if (other_roles.length === 1) {
          if (res) {
            await localStorageService.setItem('userInfo', res);
          } else {
            await localStorage.removeItem('userInfo');
          }

          history.push('/');
        } else {
          if (other_roles.includes('Drug Store Keeper')) {
            other_roles[other_roles.indexOf('Drug Store Keeper')] =
              'Drugs Stores Pharmacist';
          }
          setUserInfoRes(res);
          setOtherUserRole(other_roles);
          setSelectUserRole(true);
        }
      }
    } catch (e) {
      console.log('error', e);
      setMessage(e.error_description);
      setLoading(false);
    }
  };

  const saveUserRole = async () => {
    let selectedUserRoleNew = selectedUserRole;

    if (selectedUserRoleNew === 'Drugs Stores Pharmacist') {
      selectedUserRoleNew = 'Drug Store Keeper';
    }
    let user_roles = [selectedUserRoleNew];

    let user_info_res = userInfoRes;
    user_info_res.roles = user_roles;

    if (user_info_res) {
      await localStorageService.setItem('userInfo', user_info_res);
    }
    history.push('/');
  };

  return (
    <div className={classes.cardHolder}>
      <Card className={classes.card}>
        <div className={classes.loginForm}>
          <div className={classes.welcomeText}>Welcome Back!</div>
          <div className="p-8 h-full bg-light-gray relative">
            <TextField
              className="mb-6 w-full"
              variant="outlined"
              size="small"
              label="Username"
              onChange={handleChange}
              type="text"
              name="email"
              value={userInfo.email}
              InputProps={{
                style: { borderRadius: 12,  height: '50px'}, // Add borderRadius for rounded edges
              }}
              InputLabelProps={{
                style: {  marginTop: '7px' },
              }}
              validators={['required']}
              errorMessages={['this field is required']}
            />
            <TextField
              className="mb-3 w-full"
              label="Password"
              variant="outlined"
              size="small"
              onChange={handleChange}
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={userInfo.password}
              InputLabelProps={{
                style: {  marginTop: '7px' },
              }}
              InputProps={{
                style: { borderRadius: 12,  height: '50px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end"
                    style={{ marginRight: '8px' }}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              validators={['required']}
              errorMessages={['this field is required']}
            />
            {message && <p className="text-error">{message}</p>}
            <div className="flex flex-wrap items-center mb-4">
        <div className={clsx("relative", classes.signInButton)}>

        <Button
                style={{ marginLeft: '120px', color: '#2196F3' }}
                onClick={() => history.push('/session/forgot-password')}
>
                Forgot password?
            </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
            onClick={handleFormSubmit}
            style={{ width: '100%', maxWidth: '300px', marginTop: '10px' ,borderRadius: 12, height: '40px'}}
          >
            SIGN IN
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
              </div>
            </div>
            
            <div className="mt-4 text-center">
        <div className="dont-have-an">
          Don't have an account?{' '}
          <span className={classes.signUpLink}>Sign Up</span>
        </div>
      </div>
          </div>
        </div>
        <img
          className={classes.image}
          src="/assets/images/login-image.png"
          alt=""
        />
      </Card>

      <Dialog maxWidth="xs" open={selectUserRole}>
        <div className="p-8  w-450 mx-auto">
          <Alert severity="info">
            <strong>
              Please Select User Role, Which is You Want to Login And Perform in
              the Session{' '}
            </strong>
          </Alert>

          <TextField
            disableClearable
            className="w-full"
            options={otherUserRole}
            onChange={(e, value) => {
              setSelectedUserRole(value);
            }}
            value={selectedUserRole}
            label="User Role"
            variant="outlined"
            size="small"
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <Button
            variant="contained"
            className="mt-2"
            color="primary" // Blue color
            type="submit"
            onClick={saveUserRole}
          >
            Save
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default JwtLogin;
