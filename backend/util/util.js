const { format } = require('date-fns');

const formatDateEnglish = date => format(date, "YYYY-MM-DD");
const formatDate = date => format(date, "DD/MM/YYYY");
const formatMoney = number => new Intl.NumberFormat('fr-Fr', { style: 'currency', currency: 'XOF' }).format(number);
const months = [
    'Janvier' , 'Fevrier' , 'Mars' , 'Avril' , 'Mai' , 'Juin',
    'Juillet' ,'Août' , 'Septembre' , 'Octobre' , 'Novembre' , 'Décembre'
]

module.exports = {
    formatDate,
    formatDateEnglish,
    formatMoney,
    months
}