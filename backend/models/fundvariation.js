const sequelize = require("../util/db");
const DataTypes = require("sequelize");
const { formatDate , months } = require("../util/util");

const FundVariation = sequelize.define(
    "fundVariation",
    {
        loss: DataTypes.BOOLEAN,
        percentage: DataTypes.DOUBLE,
        realPercentage: DataTypes.DOUBLE,
        fundAmount: DataTypes.DOUBLE,
        amountWithVariation: DataTypes.DOUBLE,
        date: DataTypes.DATE
    },
    {}
);
FundVariation.associate = function(models) {
    // associations can be defined here
};

FundVariation.getDataForGraphByMonths = async date => {
    const variations = await sequelize.query(
        `SELECT MONTH(date) as date ,
         MAX(amountWithVariation) as amount from fundVariations
        WHERE date >= ${date} GROUP BY MONTH(date)`,
        { type: sequelize.QueryTypes.SELECT }
    );
    
    const labels = [];
    const data = [];
    variations.forEach(variation => {
        labels.push(months[variation.date - 1]);
        data.push(variation.amount);
    });
    return {
        labels: labels,
        datasets: [
            {
                label: "Evolution du fonds",
                data: data,
                fill: false,
                borderColor: "#03A9F4"
            }
        ]
    };
};

FundVariation.getDataForGraphByDays = async date => {
    const variations = await FundVariation.findAll({
        order: [["date", "ASC"]],
        limit: 25,
        where: {
            date: {
                [DataTypes.Op.gte]: date
            }
        }
    });
    const labels = [];
    const data = [];
    let variation = null;
    variations.forEach(item => {
        variation = item.get({ plain: true });
        labels.push(formatDate(variation.date));
        data.push(variation.amountWithVariation);
    });
    return {
        labels: labels,
        datasets: [
            {
                label: "Evolution du fonds",
                data: data,
                fill: false,
                borderColor: "#03A9F4"
            }
        ]
    };
};
module.exports = FundVariation;
