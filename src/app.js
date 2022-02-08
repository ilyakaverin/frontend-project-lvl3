import * as yup from 'yup';
import onChange from 'on-change';


export default () => {

    
    const form = document.querySelector('.rss-form');
    const input = document.querySelector('input');
    const notification = document.querySelector('.feedback');
    const loading = document.createElement('span');
    loading.classList.add('text-white');
    loading.textContent = 'Loading'


    const state = {
        website: {
            current: null,
            list : []
        },
        valid: null,
        Loader: {
            isLoading: null
        }
    }
    let schema = yup.object().shape({ current: yup.string().trim().url()});
    const observer = onChange(state, () => {

            if(state.valid) {

               

  fetch(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.website.current}`)}`) 
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                  })
                  .then(data => data.contents)
                  .then(str => {
                    
                    const parsed = new DOMParser();
                    return parsed.parseFromString(str, "text/xml")
                })
                .then(data => {
                    loadObserver.isLoading = false;
                    console.log(data)
                    const errorNode = data.querySelector('parsererror');

                    if(!errorNode) {
                        input.classList.remove('is-invalid');
                        notification.classList.remove('text-danger');
                        notification.classList.add('text-success')
                        notification.innerHTML = 'success';
                        
                    } else {
                        state.valid = res;
                        input.classList.add('is-invalid');
                        notification.classList.remove('text-success');
                        notification.classList.add('text-danger');
                        notification.innerHTML = 'Invalid Url';
                        
                    }
                })
                .catch(e => {
                    loadObserver.isLoading = false;
                    input.classList.add('is-invalid');
                        notification.classList.remove('text-success');
                        notification.classList.add('text-danger');
                        notification.textContent = 'Invalid Url';
                })

                
            
              } 

            
    })

    const loadObserver = onChange(state.Loader, (path, value) => {

        console.log(value)

        if(value) {
            notification.append(loading)
        }


    })

    


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const url = data.get('url');
        observer.website.current = url;
        loadObserver.isLoading = true;
        console.log(loadObserver)
        schema
            .isValid(state.website)
            .then(res => { 
                observer.valid = res;
               

            })
        
   

    })

  
}

