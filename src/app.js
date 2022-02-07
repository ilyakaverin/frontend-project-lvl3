import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';


export default () => {

    
    const form = document.querySelector('.rss-form');


    const state = {
        website: null,
        valid: null,
        isLoading: false
    }
    let schema = yup.object().shape({ website: yup.string().trim().url()});
    const observer = onChange(state, (path, value) => {

        const input = document.querySelector('input');
        const notification = document.querySelector('.feedback');

        schema
            .isValid(state)
            .then(res => { 
                state.valid = res;
                if(state.valid) {
                    
                    fetch(state.website, { 
                    method: 'HEAD'
                    })
                   .then(res => {
                       const contentType = res.headers.get('content-type');
                       console.log(res)
                       if (!contentType || !contentType.includes('application/rss+xml')) {
                           state.isLoading = false;
                           throw new TypeError("Oops, we haven't got rss!");
                         } else {
                             state.isLoading = false
                         }
    
                   })
                   .catch(e => console.log('oops, error', e))
    
                   
                  }

            })
        
        

           
            
        


            

    })


    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const url = data.get('url');
        observer.website = url;
        state.isLoading = true;
        
   

    })

  
}

