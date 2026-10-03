// =====================================================
// ACCOUNT STORAGE
// =====================================================

const ACCOUNT_KEY = "account";

const INITIAL_BALANCE = 100000;


// =====================================================
// NORMALIZE TYPE
// =====================================================

const normalizeType = (value) => {

  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

};


// =====================================================
// NORMALIZE SYMBOL
// =====================================================

const normalizeSymbol = (value) => {

  return String(value || "")
    .trim()
    .toUpperCase();

};


// =====================================================
// CHECK MUTUAL FUND
// =====================================================

const isMutualFundType = (value) => {

  const type = normalizeType(value);

  return [

    "MUTUAL_FUND",
    "MUTUAL_FUNDS",
    "MUTUALFUND",
    "MUTUALFUNDS",
    "MUTUAL",
    "FUND",
    "MF"

  ].includes(type);

};


// =====================================================
// CREATE DEFAULT ACCOUNT
// =====================================================

const createDefaultAccount = () => {

  return {

    balance: INITIAL_BALANCE,

    investedAmount: 0,

    holdings: []

  };

};


// =====================================================
// GET ACCOUNT
// =====================================================

export const getAccount = () => {

  try {

    const savedAccount =
      localStorage.getItem(ACCOUNT_KEY);


    // -------------------------------------------------
    // NO ACCOUNT
    // -------------------------------------------------

    if (!savedAccount) {

      const newAccount =
        createDefaultAccount();

      localStorage.setItem(

        ACCOUNT_KEY,

        JSON.stringify(newAccount)

      );

      return newAccount;

    }


    // -------------------------------------------------
    // PARSE ACCOUNT
    // -------------------------------------------------

    const account =
      JSON.parse(savedAccount);


    // -------------------------------------------------
    // INVALID ACCOUNT
    // -------------------------------------------------

    if (
      !account ||
      typeof account !== "object"
    ) {

      const newAccount =
        createDefaultAccount();

      localStorage.setItem(

        ACCOUNT_KEY,

        JSON.stringify(newAccount)

      );

      return newAccount;

    }


    // -------------------------------------------------
    // HOLDINGS SAFETY
    // -------------------------------------------------

    if (!Array.isArray(account.holdings)) {

      account.holdings = [];

    }


    // -------------------------------------------------
    // BALANCE SAFETY
    // -------------------------------------------------

    const balance =
      Number(account.balance);

    account.balance =
      Number.isFinite(balance)
        ? balance
        : INITIAL_BALANCE;


    // -------------------------------------------------
    // INVESTED AMOUNT SAFETY
    // -------------------------------------------------

    const investedAmount =
      Number(account.investedAmount);

    account.investedAmount =
      Number.isFinite(investedAmount)
        ? investedAmount
        : 0;


    return account;

  }

  catch (error) {

    console.error(
      "GET ACCOUNT ERROR:",
      error
    );


    const newAccount =
      createDefaultAccount();


    localStorage.setItem(

      ACCOUNT_KEY,

      JSON.stringify(newAccount)

    );


    return newAccount;

  }

};


// =====================================================
// SAVE ACCOUNT
// =====================================================

export const saveAccount = (account) => {

  if (!account) {

    return null;

  }


  // -------------------------------------------------
  // SAFETY
  // -------------------------------------------------

  if (!Array.isArray(account.holdings)) {

    account.holdings = [];

  }


  account.balance =
    Number(
      Number(account.balance || 0)
        .toFixed(2)
    );


  account.investedAmount =
    Number(
      Number(account.investedAmount || 0)
        .toFixed(2)
    );


  // -------------------------------------------------
  // SAVE
  // -------------------------------------------------

  localStorage.setItem(

    ACCOUNT_KEY,

    JSON.stringify(account)

  );


  // -------------------------------------------------
  // NOTIFY APPLICATION
  // -------------------------------------------------

  window.dispatchEvent(

    new Event("accountUpdated")

  );


  return account;

};


// =====================================================
// ADD MONEY
// =====================================================

export const addMoney = (amount) => {

  const account =
    getAccount();


  const value =
    Number(amount);


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    console.error(
      "Invalid add money amount:",
      amount
    );

    return null;

  }


  account.balance += value;


  account.balance =
    Number(
      account.balance.toFixed(2)
    );


  saveAccount(account);


  return account;

};


// =====================================================
// REMOVE MONEY
// =====================================================

export const removeMoney = (amount) => {

  const account =
    getAccount();


  const value =
    Number(amount);


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {

    return null;

  }


  if (
    value >
    Number(account.balance)
  ) {

    console.error(
      "Insufficient balance"
    );

    return null;

  }


  account.balance -= value;


  account.balance =
    Number(
      account.balance.toFixed(2)
    );


  saveAccount(account);


  return account;

};


// =====================================================
// ADD HOLDING / BUY
//
// Supports:
// STOCK
// MUTUAL_FUND
// =====================================================

export const addHolding = (

  asset,

  quantity,

  price,

  holdingType = "STOCK"

) => {

  const account =
    getAccount();


  const qty =
    Number(quantity);


  const buyPrice =
    Number(price);


  // -------------------------------------------------
  // VALIDATION
  // -------------------------------------------------

  if (
    !asset ||
    !Number.isFinite(qty) ||
    qty <= 0 ||
    !Number.isFinite(buyPrice) ||
    buyPrice <= 0
  ) {

    console.error(
      "INVALID HOLDING DATA:",
      {
        asset,
        quantity,
        price,
        holdingType
      }
    );

    return null;

  }


  // -------------------------------------------------
  // TYPE
  // -------------------------------------------------

  const type =
    isMutualFundType(holdingType)
      ? "MUTUAL_FUND"
      : "STOCK";


  // -------------------------------------------------
  // SYMBOL
  // -------------------------------------------------

  const symbol =
    normalizeSymbol(

      asset.symbol ??
      asset.code ??
      asset.schemeCode ??
      asset.id

    );


  if (!symbol) {

    console.error(
      "ASSET SYMBOL MISSING:",
      asset
    );

    return null;

  }


  // -------------------------------------------------
  // INVESTMENT
  // -------------------------------------------------

  const investment =
    qty * buyPrice;


  // -------------------------------------------------
  // BALANCE CHECK
  // -------------------------------------------------

  if (
    investment >
    Number(account.balance)
  ) {

    console.error(
      "INSUFFICIENT BALANCE"
    );

    return null;

  }


  // -------------------------------------------------
  // FIND EXISTING HOLDING
  // -------------------------------------------------

  const existingHolding =
    account.holdings.find(

      (holding) => {

        return (

          normalizeSymbol(
            holding.symbol
          ) === symbol &&

          normalizeType(
            holding.type
          ) === type

        );

      }

    );


  // =================================================
  // EXISTING HOLDING
  // =================================================

  if (existingHolding) {

    const oldQuantity =
      Number(
        existingHolding.quantity || 0
      );


    const oldInvestment =
      Number(
        existingHolding.investedAmount || 0
      );


    const totalQuantity =
      oldQuantity + qty;


    const totalInvestment =
      oldInvestment + investment;


    // -------------------------------------------------
    // WEIGHTED AVERAGE PRICE
    // -------------------------------------------------

    const averagePrice =
      totalInvestment /
      totalQuantity;


    existingHolding.quantity =
      Number(
        totalQuantity.toFixed(4)
      );


    existingHolding.units =
      Number(
        totalQuantity.toFixed(4)
      );


    existingHolding.averagePrice =
      Number(
        averagePrice.toFixed(2)
      );


    existingHolding.investedAmount =
      Number(
        totalInvestment.toFixed(2)
      );


    existingHolding.currentPrice =
      Number(
        buyPrice.toFixed(2)
      );


    // -------------------------------------------------
    // MUTUAL FUND
    // -------------------------------------------------

    if (type === "MUTUAL_FUND") {

      existingHolding.buyNAV =
        Number(
          averagePrice.toFixed(2)
        );


      existingHolding.currentNAV =
        Number(
          buyPrice.toFixed(2)
        );


      existingHolding.nav =
        Number(
          buyPrice.toFixed(2)
        );

    }

  }


  // =================================================
  // NEW HOLDING
  // =================================================

  else {

    const newHolding = {

      id:
        asset.id ||
        `${type}-${symbol}-${Date.now()}`,

      symbol:

        symbol,

      name:

        asset.name ||
        asset.fundName ||
        asset.schemeName ||
        asset.scheme_name ||
        symbol,

      quantity:

        Number(
          qty.toFixed(4)
        ),

      units:

        Number(
          qty.toFixed(4)
        ),

      averagePrice:

        Number(
          buyPrice.toFixed(2)
        ),

      investedAmount:

        Number(
          investment.toFixed(2)
        ),

      currentPrice:

        Number(
          buyPrice.toFixed(2)
        ),

      type:

        type,

      category:

        type === "MUTUAL_FUND"
          ? "MUTUAL FUND"
          : "STOCK"

    };


    // -------------------------------------------------
    // MUTUAL FUND DATA
    // -------------------------------------------------

    if (type === "MUTUAL_FUND") {

      newHolding.buyNAV =
        Number(
          buyPrice.toFixed(2)
        );


      newHolding.currentNAV =
        Number(
          buyPrice.toFixed(2)
        );


      newHolding.nav =
        Number(
          buyPrice.toFixed(2)
        );

    }


    account.holdings.push(
      newHolding
    );

  }


  // =================================================
  // REDUCE BALANCE
  // =================================================

  account.balance -=
    investment;


  account.balance =
    Number(
      account.balance.toFixed(2)
    );


  // =================================================
  // INCREASE TOTAL INVESTMENT
  // =================================================

  account.investedAmount +=
    investment;


  account.investedAmount =
    Number(
      account.investedAmount.toFixed(2)
    );


  // =================================================
  // SAVE
  // =================================================

  saveAccount(account);


  console.log(
    "BUY SUCCESS:",
    {
      symbol,
      type,
      quantity: qty,
      price: buyPrice,
      investment,
      balance: account.balance
    }
  );


  return account;

};


// =====================================================
// SELL HOLDING
//
// Supports:
// STOCK
// MUTUAL_FUND
// =====================================================

export const sellHolding = (

  symbol,

  quantity,

  sellPrice,

  holdingType = "STOCK"

) => {

  const account =
    getAccount();


  const qty =
    Number(quantity);


  const price =
    Number(sellPrice);


  // -------------------------------------------------
  // TYPE
  // -------------------------------------------------

  const type =
    isMutualFundType(holdingType)
      ? "MUTUAL_FUND"
      : "STOCK";


  // -------------------------------------------------
  // VALIDATION
  // -------------------------------------------------

  if (
    !Number.isFinite(qty) ||
    qty <= 0
  ) {

    console.error(
      "INVALID SELL QUANTITY"
    );

    return null;

  }


  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {

    console.error(
      "INVALID SELL PRICE"
    );

    return null;

  }


  // -------------------------------------------------
  // NORMALIZED SYMBOL
  // -------------------------------------------------

  const normalizedSymbol =
    normalizeSymbol(symbol);


  // -------------------------------------------------
  // FIND HOLDING
  // -------------------------------------------------

  const holding =
    account.holdings.find(

      (item) => {

        return (

          normalizeSymbol(
            item.symbol
          ) === normalizedSymbol &&

          normalizeType(
            item.type
          ) === type

        );

      }

    );


  // -------------------------------------------------
  // HOLDING NOT FOUND
  // -------------------------------------------------

  if (!holding) {

    console.error(
      "HOLDING NOT FOUND:",
      {
        symbol,
        type
      }
    );

    return null;

  }


  // -------------------------------------------------
  // CURRENT QUANTITY
  // -------------------------------------------------

  const currentQuantity =
    Number(
      holding.quantity || 0
    );


  // -------------------------------------------------
  // QUANTITY CHECK
  // -------------------------------------------------

  if (
    qty >
    currentQuantity
  ) {

    console.error(
      "INSUFFICIENT HOLDING QUANTITY"
    );

    return null;

  }


  // -------------------------------------------------
  // AVERAGE BUY PRICE
  // -------------------------------------------------

  const averagePrice =
    Number(
      holding.averagePrice || 0
    );


  // -------------------------------------------------
  // INVESTMENT REMOVED
  // -------------------------------------------------

  const removedInvestment =
    averagePrice * qty;


  // -------------------------------------------------
  // SELL VALUE
  // -------------------------------------------------

  const sellValue =
    price * qty;


  // -------------------------------------------------
  // REALIZED PROFIT / LOSS
  // -------------------------------------------------

  const realizedProfitLoss =
    sellValue -
    removedInvestment;


  // =================================================
  // ADD SELL MONEY TO BALANCE
  // =================================================

  account.balance +=
    sellValue;


  account.balance =
    Number(
      account.balance.toFixed(2)
    );


  // =================================================
  // REDUCE INVESTED AMOUNT
  // =================================================

  account.investedAmount -=
    removedInvestment;


  account.investedAmount =
    Math.max(

      0,

      Number(
        account.investedAmount.toFixed(2)
      )

    );


  // =================================================
  // REMAINING QUANTITY
  // =================================================

  const remainingQuantity =
    currentQuantity - qty;


  holding.quantity =
    Number(
      remainingQuantity.toFixed(4)
    );


  holding.units =
    Number(
      remainingQuantity.toFixed(4)
    );


  // =================================================
  // REMAINING INVESTMENT
  // =================================================

  holding.investedAmount =
    Number(

      (
        remainingQuantity *
        averagePrice
      ).toFixed(2)

    );


  // =================================================
  // UPDATE CURRENT PRICE
  // =================================================

  holding.currentPrice =
    Number(
      price.toFixed(2)
    );


  // =================================================
  // MUTUAL FUND
  // =================================================

  if (type === "MUTUAL_FUND") {

    holding.currentNAV =
      Number(
        price.toFixed(2)
      );


    holding.nav =
      Number(
        price.toFixed(2)
      );

  }


  // =================================================
  // REMOVE HOLDING IF ZERO
  // =================================================

  if (
    remainingQuantity <= 0.000001
  ) {

    account.holdings =
      account.holdings.filter(

        (item) => {

          return !(
            normalizeSymbol(
              item.symbol
            ) === normalizedSymbol &&

            normalizeType(
              item.type
            ) === type

          );

        }

      );

  }


  // =================================================
  // SAVE
  // =================================================

  saveAccount(account);


  // =================================================
  // LOG
  // =================================================

  console.log(
    "========================================"
  );


  console.log(
    "✅ SELL SUCCESS"
  );


  console.log(
    "SYMBOL:",
    normalizedSymbol
  );


  console.log(
    "TYPE:",
    type
  );


  console.log(
    "SELL QUANTITY:",
    qty
  );


  console.log(
    "SELL PRICE:",
    price
  );


  console.log(
    "SELL VALUE:",
    sellValue
  );


  console.log(
    "REALIZED P/L:",
    realizedProfitLoss
  );


  console.log(
    "REMAINING QUANTITY:",
    remainingQuantity
  );


  console.log(
    "BALANCE:",
    account.balance
  );


  console.log(
    "========================================"
  );


  return {

    ...account,

    soldDetails: {

      symbol:
        normalizedSymbol,

      type:
        type,

      quantity:
        qty,

      sellPrice:
        price,

      sellValue:
        Number(
          sellValue.toFixed(2)
        ),

      investedAmount:
        Number(
          removedInvestment.toFixed(2)
        ),

      profitLoss:
        Number(
          realizedProfitLoss.toFixed(2)
        )

    }

  };

};


// =====================================================
// UPDATE HOLDING PRICE
//
// Used for LIVE price / NAV updates
// =====================================================

export const updateHoldingPrice = (

  symbol,

  currentPrice,

  holdingType = "STOCK"

) => {

  const account =
    getAccount();


  const price =
    Number(currentPrice);


  if (
    !Number.isFinite(price) ||
    price <= 0
  ) {

    return account;

  }


  const type =
    isMutualFundType(holdingType)
      ? "MUTUAL_FUND"
      : "STOCK";


  const normalizedSymbol =
    normalizeSymbol(symbol);


  account.holdings =
    account.holdings.map(

      (holding) => {

        if (

          normalizeSymbol(
            holding.symbol
          ) === normalizedSymbol &&

          normalizeType(
            holding.type
          ) === type

        ) {

          return {

            ...holding,

            currentPrice:
              Number(
                price.toFixed(2)
              ),

            ...(type === "MUTUAL_FUND"

              ? {

                  currentNAV:
                    Number(
                      price.toFixed(2)
                    ),

                  nav:
                    Number(
                      price.toFixed(2)
                    )

                }

              : {})

          };

        }


        return holding;

      }

    );


  saveAccount(account);


  return account;

};


// =====================================================
// GET HOLDING
// =====================================================

export const getHolding = (

  symbol,

  holdingType = "STOCK"

) => {

  const account =
    getAccount();


  const type =
    isMutualFundType(holdingType)
      ? "MUTUAL_FUND"
      : "STOCK";


  const normalizedSymbol =
    normalizeSymbol(symbol);


  return account.holdings.find(

    (holding) => {

      return (

        normalizeSymbol(
          holding.symbol
        ) === normalizedSymbol &&

        normalizeType(
          holding.type
        ) === type

      );

    }

  ) || null;

};


// =====================================================
// RESET ACCOUNT
// =====================================================

export const resetAccount = () => {

  const newAccount =
    createDefaultAccount();


  // -------------------------------------------------
  // ACCOUNT RESET
  // -------------------------------------------------

  localStorage.setItem(

    ACCOUNT_KEY,

    JSON.stringify(newAccount)

  );


  // -------------------------------------------------
  // OLD STORAGE CLEANUP
  // -------------------------------------------------

  localStorage.removeItem(
    "orders"
  );

  localStorage.removeItem(
    "positions"
  );

  localStorage.removeItem(
    "foPositions"
  );

  localStorage.removeItem(
    "holdings"
  );

  localStorage.removeItem(
    "mfHoldings"
  );

  localStorage.removeItem(
    "watchlist"
  );


  // -------------------------------------------------
  // NOTIFY APPLICATION
  // -------------------------------------------------

  window.dispatchEvent(

    new Event("accountUpdated")

  );


  console.log(
    "ACCOUNT RESET:",
    newAccount
  );


  return newAccount;

};