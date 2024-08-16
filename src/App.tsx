import { useEffect, useState } from 'react'
import './App.css'
import Banner from './components/Banner'
import Header from './components/Header'
import MovieList from './components/MovieList'
import MovieSearch from './components/MovieSearch'

type Movie = {
  id:number,
  poster_path: string;
  title:string
}
function App() {
const [movie, setMovie] = useState<Movie[]>([])
const [movieRate, setMovieRate] = useState<Movie[]>([])
const [movieSearch, setMovieSearch] = useState<Movie[]>([])
const handleSearch = async (searchValue:string) => { 
  setMovieSearch([])
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=vi&page=1`;
      const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
  }
};
 const searchMovie = await fetch(url, options);
      const data = await searchMovie.json();
      setMovieSearch(data.results)
    } catch (error) {
      console.log(error)
    }
 }
  useEffect(()=>{
    const fechMovie = async () => { 
      const url1 = 'https://api.themoviedb.org/3/movie/popular?language=vi&page=1';
      const url2 = 'https://api.themoviedb.org/3/movie/top_rated?language=vi&page=1';
      const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
  }
};
      const [res1,res2] = await Promise.all([
                fetch(url1,options) ,
        fetch(url2,options) 
      ])
  const data1 = await res1.json()
  const data2 = await res2.json()
 
   if(data1 && data2){
    setMovie(data1.results)
    setMovieRate(data2.results)
   }
     }
     fechMovie()
  },[])
  return (
    <>
    <div className='bg-black pb-10'>
      <Header onSearch={handleSearch}/>
      <Banner/>
      {movieSearch.length >0 ?<MovieSearch title={'Kết quả tìm kiếm'} data={movieSearch}/>:(
       <>
        <MovieList title='Phim Hot' data={movie}/>
      <MovieList title='Phim Đề Cử' data={movieRate}/>
       </>
      )}
      
    </div>
    </>
  )
}

export default App
