
export function parseLabel (category) {
  let label = category.label.indexOf('/travel/tourist facilities') > -1 ? '/travel/tourist facilities' : category.label;

  switch (label) {
    case '/news': return 'Notícias';
    case '/finance': return 'Finanças';
    case '/food and drink': return 'Alimentação';
    case '/law, govt and politics': return 'Política';
    case '/travel/tourist facilities': return 'Transporte';
    case '/law, govt and politics/government': return 'Governo';
    case '/business and industrial/biomedical': return 'Biomedicina';
    case '/finance/personal finance/insurance': return 'Seguros';
    case '/law, govt and politics/politics/elections': return 'Eleições';
    case '/law, govt and politics/government/legislative': return 'Leis/Legislativo';
    case '/finance/personal finance/financial planning/retirement and pension': return 'Previdência';
    default: 
      console.warn('Categoria não registrada: ' + label);
      return null;
  }
}

// case '/news': return { img: 'news.ico', title: 'Notícias' };
// case '/finance': return { img: 'retirement.svg', title: 'Finanças' };
// case '/food and drink': return { img: 'foodDrink.png', title: 'Alimentação' };
// case '/law, govt and politics': return { img: 'politics.png', title: 'Política' };
// case '/travel/tourist facilities': return { img: 'retirement.svg', title: 'Transporte' };
// case '/law, govt and politics/government': return { img: 'government.png', title: 'Governo' };
// case '/business and industrial/biomedical': return { img: 'medical.jpeg', title: 'Biomedicina' };
// case '/finance/personal finance/insurance': return { img: 'insurance.png', title: 'Seguros' };
// case '/law, govt and politics/politics/elections': return { img: 'elections.png', title: 'Eleições' };
// case '/law, govt and politics/government/legislative': return { img: 'legislative.png', title: 'Leis / Legislativo' };
// case '/finance/personal finance/financial planning/retirement and pension': return { img: 'retirement.svg', title: 'Previdência' };
// default: return { img: null, title: 'Categoria não identificada', label: label };