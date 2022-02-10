const map = {
    0: 'border-primary',
    1: 'border-success',
    2: 'border-warning',
    3: 'border-info'
}

export const loading = document.createElement('span');
    loading.classList.add('text-white');
    loading.textContent = 'Loading';

export const success = document.createElement('span');
    success.classList.add('text-success');
    success.textContent = 'Success';

export const danger = document.createElement('span');
    danger.classList.add('text-danger');
    danger.textContent = 'Invalid url';

export const renderItem = (item, color) => {
    const card = document.createElement('div');
    card.classList.add('card','border', map[color])
    const body = document.createElement('div');
    body.classList.add('card-body');
    const text = item.querySelector('title');
    const href = item.querySelector('link');
    const link = document.createElement('a');
    link.href = href.textContent;
    link.textContent = text.textContent;
    link.setAttribute('target', '_blank')
    body.append(link);
    card.append(body)
    

    return card
}
export const renderInfo = (item, item2, color) => {
    const card = document.createElement('div');
    card.classList.add('card','border', map[color])
    const body = document.createElement('div');
    const body2 = document.createElement('div')
    body.classList.add('card-body');
    body2.classList.add('card-body');
    const text = item.textContent;
    const text2 = item2.textContent;
    body2.append(text2)
    body.append(text);
    card.append(body);
    card.append(body2)
    return card
}
export const h2 = (text) => {
    const header = document.createElement('h2');
    header.classList.add('card-title', 'h4');
    header.textContent = text;

    return header
}