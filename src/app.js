import * as yup from 'yup';
import onChange from 'on-change';
import { loading, success, danger, renderItem, renderInfo, h2 } from './service';


export default () => {

    
    const form = document.querySelector('.rss-form');
    const input = document.querySelector('input');
    const notification = document.querySelector('.feedback');
    const posts = document.querySelector('.posts');
    const feeds = document.querySelector('.feeds');
    const headerOne = h2('Посты');
    const headerTwo = h2('Фиды');

    yup.addMethod(yup.string, "alreadyExist", function (errorMessage) {
        return this.test(`test-existing`, errorMessage, function (value) {
          const { path, createError } = this;
      
          return (
            (!observer.website.list.includes(value)) ||
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
        status: {
            success: null,
            error: null,
        },
        Loader: {
            isLoading: null
        }
    }
    let schema = yup.object().shape({ current: yup.string().trim().url('Invalid Url').alreadyExist('Feed already exists')});

    const observer = onChange(state, (path, value) => {


        if(value === false) {
            loadObserver.isLoading = false;
            danger.textContent = errorObserver.error
            input.classList.add('is-invalid')
            notification.replaceChild(danger, notification.children[0] );
        }

       

        if(value) {
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
                        if(state.website.list.length === 1) {
            
                            posts.prepend(headerOne);
                            feeds.prepend(headerTwo)
                        }
                        input.classList.remove('is-invalid');
                        const color =  state.website.list.indexOf(state.website.current)
                        notification.replaceChild(success, current);
                        const items = data.querySelectorAll('item');
                        const title = data.querySelector('title');
                        const desc = data.querySelector('description');
                       
                        const ul = document.createElement('ul');
                        ul.classList.add('list-group','border-0', 'rounded-0')
                        posts.append(ul);
                        const descNode = renderInfo(title, desc, color)
                        feeds.append(descNode);

                        items.forEach(item => {
                            const node = renderItem(item, color);
                            ul.prepend(node);
                        })
                        observer.valid = null
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
    const errorObserver = onChange(state.status, () => {

        loadObserver.isLoading = false;
        danger.textContent = errorObserver.error
        input.classList.add('is-invalid')
        notification.replaceChild(danger, notification.children[0] );

    })

    


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadObserver.isLoading = true;
        const data = new FormData(e.target);
        const url = data.get('url');
        state.website.current = url;
        schema
            .validate(state.website)
            .then(() => {
                observer.valid = true;
        
            })
            .catch(e => {
                observer.valid = false
                errorObserver.error = e.message;
           
             })
            

            
        
   

    })

  
}

