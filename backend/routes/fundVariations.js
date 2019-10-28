const router = require("express").Router();
const auth = require("../middlewares/auth");
const FundVariation = require("../models/fundvariation");
const UserFundVariation = require("../models/userfundvariation");
const Misc = require("../models/misc");
const User = require("../models/user");
const { getErrors, isEmpty } = require("../validation/util");
const fundVariationValidator = require("../validation/fundVariation");
const isAdmin = require("../middlewares/isAdmin");
const _ = require("lodash");
const sequelize = require("../util/db");

router.get("/", auth, async (req, res) => {
    const variations = await FundVariation.findAll({
        order: [["date", "DESC"]]
    });
    return res.send(variations);
});

router.get("/user", auth, async (req, res) => {
    const variations = await UserFundVariation.findAll({
        order: [["createdAt", "DESC"]],
        where: { userId: req.payload.user.id },
        include: [{ model: FundVariation, as: "variation" }]
    });
    return res.send(variations);
});

router.get("/graphData/:date/:type", auth, async (req, res) => {
    const { date, type } = req.params;
    if (!date || !type) {
        return res.status(400).send("Il manque des paramètres obligatoires");
    }
    const data =
        type === "day"
            ? await FundVariation.getDataForGraphByDays(date)
            : await FundVariation.getDataForGraphByMonths(date);
    return res.send(data);
});

router.post(
    "/",
    [auth, isAdmin, fundVariationValidator()],
    async (req, res) => {
        let errorResponse = getErrors(req);
        if (!isEmpty(errorResponse)) {
            return res.status(400).send(errorResponse);
        }
        const misc = await Misc.findOne({ raw: true });
        const variation = _.pick(req.body, ["date", "percentage", "loss"]);
        if (!variation.date) variation.date = new Date();
        variation.fundAmount = misc.fundCurrentAmount;
        variation.realPercentage = variation.percentage;

        if (variation.loss) {
            const loss = (variation.percentage * misc.fundCurrentAmount) / 100;
            misc.fundCurrentAmount -= loss;
            variation.realPercentage = 0;
            variation.amountWithVariation = misc.fundCurrentAmount;
        }
        
        else {
            /* si le fonds avait subit une perte, on comble d'abord la perte et le reste éventuel constitue un bénéfice */
            if (misc.fundCurrentAmount < misc.fundAmount) {
                const gain =
                    (variation.percentage * misc.fundCurrentAmount) / 100;
                /* Ici les pertes ont été comblées */
                if (gain + misc.fundCurrentAmount >= misc.fundAmount) {
                    const realGain =
                        gain - (misc.fundAmount - misc.fundCurrentAmount);
                    variation.realPercentage =
                        (realGain / misc.fundCurrentAmount) * 100;
                    misc.fundCurrentAmount = misc.fundAmount;
                } else {
                    variation.realPercentage = 0;
                    misc.fundCurrentAmount += gain;
                }
                variation.amountWithVariation = misc.fundCurrentAmount;
            }

            else {
                const gain = (variation.percentage * misc.fundCurrentAmount) / 100;
                variation.amountWithVariation = misc.fundCurrentAmount + gain;
            }
        }
        let transaction = await sequelize.transaction();
        try {
            const createdVaritaion = await FundVariation.create(variation, {
                transaction
            });
            await Misc.update(misc, {
                where: { id: misc.id },
                transaction
            });
            await transaction.commit();
            await User.updateUsersFundVariationsAndAmount(createdVaritaion);
            return res.send(createdVaritaion);
        } catch (err) {
            if (err) await transaction.rollback();
        }
        /*variation.amountWithVariation = misc.fundCurrentAmount;
    sequelize.transaction(transaction => {
        return FundVariation.create(variation , { transaction })
            .then(variation => {
                return Misc.update(misc , {
                    where: { id: misc.id },
                    transaction
                });
            })
    })
    .then(result => console.log(result))*/
    }
);

module.exports = router;
