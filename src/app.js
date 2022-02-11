import * as yup from 'yup';
import onChange from 'on-change';
import i18n from 'i18next';
import {
  status, renderItem, renderInfo, h2,
} from './service';
import ru from './ru-locale';

const newInstance = i18n.createInstance();
newInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
});

export default () => {
  const form = document.querySelector('.rss-form');
  const input = document.querySelector('input');
  const notification = document.querySelector('.feedback');
  const posts = document.querySelector('.posts');
  const feeds = document.querySelector('.feeds');
  const headerOneLocale = newInstance.t('Posts');
  const headerTwoLocale = newInstance.t('Feeds');
  const headerOne = h2(headerOneLocale);
  const headerTwo = h2(headerTwoLocale);

  const state = {
    website: {
      current: null,
      list: [],
      current_modal: null,
      items: {},
    },
    valid: null,
    status: {
      success: null,
      error: null,
    },
    Loader: {
      isLoading: null,
    },
  };
  // eslint-disable-next-line
  yup.addMethod(yup.string, 'alreadyExist', function (errorMessage) {
    // eslint-disable-next-line
    return this.test('test-existing', errorMessage, function (value) {
      const { path, createError } = this;

      return (
        (!state.website.list.includes(value))
            || createError({ path, message: errorMessage })
      );
    });
  });
  const schema = yup.object().shape({ current: yup.string().trim().url('Invalid').alreadyExist('exists') });

  const loadObserver = onChange(state.Loader, (path, value) => {
    const current = notification.children[0];
    const loadingLocale = newInstance.t('loading');

    if (value) {
      input.classList.remove('is-invalid');
      if (notification.children.length === 0) {
        notification.append(status(loadingLocale, 'text-white'));
      } else {
        notification.replaceChild(status(loadingLocale, 'text-white'), current);
      }
    }
  });

  const observer = onChange(state, (path, value) => {
    if (value) {
      fetch(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.website.current}`)}`)
      // eslint-disable-next-line
        .then((response) => {
          if (response.ok) return response.json();
          loadObserver.isLoading = false;
          const errorLocale = newInstance.t('check');
          notification.replaceChild(status(errorLocale, 'text-danger'), notification.children[0]);
        })
        .then((data) => data.contents)
        .then((str) => {
          const parsed = new DOMParser();
          return parsed.parseFromString(str, 'text/xml');
        })
        .then((data) => {
          loadObserver.isLoading = false;
          const errorNode = data.querySelector('parsererror');
          const current = notification.children[0];

          if (errorNode) {
            input.classList.add('is-invalid');
            const errorLocale = newInstance.t('invalid');
            notification.replaceChild(status(errorLocale, 'text-danger'), current);
            observer.valid = null;
          } else {
            state.website.list.push(state.website.current);
            if (state.website.list.length === 1) {
              posts.prepend(headerOne);
              feeds.prepend(headerTwo);
            }
            input.classList.remove('is-invalid');
            const color = state.website.list.indexOf(state.website.current);
            const successLocale = newInstance.t('success');
            notification.replaceChild(status(successLocale, 'text-success'), current);
            const items = data.querySelectorAll('item');
            const link = data.querySelector('link').textContent;
            state.website.items[link] = items;
            const title = data.querySelector('title');
            const desc = data.querySelector('description');

            const ul = document.createElement('ul');
            ul.classList.add('list-group', 'border-0', 'rounded-0');
            posts.append(ul);
            const descNode = renderInfo(title, desc, color);
            feeds.append(descNode);

            items.forEach((item, index) => {
              const buttonText = newInstance.t('button');
              const node = renderItem(item, color, buttonText, index, link);
              ul.prepend(node);
            });

            observer.valid = null;
            input.focus();
            form.reset();
          }
        })
        .catch(() => {
          loadObserver.isLoading = false;
          const errorLocale = newInstance.t('check');
          notification.replaceChild(status(errorLocale, 'text-danger'), notification.children[0]);
        });
    }
  });

  const errorObserver = onChange(state.status, () => {
    loadObserver.isLoading = false;
    const errorLocale = newInstance.t(errorObserver.error);
    input.classList.add('is-invalid');
    notification.replaceChild(status(errorLocale, 'text-danger'), notification.children[0]);
    state.status.error = '';
  });
  const modalObserver = onChange(state.website, (path, value) => {
    const id = value[0];
    const origin = value[1];
    const sibling = value[2];

    sibling.classList.remove('fw-bold');
    sibling.classList.add('fw-normal', 'link-secondary');

    const title = document.querySelector('.modal-title');
    const desc = document.querySelector('.modal-body > p');
    const link = document.querySelector('.modal-footer > a');
    const close = document.querySelector('.modal-footer > button');
    link.textContent = newInstance.t('show');
    close.textContent = newInstance.t('close');
    const currentTitle = state.website.items[origin][id].querySelector('title').textContent;
    const currentDesc = state.website.items[origin][id].querySelector('description').textContent;
    const currentHref = state.website.items[origin][id].querySelector('link').textContent;
    title.textContent = currentTitle;
    desc.textContent = currentDesc;
    link.href = currentHref;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    loadObserver.isLoading = true;
    const data = new FormData(event.target);
    const url = data.get('url');
    state.website.current = url;
    schema
      .validate(state.website)
      .then(() => {
        observer.valid = true;
      })
      .catch((error) => {
        observer.valid = false;
        errorObserver.error = error.message;
      });
  });
  const but = document.querySelector('.container-xxl');
  but.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    const origin = e.target.getAttribute('data-link');
    const link = e.target.previousElementSibling;
    modalObserver.current_modal = [id, origin, link];
  });
};
