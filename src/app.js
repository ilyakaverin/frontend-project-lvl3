import * as yup from 'yup';
import onChange from 'on-change';


export default () => {

    
    const form = document.querySelector('.rss-form');

    const state = {
        website: null,
        valid: null,
    }
    let schema = yup.object().shape({ website: yup.string().trim().url()});
    const observer = onChange(state, (path, value) => {

        const input = document.querySelector('input');
        const notification = document.querySelector('.feedback')
        
        schema
            .isValid(state)
            .then(res => {
               state.valid = res;
               console.log(state)
               if(state.valid) {
                input.classList.remove('is-invalid');
                notification.classList.remove('text-danger');
                notification.classList.add('text-success')
                notification.textContent = 'success';
                
            } else {
                state.valid = res;
                input.classList.add('is-invalid');
                notification.classList.remove('text-success');
                notification.classList.add('text-danger');
                notification.textContent = 'Invalid Url';
                
            }
        })

    })


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const url = data.get('url');
        observer.website = url;
   

    })

  
}