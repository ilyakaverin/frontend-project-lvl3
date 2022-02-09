import * as yup from 'yup';
import onChange from 'on-change';
import { loading, success, danger, render } from './service';


export default () => {

    
    const form = document.querySelector('.rss-form');
    const input = document.querySelector('input');
    const notification = document.querySelector('.feedback');
    const posts = document.querySelector('.posts');
    const feeds = document.querySelector('.feeds');

    yup.addMethod(yup.string, "alreadyExist", function (errorMessage) {
        return this.test(`test-existing`, errorMessage, function (value) {
          const { path, createError } = this;
      
          return (
            (!state.website.list.includes(value)) ||
            createError({ path, message: errorMessage })
          );
        });
      });
    
    
    const state = {
        website: {
            current: null,
            list : []
        },
        valid: null,
        errors: null,
        Loader: {
            isLoading: null
        }
    }
    let schema = yup.object().shape({ current: yup.string().trim().url('Invalid Url').alreadyExist('Feed already exists')});

    const observer = onChange(state, (path, value) => {


        if(state.valid === false) {
            loadObserver.isLoading = false;
            danger.textContent = state.errors;
            notification.replaceChild(danger, notification.children[0] );
            state.errors = null
           
        } 
        if(state.valid) {
            fetch(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(`${state.website.current}`)}`) 
                .then(response => {
                    if (response.ok) return response.json()
                    loadObserver.isLoading = false;
                    danger.textContent = 'Network response was not ok.';
                    notification.replaceChild(danger, notification.children[0])
                  })
                  .then(data => data.contents)
                  .then(str => {
                    const parsed = new DOMParser();
                    return parsed.parseFromString(str, "text/xml")
                })
                .then(data => {
                    loadObserver.isLoading = false;
                    const errorNode = data.querySelector('parsererror');
                    const current = notification.children[0];
                    
                    if(errorNode) {
                        input.classList.add('is-invalid');
                        notification.replaceChild(danger, current);
                        
                    } else {
                        state.website.list.push(state.website.current);
                        input.classList.remove('is-invalid');
                        notification.replaceChild(success, current);
                        const items = data.querySelectorAll('item');
                        console.log(data);
                        const title = data.querySelector('title');
                        const desc = data.querySelector('description');
                        const ul = document.createElement('ul');
                        posts.append(ul)
                        feeds.append(title.textContent);
                        feeds.append(desc.textContent);

                        items.forEach(item => {
                            const node = render(item);
                            node.classList.add('border','border-primary')
                            ul.prepend(node);
                        })

                        items
                        input.focus();
                        form.reset();
                      
                    }
                }).catch(() => {
                    loadObserver.isLoading = false;
                    danger.textContent = 'Check you internet connection, then reload page';
                    notification.replaceChild(danger, notification.children[0])
                })
        }
        

    });
    


    const loadObserver = onChange(state.Loader, (path, value) => {

        const current = notification.children[0]

        if(value) {
            if(notification.children.length === 0)  {
                notification.append(loading)
                
            } else {
                notification.replaceChild(loading, current )
            }
        } 


    })

    


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadObserver.isLoading = true;
        const data = new FormData(e.target);
        const url = data.get('url');
        observer.website.current = url;
        schema
            .validate(state.website)
            .then(() => {observer.valid = true})
            .catch(e => {
                observer.valid = false
               observer.errors = e.message
             })

            
        
   

    })

  
}

