const fs = require("fs");
require('dotenv').config()

const fileName = process.env.SOURCE_CSV;

const writeNewCSV = jsonObj => {
  const fields = ["Date", "Reference", "Paid out", "Paid in", "Balance"];

  const newStatement = [];

  jsonObj.forEach(line => {
    newStatement.push({
      Date: line["Date"].replace(/\//g, "-"),
      Reference: line["Reference"],
      "Paid out":
        line["Amount (GBP)"] < 0 ? Math.abs(line["Amount (GBP)"]) : "",
      "Paid in": line["Amount (GBP)"] > 0 ? line["Amount (GBP)"] : "",
      Balance: line["Balance (GBP)"]
    });
  });

  // Create new CSV with 2 columns for payments and formatted date
  // Sort - to paid out and rest into paid in

  const Json2csvParser = require("json2csv").Parser;
  const opts = { fields };

  try {
    const parser = new Json2csvParser(opts);
    const csv = parser.parse(newStatement);
    console.log(csv);
    fs.writeFile(`${fileName}-fixed.csv`, csv, function(
      err,
      data
    ) {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  } catch (err) {
    console.error(err);
  }
};

/** csv file
a,b,c
1,2,3
4,5,6
*/
const csv = require("csvtojson");
csv()
  .fromFile(`./${fileName}.csv`)
  .then(jsonObj => {
    writeNewCSV(jsonObj);
  });

// Example json obj
// { Date: '',
//     'Counter Party': 'Opening Balance',
//     Reference: '',
//     Type: '',
//     'Amount (GBP)': '',
//     'Balance (GBP)': '0.00' },
//   { Date: '03/08/2018',
//     'Counter Party': 'ONPONO LTD',
//     Reference: 'TRANSFER TEST',
//     Type: 'FASTER PAYMENT',
//     'Amount (GBP)': '1.00',
//     'Balance (GBP)': '1.00' },
