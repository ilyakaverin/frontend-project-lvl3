export const loading = document.createElement('span');
    loading.classList.add('text-white');
    loading.textContent = 'Loading';

export const success = document.createElement('span');
    success.classList.add('text-success');
    success.textContent = 'Success';

export const danger = document.createElement('span');
    danger.classList.add('text-danger');
    danger.textContent = 'Invalid url';

export const render = (item) => {
    const card = document.createElement('div');
    card.classList.add('card')
    const body = document.createElement('div');
    body.classList.add('card-body');
    const text = item.querySelector('title');
    body.append(text);
    card.append(body)
    

    return card
}
