import { slice } from './authReducer';
import { revertAll } from '../globalActions';

export const UpdateAuthentication = ({ user, accessToken, refreshToken }) => {
    return (dispatch, getState) => {
        dispatch(slice.actions.updateAuthentication({ user, accessToken, refreshToken }));
    };
};

export function TokenReceived(payload) {
    return (dispatch, getState) => {
        dispatch(slice.actions.tokenReceived(payload));
    };
}

export function LogoutUser() {
    return (dispatch, getState) => {
        dispatch(revertAll());
    };
}
