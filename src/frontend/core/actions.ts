import { useSnackbarStore } from "../store/system/useSnackbarStore";

/**
 * A shortcut to push a snack notification from everywhere in the code
 */
export const enqueueSnack = useSnackbarStore.getState().enqueueSnack;
