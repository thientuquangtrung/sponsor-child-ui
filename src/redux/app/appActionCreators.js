import { slice } from './appReducer';

export const closeSnackBar = () => async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar =
    ({ severity, message }) =>
    async (dispatch, getState) => {
        dispatch(
            slice.actions.openSnackBar({
                message,
                severity,
            }),
        );

        setTimeout(() => {
            dispatch(slice.actions.closeSnackBar());
        }, 4000);
    };

export const AddUpload = (upload) => async (dispatch, getState) => {
    dispatch(slice.actions.addUpload(upload));
};

export const UpdateUploadProgress = (payload) => async (dispatch, getState) => {
    dispatch(slice.actions.updateUploadProgress(payload));
};

export const RemoveUpload = (id) => async (dispatch, getState) => {
    dispatch(slice.actions.removeUpload(id));
};
