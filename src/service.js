const map = {
  0: 'border-primary',
  1: 'border-success',
  2: 'border-warning',
  3: 'border-info',
};

export const status = (text, textStatus) => {
  const span = document.createElement('span');
  span.classList.add(textStatus);
  span.textContent = text;

  return span;
};

export const buildItem = (item, color, buttonText, buttonIndex, origin) => {
  const button = document.createElement('button');
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'border', map[color]);
  li.classList.add('align-items-start', 'justify-content-between');
  button.setAttribute('type', 'button');
  button.textContent = buttonText;
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm', map[color]);
  button.setAttribute('data-id', buttonIndex);
  button.setAttribute('data-bs-target', '#modal');
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-link', origin);
  const text = item.querySelector('title');
  const href = item.querySelector('link');
  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('rel', 'noopener noreferrer');
  link.href = href.textContent;
  link.textContent = text.textContent;
  link.setAttribute('target', '_blank');
  li.append(link);
  li.append(button);

  return li;
};
export const buildInfo = (item, item2, color) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border', map[color]);
  const body = document.createElement('div');
  const body2 = document.createElement('div');
  body.classList.add('card-body');
  body2.classList.add('card-body');
  const text = item.textContent;
  const text2 = item2.textContent;
  body2.append(text2);
  body.append(text);
  card.append(body);
  card.append(body2);
  return card;
};
export const h2 = (text) => {
  const header = document.createElement('h2');
  header.classList.add('card-title', 'h4');
  header.textContent = text;

  return header;
};
