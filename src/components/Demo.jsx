import React, {useState, useEffect} from 'react'
import {linkIcon, copy, loader, tick} from '../assets'
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {
  const [article, setArticle] = useState({
    url:'',
    summary:''
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("")

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromStorage = JSON.parse(localStorage.getItem('articles'));
    if(articlesFromStorage){
      setAllArticles(articlesFromStorage);
    }
  }, []);

  const handleCopy = (e, copyUrl) => {
    e.preventDefault();
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {data} = await getSummary({articleUrl: article.url});
    if(data?.summary){
      const newArticle = {...article, summary: data.summary}
    const updatedAllArticle = [newArticle, ...allArticles];
      setAllArticles(updatedAllArticle);
      setArticle(newArticle);
       localStorage.setItem('articles', JSON.stringify(updatedAllArticle))
    }
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
        <div className='flex flex-col w-full gap-2'>
              <form 
              className='relative flex justify-center items-center'
              onSubmit={handleSubmit}   
              >
               <img
                src={linkIcon}
                alt="link_icon"
                className='absolute left-0 my-2 ml-3 w-5'
               />
               <input
                 type='url'
                 placeholder='Enter a URL'
                 value = {article.url}
                 onChange={(e) => setArticle({ ...article, url:e.target.value})}
                 className='url_input peer'
                 required
               />
               <button
                 type='submit'
                 className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'

               >
                 <p>↵</p>
               </button>
              </form>
              {/*Browse URL History*/}
              <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
                  {allArticles.reverse().map((item, index) => (
                      <div 
                        key={`link-${index}`}
                       className='link_card'
                      >
                       <div className='copy_btn' onClick={(e) => handleCopy(e, item.url)}>
                          <img
                            src={copied === item.url ? tick : copy}
                            alt={copied === item.url ? "tick_icon" : "copy_icon"}
                            className='w-[40%] h-[40%] object-contain'
                          />
                        </div>
                        <p 
                        className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate' 
                        onClick={() => setArticle(item)}                        
                        >{item.url}</p>
                      </div>
                  ))}
              </div>
        </div>
        {/* Display Results */}
        <div className='my-10 max-w-full flex justify-center items-center'>
          {isFetching ? (<img src={loader} alt="loader" className='w-20 h-20 object-contain'/>)
          : error ? (
          <p className='font-inter font-bold text-black 
            text-center'>
              Well that was not supposed to happen ...
              <br/>
              <span className='font-satoshi font-normal text-gray-700'>
                {error?.data?.error}
              </span>
              </p>
              ) : (
               article.summary  && (
                <div className='flex flex-col gap-3 text-xl'>
                   <h2 className='font-satoshi font-bold text-gray-600'>
                    Article <span className='blue_gradient'>Summary</span>
                   </h2>
                   <div className='summary_box'>
                       <p className='font-inter text-sm font-medium text-gray-700'>{article.summary}</p>
                  </div>
                </div>
               ))
          }
       </div>
    </section>
  )
}

export default Demo