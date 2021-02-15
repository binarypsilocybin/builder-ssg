module.exports = formatTaxonomy = (taxonomy) => {
  let taxFormatted =  []
  taxonomy.forEach(el => {
    let taxSplited = el.split(', ');
    if (taxSplited.length !== 3) {
      throw 'err';
    };
    taxObj = {}
    taxObj['page'] = taxSplited[0]
    taxObj['section'] = taxSplited[1]
    taxObj['order'] = parseInt(taxSplited[2])
    taxFormatted.push(taxObj)
  });
  return taxFormatted;
}