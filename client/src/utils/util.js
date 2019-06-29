import { format } from "date-fns";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as actionTypes from '../store/actions/actionTypes';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const isEmpty = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};


const errorDialog = text => {
    MySwal.fire(
        "Erreur",
        text,
        "error"
    );
}

const successDialog = text => {
    MySwal.fire(
        "Succès",
        text,
        "success"
    );
}

const questionDialog = (text , yesCallback , noCallback) => {
    MySwal
    .fire({
        title: "Etes vous sûr?",
        text,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui",
        cancelButtonText: "Non",
        reverseButtons: true
    })
    .then(result => {
        if (result.value) {
            yesCallback();
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            if(noCallback)
                noCallback();
        }
    });
};

const formatDateEnglish = date => format(date, "YYYY-MM-DD");
const formatDate = date => format(date, "DD/MM/YYYY");
const formatMoney = number => new Intl.NumberFormat('fr-Fr', { style: 'currency', currency: 'XOF' }).format(number);

const makeRequest = (url , method , data = {} , callback = null , isFetchRequest = true) => {
    return dispatch => {
        dispatch({ type: actionTypes.FETCH_RESOURCE_START });
        axios({ url , method , data})
        .then(response => {
            dispatch({ type: actionTypes.FETCH_RESOURCE_SUCCESS , isFetchRequest });
            if(callback)
                callback(response.data , dispatch);
        })
        .catch(err => {
            dispatch({
                type: actionTypes.FETCH_RESOURCE_FAIL,
                payload: {errors: err.response.data}
            })
        })
    }
}

export { isEmpty, formatDateEnglish, formatDate, questionDialog , successDialog , errorDialog , makeRequest , formatMoney };
